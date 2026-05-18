export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "https://elmano777.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Parse body seguro
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    const message = body?.message;

    if (!message) {
      return res.status(400).json({
        error: "No message received"
      });
    }

    // 🔥 GEMINI REQUEST CORRECTO
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1500
          }
        })
      }
    );

    const data = await response.json();

    // 🔍 debug (opcional pero útil)
    console.log("GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    // 🔥 validación fuerte
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({
        error: "Gemini no devolvió respuesta válida",
        raw: data
      });
    }

    return res.status(200).json({
      reply
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
