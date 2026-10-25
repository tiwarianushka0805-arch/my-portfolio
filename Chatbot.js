const chatInput = document.getElementById("userInput");
const chatButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");
const chatStatus = document.getElementById("chatStatus");

let chatSending = false;

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
  if (chatSending) return;

  const question = chatInput.value.trim();

  if (!question) return;

  if (question.length > 2000) {
    showChatMessage(
      "assistant",
      "Please keep your message under 2000 characters."
    );
    return;
  }

  showChatMessage("user", question);
  chatInput.value = "";

  chatSending = true;
  chatButton.disabled = true;
  chatStatus.textContent = "AI is thinking...";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: question
      })
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 429) {
      throw new Error("RATE_LIMIT");
    }

    if (!response.ok) {
      throw new Error("API_ERROR");
    }

    if (
      typeof data.answer !== "string" ||
      !data.answer.trim()
    ) {
      throw new Error("INVALID_RESPONSE");
    }

    showChatMessage("assistant", data.answer);

  } catch (error) {
    console.error("Chat request failed:", error.message);

    if (error.message === "RATE_LIMIT") {
      showChatMessage(
        "assistant",
        "Too many requests. Please wait and try again."
      );
    } else if (!navigator.onLine) {
      showChatMessage(
        "assistant",
        "No internet connection. Please reconnect."
      );
    } else {
      showChatMessage(
        "assistant",
        "AI service unavailable. Please try again."
      );
    }

  } finally {
    chatSending = false;
    chatButton.disabled = false;
    chatStatus.textContent = "";
  }
}

if (chatInput && chatButton && chatMessages && chatStatus) {
  chatButton.addEventListener("click", sendChatMessage);

  chatInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.isComposing) {
      event.preventDefault();
      sendChatMessage();
    }
  });
} else {
  console.error(
    "Chatbot initialization failed: required HTML elements were not found."
  );
}
