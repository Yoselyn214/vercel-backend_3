export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "https://elmano777.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;
    const message = body?.message;
    if (!message) {
      return res.status(400).json({ error: "No message received" });
    }
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": Bearer ${process.env.OPENROUTER_API_KEY},
        "Content-Type": "application/json",
        "HTTP-Referer": "https://elmano777.github.io",
        "X-Title": "Chat Project"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-v4-flash:free",
        messages: [
          {
            role: "system",
            content: "Responde en español claro, ordenado y sin texto basura. Sé directo y útil."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });
    const data = await response.json();
    console.log("OPENROUTER RESPONSE:", JSON.stringify(data, null, 2));
    if (!response.ok) {
      return res.status(500).json({
        error: "OpenRouter error",
        details: data
      });
    }
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      return res.status(500).json({
        error: "Sin respuesta del modelo",
        raw: data
      });
    }
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
} 
