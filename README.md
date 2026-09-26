# BHASHA SETU (भाषा सेतु)
> **“We Don’t Translate Words, We Translate Learnings.”**  
> *Bridging Languages, Empowering Learning.*

**Problem Statement:** AI-Powered Vernacular Pedagogy and Real-Time Translation Tool for Mother Tongue-Based Primary Education (Smart India Hackathon).  
**Primary Beneficiaries:** Primary-school teachers explaining fundamental science, mathematics, and environmental concepts to children in their mother tongue across multilingual tribal communities in Jharkhand.

---

## 🚀 Live Demo & Key Highlights

- **Pedagogical Classroom Console:** English speech input (`en-IN`) translated into regional and indigenous mother tongues.
- **6 Target Languages:** Hindi, Bengali, Santali, Mundari, Ho, and Kurukh.
- **Ethical AI & Linguistic Integrity:** 
  - Verified offline entries for Hindi and Bengali.
  - Transparent *“Sample translation requires validation by a fluent speaker”* status for tribal languages to avoid machine hallucination in primary classrooms.
- **Zero Paid Dependencies:** Uses client-side Web Speech API (`SpeechRecognition`) and Speech Synthesis (`SpeechSynthesisUtterance`). No API keys, no backend servers, no cloud costs.
- **Curricular Sentence Verification:** Includes 3 verified foundational primary science and math sentences.

---

## 💻 Local Setup & Execution

### Prerequisites
- Node.js (v18.0.0 or higher) and npm installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally in Development Mode
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build & Preview
```bash
npm run build
npm run preview
```

---

## ⚡ Shortest GitHub & Vercel Deployment Steps

### Option A: 1-Click Vercel CLI (Fastest)
1. In the project directory, run:
   ```bash
   npx vercel
   ```
2. Accept the defaults (`Framework: Vite`, `Build Command: npm run build`, `Output Directory: dist`).
3. Your live HTTPS URL will be generated in under 60 seconds.

### Option B: GitHub + Vercel Dashboard
1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Bhasha Setu prototype"
   git branch -M main
   git remote add origin https://github.com/<your-username>/bhasha-setu.git
   git push -u origin main
   ```
2. Open [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the `bhasha-setu` repository.
4. Leave framework preset as **Vite** and click **Deploy**.

---

## ⚠️ Browser & Language Limitations Checklist

1. **Microphone (Web Speech Recognition):**
   - **Chrome / Edge / Chromium Browsers:** Fully supported natively over HTTPS or `localhost`.
   - **Firefox / Safari:** The native `SpeechRecognition` API is either behind experimental flags or restricted. If unsupported, BHASHA SETU gracefully switches to fallback mode with verified sample sentence buttons.
   - **Permission Requirement:** Microphone access must be allowed in the browser prompt.
2. **Text-to-Speech (Web Speech Synthesis):**
   - **Hindi (`hi-IN`) & Bengali (`bn-IN`):** Voices are pre-installed on most modern Windows, Android, and macOS systems.
   - **Tribal Languages (Santali, Mundari, Ho, Kurukh):** Mainstream operating systems do not yet provide pre-installed neural TTS voice packs for these indigenous languages. The prototype flags this notice gracefully and plays a phonetic fallback when triggered.
3. **Offline In-Memory Dictionary Scope:**
   - The current prototype operates entirely on an in-memory curricular dictionary. Arbitrary spoken sentences outside the foundational samples will explicitly indicate that offline sample translations are not yet cached, preserving academic integrity rather than returning unverified outputs.

---

## 👥 Innovation Team

1. **Priyanshu Kumar Sinha** — Team Lead & Project Coordinator — *Data Science*
2. **Rommaan Qamar** — Frontend Developer — *Data Science*
3. **Aditya Kumar** — AI/ML & Translation Engineer — *Data Science*
4. **Snehal Kumari** — Speech & Voice Module Developer — *Data Science*
5. **Ishan Saha** — Backend & Database Developer — *Information Technology*
6. **Shayantan Mondal** — Research, Testing & Documentation — *Electronics and Communication Engineering*
