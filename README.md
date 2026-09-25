# FloraGuard AI 🌱

FloraGuard AI (also known as PlantCure AI) is an advanced, offline-capable plant pathology and diagnostic engine. It uses a custom **Local Heuristic Pixel Engine** to instantly detect lesions, chlorosis, and necrosis on plant leaves directly in the browser, before deferring to **Gemini 2.0 Flash** for deep agronomical analysis, chemical interventions, and organic remedy generation.

## 🚀 Live Demo
[https://agricure-ai-main.vercel.app](https://agricure-ai-main.vercel.app) *(Replace with your Vercel URL)*

---

## 🏗️ Architecture

```ascii
                      +-------------------+
                      |   Mobile / Web    | 
                      |   (Vite + React)  |
                      +---------+---------+
                                |
                   (1) Upload / Camera / Voice
                                |
                      +---------v---------+
                      | Local Canvas Engine |  <-- (2) Pixel-perfect lesion clustering
                      | (lesionDetector.js)|      Calculates affected area & health index
                      +---------+---------+
                                |
                                | (3) Send base64 image & symptoms
                                v
                      +---------+---------+
                      | Next.js API Route |  <-- (4) Rate Limiting (Upstash Redis)
                      |  (/api/analyze)   |
                      +---------+---------+
                                |
                                | (5) Call Gemini API
                                v
                      +---------+---------+
                      | Gemini 2.0 Flash  |  <-- Returns strictly structured JSON:
                      +-------------------+      (prognosis, treatments, tips)
                                |
                                | (6) Display results
                                v
                      +---------+---------+
                      |   Supabase Auth & |  <-- (7) Sync "Scan History" & "My Plants"
                      |   PostgreSQL DB   |      (Offline users save to localStorage)
                      +-------------------+
```

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **Frontend Framework** | React 18, Vite |
| **Styling** | Tailwind CSS v4, Lucide React Icons |
| **AI / Inference** | Google Gemini 2.0 Flash API |
| **Backend / Edge Functions** | Vercel Serverless Functions |
| **Database & Auth** | Supabase (PostgreSQL, Magic Link Auth) |
| **Rate Limiting** | Upstash Redis |
| **PWA / Offline** | `vite-plugin-pwa`, LocalStorage sync queue |
| **Testing** | Vitest |

---

## 💻 Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Bhavish-S/LeafCure.git
   cd LeafCure
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *Open `.env.local` and add your API keys (Gemini, Supabase, Upstash Redis).*

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Run Tests:**
   ```bash
   npm run test
   ```

---

## 🛡️ Disclaimer
**FloraGuard AI is an AI-assisted tool and is NOT a substitute for a professional agronomist.** 
Recommendations regarding chemical treatments and organic remedies should be verified with local agricultural authorities before application.
