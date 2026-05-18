export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const message = body?.message;

    if (!message) {
      return res.status(400).json({ error: "No message received" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-v4-flash:free",
        messages: [{ role: "system", content: "Responde siempre en español. Usa tablas markdown cuando sea útil para explicar mejor." },{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
