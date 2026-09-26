# BHASHA SETU (भाषा सेतु)
> **“We Don’t Translate Words, We Translate Learnings.”**  
> *Bridging Languages, Empowering Learning.*

**Problem Statement:** AI-Powered Vernacular Pedagogy and Real-Time Translation Tool for Mother Tongue-Based Primary Education (Smart India Hackathon).  
**Primary Beneficiaries:** Primary-school teachers explaining fundamental science, mathematics, and environmental concepts to children in their mother tongue across multilingual tribal communities in Jharkhand.

---

## 🚀 Key Features

- **Real Google Gemini AI Translation:** Live context-aware translation of arbitrary English, Hindi, Marathi, Hinglish, mixed classroom dialects, and slang into Jharkhand vernaculars (Hindi, Bengali, Santali, Mundari, Ho, Kurukh).
- **Pedagogical Child-Centric Prompting:** Formulates explanations tailored for primary school comprehension (Grades 1 to 5) rather than stiff literal translations.
- **Multilingual Speech Recognition:** Live microphone input supporting Indian English (`en-IN`), Hindi (`hi-IN`), Marathi (`mr-IN`), Bengali (`bn-IN`), and mixed classroom speech.
- **Speech-to-Speech Flow:** Microphone Speech Recognition → Gemini AI Translation → Translated Text Display & Phonetic Guide → Web Speech Text-to-Speech Audio Playback.
- **Secure Backend API:** API keys are managed exclusively on the server side (`process.env.GEMINI_API_KEY`) via backend endpoints (`/api/translate`, `/api/status`) and are never exposed in client bundle code.
- **Ethical Integrity & Graceful Validation:** Includes sample prompts for instant testing and clear status reporting if an API key is not yet configured.

---

## 🔑 Gemini API Key Configuration

To enable real-time AI translation for arbitrary sentences and tribal languages:

1. **Get a free Gemini API key:**
   Visit **[Google AI Studio](https://aistudio.google.com/app/apikey)** and click **Create API Key**.

2. **Add to `.env`:**
   Open the `.env` file in the project root (`C:\Users\HP\.gemini\antigravity\scratch\bhasha-setu\.env`) and add your key:
   ```env
   GEMINI_API_KEY=AIzaSy...your_actual_api_key_here
   ```

3. **Restart the server (if already running):**
   ```bash
   npm run dev
   ```
   The console will automatically detect your key and switch to live AI translation mode.

---

## 💻 Local Setup & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally in Development Mode
```bash
npm run dev
```
Open **`http://localhost:5173`** in Google Chrome or Microsoft Edge.

### 3. Run Automated Test Suite
```bash
npm test
```
Verifies languages, sample data, team cards, API error handling, and Gemini service logic.

### 4. Run Production Build & Server
```bash
npm run build
node server.mjs
```

---

## ⚡ Deployment Instructions

### Vercel / Cloud Deployment
1. Set the Environment Variable in your deployment dashboard:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Your Gemini API key from Google AI Studio.
2. Build command: `npm run build`
3. Output directory: `dist`

---

## 👥 Innovation Team

1. **Priyanshu Kumar Sinha** — Team Lead & Project Coordinator — *Data Science*
2. **Rommaan Qamar** — Frontend Developer — *Data Science*
3. **Aditya Kumar** — AI/ML & Translation Engineer — *Data Science*
4. **Snehal Kumari** — Speech & Voice Module Developer — *Data Science*
5. **Ishan Saha** — Backend & Database Developer — *Information Technology*
6. **Shayantan Mondal** — Research, Testing & Documentation — *Electronics and Communication Engineering*
