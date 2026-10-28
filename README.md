# Anushka Tiwari - Personal Portfolio & AI Chatbot

A personalized, responsive portfolio website built with HTML5, CSS3, JavaScript, and an integrated AI Chatbot powered by Google Gemini API and Vercel Serverless Functions.

## 🚀 Live Demo
- **Portfolio Website:** [https://anushka-tiwari-portfolio.vercel.app](https://my-portfolio-anushka-tiwari.vercel.app/)
- **GitHub Repository:** [https://github.com/anushkatiwari/personal-portfolio](https://github.com/tiwarianushka0805-arch/my-portfolio)

## 📌 Project Features
1. **Personalized Identity (Task 1):** Full profile details, CSE educational background, skills, and contact links.
2. **Featured Projects (Task 2):**
   - **Python Programs Collection:** Factorial, Fibonacci, and Structure-to-Dictionary with unit tests.
   - **Messy Python Code Improvement:** AI-assisted refactoring to PEP 8 standards with Cursor AI.
   - **Bug Fixing Using Cursor AI:** Diagnostics and resolution of syntax, runtime, and logic errors.
   - **Interactive Quiz Application (Lecture 10):** Dynamic scoring and quiz engine.
   - **Book Reading List Application (Lecture 11):** Productivity reading tracker with live cloud deployment.
3. **Interactive Search & Filtering (Task 3):** Real-time text search and category pills (Python, Cursor, Web Apps) + persistent Dark/Light mode.
4. **API-Connected Chatbot (Task 6):** Embedded AI assistant grounded in portfolio data with secure serverless API key management via Vercel.

## 🛠️ Technologies Used
- **Frontend:** HTML5, CSS3 (Custom Variables, Flexbox, Grid), Modern JavaScript (ES6+), Lucide Icons
- **Backend / Serverless:** Vercel Serverless Functions (`/api/chat.js`)
- **AI / LLM:** Google Gemini API
- **Tooling:** Cursor AI, Git, GitHub, Vercel

## 💻 Local Setup & Deployment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anushkatiwari/personal-portfolio.git
   cd personal-portfolio
   ```

2. **Run locally:**
   Open `index.html` in your browser, or run a local server (e.g. `npx serve .` or VS Code Live Server).

3. **Deploy to Vercel (Task 5 & 6):**
   - Push your code to GitHub.
   - Go to [Vercel](https://vercel.com) and import the repository.
   - In **Project Settings** > **Environment Variables**, add:
     - **Key:** `GEMINI_API_KEY`
     - **Value:** `<Your Google Gemini API Key>`
   - Deploy!
