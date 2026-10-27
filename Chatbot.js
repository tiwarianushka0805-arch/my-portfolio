const chatInput = document.getElementById("userInput");
const chatButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");
const chatStatus = document.getElementById("chatStatus");

let chatTemperature = 0.3;

// Actual portfolio information
const portfolioContext = `
PERSONAL INFORMATION

Name: Anushka Tiwari
Professional headline: AI/ML Engineer (student)
Education: B.Tech in Computer Science and Engineering (Artificial Intelligence and Machine Learning) at JECRC University.

ABOUT
Anushka Tiwari is a B.Tech CSE (AI & ML) student at JECRC University.
She is passionate about technology, programming, data visualization,
artificial intelligence, and machine learning. She enjoys learning new
skills and building projects that turn ideas into practical solutions.
She is strengthening her programming skills and learning web development
and data visualization.

TECHNICAL SKILLS
- C++ Programming
- Python Programming
- Power BI Basics
- Data Structures and Algorithms (DSA)
- Data Visualization

PROJECTS

1. Python Programs Collection
Description: A collection of Python programs, including factorial,
Fibonacci, and other basic programming examples.
Technologies: Python

2. Messy Python Code Improvement
Description: A Python project demonstrating how messy code can be
reviewed and improved using AI.
Technologies: Python, Google Colab, AI

3. Bug Fixing Using Cursor AI
Description: A debugging project demonstrating how Cursor AI can
identify and help fix a logical error in a Python program.
Technologies: Python, Cursor AI, Google Colab

4. Interactive Quiz Application
Description: An interactive quiz website where users answer questions,
check their answers, and view their final score.
Technologies: HTML, CSS, JavaScript

5. Book Reading List Application
Description: A responsive reading list application that lets users
add books, update reading status, filter books, delete books,
and view summary counts.
Technologies: HTML, CSS, JavaScript

WEATHER APPLICATION
The portfolio includes a weather feature. Specific functionality,
implementation details, and weather API information have not been provided.

RESPONSE RULES
- Answer questions about Anushka's education, skills, and projects using
  only the information provided above.
- Do not invent grades, marks, work experience, certifications,
  achievements, project links, or other personal details.
- If information is missing, say it is not available in the portfolio.
- If asked about a project, explain its purpose and technologies.
- Keep answers clear, friendly, and concise, usually under 100 words.
- Focus primarily on questions related to this portfolio.
`;

function showChatMessage(role, text) {
  const message = document.createElement("div");

  message.className =
    "chat-message " +
    (role === "user" ? "chat-user" : "chat-assistant");

  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendChatMessage() {
  if (chatButton.disabled) return;

  const question = chatInput.value.trim();
  if (!question) return;

  showChatMessage("user", question);
  chatInput.value = "";

  chatButton.disabled = true;
  chatStatus.textContent = "AI is thinking...";

  try {
    if (
      typeof CONFIG === "undefined" ||
      !CONFIG.apiKey ||
      CONFIG.apiKey === "Redacted"
    ) {
      throw new Error("CONFIG_MISSING");
    }

    const response = await fetch(
      CONFIG.baseUrl.replace(/\/$/, "") + "/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + CONFIG.apiKey
        },
        body: JSON.stringify({
          model: CONFIG.model,
          temperature: chatTemperature,
          messages: [
            {
              role: "system",
              content: portfolioContext
            },
            {
              role: "user",
              content: question
            }
          ]
        })
      }
    );

    if (response.status === 429) {
      throw new Error("RATE_LIMIT");
    }

    if (!response.ok) {
      throw new Error("API_ERROR");
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content;

    if (typeof answer !== "string" || !answer.trim()) {
      throw new Error("INVALID_RESPONSE");
    }

    showChatMessage("assistant", answer.trim());

  } catch (error) {
    console.error("Chat error:", error.message);

    if (error.message === "CONFIG_MISSING") {
      showChatMessage(
        "assistant",
        "Chatbot configuration is unavailable. Please try again later."
      );
    } else if (error.message === "RATE_LIMIT") {
      showChatMessage(
        "assistant",
        "The AI service has reached its request limit. Please try again later."
      );
    } else if (!navigator.onLine) {
      showChatMessage(
        "assistant",
        "No internet connection. Please reconnect and try again."
      );
    } else {
      showChatMessage(
        "assistant",
        "The AI service is temporarily unavailable. Please try again later."
      );
    }

  } finally {
    chatButton.disabled = false;
    chatStatus.textContent = "";
  }
}

chatButton.addEventListener("click", sendChatMessage);

chatInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    sendChatMessage();
  }
});
