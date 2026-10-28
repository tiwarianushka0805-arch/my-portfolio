/* ==========================================================================
   Anushka Tiwari Portfolio & Chatbot Scripts
   Tasks: Projects Data, Search & Filter, Dark/Light Mode, Chatbot Integration
   ========================================================================== */

// 1. Projects Data (All 5 Required Projects from Assessment Task 2)
const projects = [
  {
    id: 1,
    title: "Python Programs Collection",
    badge: "Algorithms & Data Structures",
    category: "python",
    description: "A foundational suite of Python programs including recursive/iterative factorial computation, Fibonacci series generation, and nested structure-to-dictionary conversion. Features structured unit test cases and a comprehensive README repository.",
    technologies: ["Python"],
    githubUrl: "https://github.com/tiwarianushka0805-arch/Python_basics_25BCON0855",
    liveUrl: "" // Optional / Console based
  },
  {
    id: 2,
    title: "Messy Python Code Improvement",
    badge: "Refactoring & AI Assistance",
    category: "python",
    description: "Refactored legacy spaghetti Python code using Cursor AI assistance. Restructured functions into modular classes, adhered strictly to PEP 8 standards, added explicit type hints, and eliminated code smells and redundant conditionals.",
    technologies: ["Python", "Cursor AI", "Google Colab"],
    githubUrl: "https://github.com/tiwarianushka0805-arch/messy-python-code-improvement",
    liveUrl: ""
  },
  {
    id: 3,
    title: "Bug Fixing Using Cursor AI",
    badge: "Debugging & AI Pairing",
    category: "cursor",
    description: "Identified and corrected runtime exceptions, index errors, and logical discrepancies in a buggy code project using Cursor AI composer and chat. Includes step-by-step documentation of bug prompts and comparative diffs.",
    technologies: ["Python", "Cursor AI", "Debugging", "Error Handling","Google Colab"],
    githubUrl: "https://github.com/tiwarianushka0805-arch/bug-fixing-using-cursor-ai",
    liveUrl: ""
  },
  {
    id: 4,
    title: "Interactive Quiz Application",
    badge: "Web Application (Lecture 10)",
    category: "web",
    description: "An engaging quiz application developed during Lecture 10. Features dynamic multi-choice questions, category selection, instant score calculation, countdown timer, and local storage progress tracking with a responsive UI.",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    githubUrl: "https://github.com/tiwarianushka0805-arch/interactive-quiz-application",
    liveUrl: "https://tiwarianushka0805-arch.github.io/interactive-quiz-application/"
  },
  {
    id: 5,
    title: "Book Reading List Application",
    badge: "Web Application (Lecture 11)",
    category: "web",
    description: "A productivity web app developed in Lecture 11 for organizing reading goals. Users can add books, filter by status (Want to Read, Reading, Finished), rate titles, and persist state across sessions with cloud deployment.",
    technologies: ["JavaScript", "HTML5", "CSS3", "Vercel"],
    githubUrl: "https://github.com/tiwarianushka0805-arch/reading-list-app",
    liveUrl: "https://reading-list-app-anushka-tiwari.vercel.app/"
  }
];

// 2. Render Projects Card Function
function renderProjects(items) {
  const container = document.getElementById("projectsContainer");
  const noResults = document.getElementById("noResults");

  if (!container) return;
  container.innerHTML = "";

  if (items.length === 0) {
    if (noResults) noResults.style.display = "block";
    return;
  }

  if (noResults) noResults.style.display = "none";

  items.forEach(proj => {
    const card = document.createElement("div");
    card.className = "card project-card";

    const techTags = proj.technologies
      .map(t => `<span class="tag">${t}</span>`)
      .join(" ");

    const liveBtn = proj.liveUrl 
      ? `<a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link"><i data-lucide="external-link" style="width:16px;"></i> Live App</a>`
      : "";

    card.innerHTML = `
      <div>
        <span class="project-badge">${proj.badge}</span>
        <h3>${proj.title}</h3>
        <p>${proj.description}</p>
        <div class="project-tech tags">${techTags}</div>
      </div>
      <div class="project-links">
        <a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link">
          <i data-lucide="github" style="width:16px;"></i> GitHub
        </a>
        ${liveBtn}
      </div>
    `;

    container.appendChild(card);
  });

  // Re-run Lucide icon creation on dynamically injected elements
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// 3. Search and Filter Logic (Task 3 Requirement)
let currentFilter = "all";
let searchKeyword = "";

function filterAndSearch() {
  const filtered = projects.filter(item => {
    const matchesFilter = currentFilter === "all" || item.category === currentFilter;
    const query = searchKeyword.toLowerCase().trim();
    
    const matchesSearch = query === "" || 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.badge.toLowerCase().includes(query) ||
      item.technologies.some(tech => tech.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  renderProjects(filtered);
}

// Setup Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Render initial projects
  renderProjects(projects);

  // Set Year in footer
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Search input handler
  const searchInput = document.getElementById("projectSearch");
  const clearBtn = document.getElementById("clearSearchBtn");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchKeyword = e.target.value;
      if (clearBtn) clearBtn.style.display = searchKeyword ? "block" : "none";
      filterAndSearch();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      searchKeyword = "";
      clearBtn.style.display = "none";
      filterAndSearch();
      searchInput.focus();
    });
  }

  // Category Filter pills
  const pills = document.querySelectorAll(".filter-pills .pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentFilter = pill.getAttribute("data-filter");
      filterAndSearch();
    });
  });

  // Dark/Light Mode Toggle
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const savedTheme = localStorage.getItem("portfolio_theme") || "dark";

  function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio_theme", theme);
    if (themeIcon) {
      themeIcon.setAttribute("data-lucide", theme === "dark" ? "sun" : "moon");
    }
    if (window.lucide) window.lucide.createIcons();
  }

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
    });
  }

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach(l => {
      l.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  // 4. Chatbot Setup (Task 6)
  setupChatbot();
});

// ==========================================
// Chatbot Client Integration (Task 6)
// ==========================================
function setupChatbot() {
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");
  const chatError = document.getElementById("chatError");
  const clearChatBtn = document.getElementById("clearChatBtn");
  const suggestionChips = document.querySelectorAll(".chat-suggestions .chip");

  // Client-side fallback knowledge base if API key is not yet configured on Vercel
  const localKnowledge = [
    {
      keywords: ["who", "introduce", "anushka", "about"],
      answer: "Anushka Tiwari is a Computer Science and Engineering student. She builds web applications and writes Python code, utilizing tools like Cursor AI, Git, and Vercel."
    },
    {
      keywords: ["skills", "technologies", "tech", "languages"],
      answer: "Anushka's technical skills include Python, JavaScript, HTML5, CSS3, Cursor AI, Git & GitHub, Vercel, REST API integration, and Data Structures."
    },
    {
      keywords: ["python", "factorial", "fibonacci", "programs"],
      answer: "The 'Python Programs Collection' project features factorial computation, Fibonacci series generation, and structure-to-dictionary conversion, all validated with clean unit tests and an updated README."
    },
    {
      keywords: ["messy", "refactor", "pep 8"],
      answer: "In the 'Messy Python Code Improvement' project, an unreadable Python script was refactored with Cursor AI to follow PEP 8 standards, modular functions, and robust type hints."
    },
    {
      keywords: ["bug", "buggy", "cursor", "corrected"],
      answer: "In the 'Bug Fixing Using Cursor AI' project, runtime errors and logic flaws were identified and corrected using Cursor AI's composer and inline assistant."
    },
    {
      keywords: ["quiz", "lecture 10"],
      answer: "The 'Interactive Quiz Application' (from Lecture 10) features multiple-choice questions, category selection, instant score calculation, and local storage tracking."
    },
    {
      keywords: ["book", "reading", "lecture 11"],
      answer: "The 'Book Reading List Application' (from Lecture 11) is a web application to organize reading lists (Want to Read, Reading, Finished) deployed live with persistent state."
    },
    {
      keywords: ["github", "repository", "repo", "link"],
      answer: "You can find all of Anushka's repositories at https://github.com/anushkatiwari."
    }
  ];

  function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = `message ${sender === "user" ? "user-msg" : "bot-msg"}`;
    msg.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escapeHtml(string) {
    return String(string)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function handleUserQuestion(question) {
    if (!question.trim()) return;

    appendMessage("user", question);
    if (chatInput) chatInput.value = "";
    if (chatError) chatError.style.display = "none";

    // Show temporary typing indicator
    const typingId = "typing-" + Date.now();
    const typingMsg = document.createElement("div");
    typingMsg.id = typingId;
    typingMsg.className = "message bot-msg";
    typingMsg.innerHTML = `<div class="msg-bubble"><em>Thinking...</em></div>`;
    chatMessages.appendChild(typingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      // Call the secure Vercel Serverless Function at /api/chat
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question })
      });

      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();

      if (response.ok) {
        const data = await response.json();
        appendMessage("bot", data.reply || "I didn't receive a clear answer. Please ask again!");
      } else {
        // Fallback to local grounded knowledge if API endpoint returns error or is unconfigured
        const lowerQ = question.toLowerCase();
        const matched = localKnowledge.find(k => k.keywords.some(kw => lowerQ.includes(kw)));
        
        if (matched) {
          appendMessage("bot", matched.answer);
        } else {
          appendMessage("bot", "I am Anushka's portfolio assistant. You can ask about her projects (Python collections, Bug fixing with Cursor, Quiz, Book list), technical skills, or GitHub!");
        }
      }
    } catch (err) {
      // Network failure / local offline fallback
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();

      const lowerQ = question.toLowerCase();
      const matched = localKnowledge.find(k => k.keywords.some(kw => lowerQ.includes(kw)));
      if (matched) {
        appendMessage("bot", matched.answer);
      } else {
        appendMessage("bot", "Anushka Tiwari is a Computer Science student with projects in Python, Cursor AI debugging, and Web Applications. Check out her projects section above!");
      }

      if (chatError) {
        chatError.textContent = "Note: Operating in local fallback mode. Connect your GEMINI_API_KEY on Vercel for live model responses.";
        chatError.style.display = "block";
      }
    }
  }

  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleUserQuestion(chatInput.value);
    });
  }

  suggestionChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const prompt = chip.getAttribute("data-prompt");
      handleUserQuestion(prompt);
    });
  });

  if (clearChatBtn) {
    clearChatBtn.addEventListener("click", () => {
      chatMessages.innerHTML = `
        <div class="message bot-msg">
          <div class="msg-bubble">Conversation reset! Feel free to ask any question about Anushka's portfolio and projects.</div>
        </div>
      `;
      if (chatError) chatError.style.display = "none";
    });
  }
}