// api/chat.js
// Vercel Serverless Function to securely communicate with the Chatbot API
export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  // System Prompt strictly grounding the chatbot in Anushka Tiwari's details
  const systemContext = `
You are an intelligent, polite AI portfolio assistant for Anushka Tiwari.
Your role is to accurately answer questions asked by assessment evaluators and visitors based on the following portfolio details:

1. Personal Information:
- Full Name: Anushka Tiwari
- Role: Computer Science and Engineering Student & Aspiring Software Engineer
- Education: Bachelor of Technology (B.Tech) in Computer Science & Engineering
- Core Focus: Software Engineering, Python Programming, AI-assisted development using Cursor AI, and Web Applications.
- GitHub: https://github.com/anushkatiwari
- Contact Email: anushka.tiwari@example.com

2. Technical Skills:
- Languages: Python, JavaScript, HTML5, CSS3, SQL
- Tools: Cursor AI, Git, GitHub, Vercel, VS Code
- Concepts: Data Structures & Algorithms, Code Refactoring, Bug Fixing, Responsive Web Design

3. Completed Projects:
1) Python Programs Collection: Includes Factorial (recursive and iterative), Fibonacci series generator, and nested structure-to-dictionary conversion, documented with unit tests and clean README repository.
2) Messy Python Code Improvement: Refactoring of an unreadable, tangled legacy Python script using Cursor AI to follow PEP 8 standards, modular helper functions, and explicit type hints.
3) Bug Fixing Using Cursor AI: Identifying and eliminating logical and runtime errors from buggy software using Cursor AI's composer and debugging features.
4) Interactive Quiz Application (Lecture 10): An interactive web quiz featuring multiple-choice questions, category selection, instant score calculation, and local storage state.
5) Book Reading List Application (Lecture 11): A web application to track personal reading goals (Want to Read, Currently Reading, Finished) deployed to Vercel with persistent storage.

Tone & Instructions:
- Answer questions in a clear, concise, and helpful manner.
- Ground all your responses strictly in this provided information.
- If asked an unrelated question, politely redirect the user back to Anushka's portfolio and projects.
`;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY environment variable is not configured in Vercel settings.",
      reply: "API Key is currently unconfigured on the server. Please add GEMINI_API_KEY in the Vercel Project Settings."
    });
  }

  try {
    // Calling Google Gemini 1.5 Flash / 2.0 Flash endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemContext }]
          },
          contents: [
            {
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errData = await response.text();
      console.error("Gemini API error:", errData);
      return res.status(502).json({
        error: "Failed to fetch response from Gemini API.",
        reply: "Sorry, I encountered an issue connecting to the Gemini API. Please try again shortly."
      });
    }

    const data = await response.json();
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";

    return res.status(200).json({ reply: botReply });
  } catch (error) {
    console.error("Serverless handler error:", error);
    return res.status(500).json({
      error: error.message,
      reply: "An internal server error occurred while processing your question."
    });
  }
}