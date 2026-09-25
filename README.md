# PlantCure AI

A fast, client-side first botanical diagnostics web app with an AI deep-analysis fallback.

## Setup Instructions

1. Obtain a Gemini API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Copy `.env.example` to `.env` and set your key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
3. When deploying to Vercel, ensure you add `GEMINI_API_KEY` to the project's Environment Variables and redeploy.

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)
