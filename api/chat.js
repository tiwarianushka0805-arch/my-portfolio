export default async function handler(req, res) {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const apiKey = process.env.GROQ_API_KEY;
  
    if (!apiKey) {
      return res.status(500).json({
        error: "AI service is not configured."
      });
    }
  
    const question = req.body?.message;
  
    if (
      typeof question !== "string" ||
      !question.trim() ||
      question.length > 2000
    ) {
      return res.status(400).json({
        error: "Enter a message of up to 2000 characters."
      });
    }
  
    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            temperature: 0.7,
            max_tokens: 300,
            messages: [
              {
                role: "system",
                content:
                  "You are an AI assistant for a portfolio website " +
                  "that includes a weather application. Answer questions " +
                  "about HTML, CSS, JavaScript, APIs, and the projects " +
                  "described to you. Do not invent personal information. " +
                  "Keep replies under 60 words."
              },
              {
                role: "user",
                content: question.trim()
              }
            ]
          })
        }
      );
  
      if (response.status === 429) {
        return res.status(429).json({
          error: "Too many requests. Please wait and try again."
        });
      }
  
      if (!response.ok) {
        console.error("Groq returned status:", response.status);
        return res.status(502).json({
          error: "AI service unavailable."
        });
      }
  
      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content;
  
      if (typeof answer !== "string" || !answer.trim()) {
        return res.status(502).json({
          error: "Invalid response from AI service."
        });
      }
  
      return res.status(200).json({ answer });
    } catch (error) {
      console.error("Chat backend request failed.");
      return res.status(500).json({
        error: "AI service unavailable. Please try again."
      });
    }
  }
  
