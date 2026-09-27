# BHASHA SETU (भाषा सेतु)
> **“We Don’t Translate Words, We Translate Learnings.”**  
> *Bridging Languages, Empowering Learning.*

**Problem Statement:** AI-Powered Vernacular Pedagogy and Real-Time Translation Tool for Mother Tongue-Based Primary Education (Smart India Hackathon).  
**Primary Beneficiaries:** Primary-school teachers explaining fundamental science, mathematics, and environmental concepts to children in their mother tongue across multilingual communities in Jharkhand.

---

## 🌟 Key Features

1. **AI Vernacular Pedagogy & Context-Aware Translation**:
   - Live translation of English, Hindi, Marathi, Hinglish, classroom dialogues, and colloquial slang into 6 Jharkhand regional & tribal mother tongues: **Hindi, Bengali, Santali, Mundari, Ho, and Kurukh**.
   - Integrates Google Gemini API (`@google/genai`) with priority model `gemini-3.8-flash` and resilient active fallbacks (`gemini-3.5-flash`, `gemini-3.5-flash-lite`, `gemini-3.1-flash-lite`).
   - Translates concepts into child-friendly primary school vocabulary rather than literal words.

2. **Multilingual Speech Recognition & Synthesis**:
   - Microphone input with live Web Speech recognition for Indian English (`en-IN`), Hindi (`hi-IN`), Marathi (`mr-IN`), Bengali (`bn-IN`), and mixed classroom speech.
   - Text-to-Speech audio playback with phonetic reading guides in Devanagari and Latin scripts.

3. **AI-Powered Animated Visual Learning**:
   - Dynamic SVG visual diagrams that automatically illustrate translated concepts (photosynthesis plant growth, evaporation & water cycle, triangle geometry, celestial bodies, arithmetic, classroom dialogues).

4. **Authentic Native Script Typography**:
   - Authentic Unicode rendering for **Ol Chiki** (Santali), **Warang Citi** (Ho), **Devanagari** (Hindi, Mundari, Kurukh), and **Eastern Nagari** (Bengali) using Google Fonts with reliable OS fallbacks.

5. **Cinematic Floating Team Landing Screen**:
   - Immersive zero-gravity floating animation featuring the 6 student engineers orbiting around the central branding, with instant entry controls and accessible keyboard navigation.

6. **Secure Backend Architecture & Error Resilience**:
   - Backend translation endpoints (`/api/translate` and `/api/status`) run securely in Node.js / Vite middleware. API keys are stored strictly in environment variables and are **never** exposed in the client-side bundle.
   - Integrated React `ErrorBoundary` prevents blank pages across mobile and older devices.

---

## 📋 Prerequisites

- **Node.js**: `v18.0.0` or higher (recommended: `v20.x`)
- **npm**: `v9.0.0` or higher
- *(Optional for Containerization)*: **Docker Engine** (`20.10+`) and **Docker Compose** (`v2.x+`)

---

## 🚀 Quick Start (Local Development)

### 1. Extract or Clone the Project
```bash
cd bhasha-setu
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the template file:
```bash
# On Linux / macOS:
cp .env.example .env

# On Windows PowerShell:
Copy-Item .env.example .env
```

Open `.env` in an editor and supply your Gemini API key:
```env
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here
```
> **Get a free Gemini API key:** Visit [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Run the Development Server
```bash
npm run dev -- --host 0.0.0.0 --port 5173
```
Open **`http://localhost:5173`** in your browser (Google Chrome or Microsoft Edge recommended for Web Speech features).

### 5. Run the Automated Test Suite
```bash
npm test
```
Runs 37 automated tests covering language definitions, sample sentences, team records, visual classifiers, and Gemini service handling.

---

## 🐳 Docker Deployment

The project includes a ready-to-run `Dockerfile` and `docker-compose.yml`.

### Method A: Using Docker Compose (Recommended)

1. Ensure your `.env` file exists with `GEMINI_API_KEY` set.
2. Build and run the container:
   ```bash
   docker compose up --build -d
   ```
3. Access the application at **`http://localhost:5173`**.
4. To view logs:
   ```bash
   docker compose logs -f
   ```
5. To stop the container:
   ```bash
   docker compose down
   ```

### Method B: Using Plain Docker CLI

1. Build the Docker image:
   ```bash
   docker build -t bhasha-setu .
   ```
2. Run the container with your `.env` file:
   ```bash
   docker run -d -p 5173:5173 --name bhasha-setu-app --env-file .env bhasha-setu
   ```
3. Open **`http://localhost:5173`** in your browser.

---

## 📱 Accessing from Mobile & Other Devices (LocalTunnel)

If you are demoing on another phone or tablet:

1. **Start the server bound to `0.0.0.0`**:
   ```bash
   npm run dev -- --host 0.0.0.0 --port 5173
   ```
2. **Start LocalTunnel** (in a separate terminal):
   ```bash
   npx localtunnel --port 5173 --subdomain heavy-parents-sniff
   ```
3. Open **`https://heavy-parents-sniff.loca.lt`** on your mobile device.
   - *Note on LocalTunnel Security Page*: When visiting on a new device, LocalTunnel will prompt for the **Tunnel Password**. This password is your host machine's public IP address (found by visiting [loca.lt/mytunnelpassword](https://loca.lt/mytunnelpassword) on your host PC).

---

## 🧪 Post-Installation Feature Verification Checklist

After installation, verify all core pedagogical features:

| Feature | Verification Step | Expected Outcome |
| :--- | :--- | :--- |
| **AI Translation** | Type *"Plants need sunlight and water"* and click **Translate Lesson**. | Receives vernacular translation, phonetic guide, pedagogical note, and concept tags. |
| **Microphone Input** | Click the microphone button and speak a phrase. | Audio waveform pulses red, and transcribed text appears in the input area. |
| **Audio Playback** | Click the blue **Listen** button next to translated text. | Synthesizes spoken audio output via browser Web Speech API. |
| **Visual Learning** | Check the **Visual Learning** card next to the translation. | Displays an animated SVG illustration matching the scientific or mathematical concept. |
| **Offline Sample Mode** | Select one of the quick sample buttons (e.g. *Plant Growth* or *Triangle*). | Populates sample sentence with instant offline translation. |
| **Tribal Script Display** | Select **Ho** or **Santali** from the language selector. | Displays authentic Warang Citi / Ol Chiki characters with phonetic transliteration. |

---

## 🔒 Security & Sharing Guidelines

- **`.env` files are strictly excluded** in `.gitignore` and `.dockerignore`.
- **Never commit API keys** to public repositories or shared ZIP archives.
- When sharing a ZIP with other developers or judges:
  1. Verify that `.env` is omitted from the archive.
  2. Include `.env.example` so recipient developers can supply their own keys.
  3. Recipients simply run `npm install`, add their key to `.env`, and start the app with `npm run dev`.

---

## 👥 Innovation Team

- **Priyanshu Kumar Sinha** — Team Lead & Project Coordinator (*Data Science*)
- **Rommaan Qamar** — Frontend Developer (*Data Science*)
- **Aditya Kumar** — AI/ML & Translation Engineer (*Data Science*)
- **Snehal Kumari** — Speech & Voice Module Developer (*Data Science*)
- **Ishan Saha** — Backend & Database Developer (*Information Technology*)
- **Shayantan Mondal** — Research, Testing & Documentation (*Electronics and Communication Engineering*)
