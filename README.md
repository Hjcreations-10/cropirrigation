# 🌾 KrishiMitra (কৃষিমিত্র / कृषिमित्र) — Premium AI SaaS Platform for Farmers

KrishiMitra is a state-of-the-art agricultural advisory and diagnostic SaaS platform designed to bridge the gap between AI pathology diagnostics, real-time market insights (APMC Mandis), and rural accessibility. Built with a responsive mobile-first simulator, a high-fidelity laboratory-themed expert console, and localized accessibility features.

👉 **View App in AI Studio**: [AI Studio App Link](https://ai.studio/apps/35521db9-f224-4cb9-ab73-104a55040b0a)

---

## 🗺️ Application Architecture & Plan

KrishiMitra is engineered to run seamlessly locally and as serverless functions on Vercel:

```mermaid
graph TD
    A[Client UI / React Frontend] -->|HTTP / JSON| B[Express API Server]
    A -->|Web Speech API| C[Client TTS & Speech Recognition]
    B -->|Pathology Logs & Tickets| D[Server Database /tmp/db.json]
    B -->|Gemini API Calls| E[@google/genai]
```

### Core Modules
1. **Mobile Farmer Simulator (`MobileSimulator.tsx`)**:
   * Simulates an offline-compatible rural smartphone workspace.
   * Features localized input controls for NPK soil analytics, disease reporting, weather advisories, voice-assistant chats, and SMS alerts.
2. **Pathologist Expert Console (`ExpertPortal.tsx`)**:
   * A high-tech digital laboratory dashboard where plant pathologists review escalated logs.
   * Includes virtual microscope simulators, crop-health logs, and resolution dispatches.
3. **Local Dev & Serverless Backend (`server.ts`)**:
   * An Express backend hosting API routes for weather synthesis, APMC prices, disease diagnosis, and SMS gateways.
   * Optimized using dynamic imports for Vite to prevent Vercel builder cold-start bundle bloat.

---

## ✨ Premium Features & Capabilities

### 🔬 1. AI Leaf Multi-Spectral Scanning
* **Sweeping Laser Overlay**: Utilizes CSS-driven `@keyframes laser` and brackets to display an active scanning matrix over uploaded crop leaves or presets.
* **Stage Simulation**: Progression states simulate spectral optics initialization, chlorophyll density checks, and classification before rendering diagnostics.
* **Treatment Checklists**: Actionable step-by-step checklist with real-time percentage progress trackers.

### 📊 2. Soil NPK Circular Gauges
* **Dynamic SVG Gauges**: Displays Nitrogen (N), Phosphorus (P), and Potassium (K) levels relative to the ideal threshold of the recommended crop.
* **Fit Compatibility Index**: Formulates a percentage alignment score representing the match quality of the soil.

### 🌦️ 3. Dynamic Weather & Irrigation Timelines
* **Atmospheric overlays**: Cascading animated rain effects overlay weather dashboards when precipitation is reported.
* **Irrigation Scheduler**: Guidance timeline suggesting morning, noon, and evening watering suitability based on wind speed and transpiration rates.

### 📈 4. APMC Mandi Price Tracker
* **7-Day Trend Sparklines**: Seamless vector graphs displaying daily price trends (Rising, Falling, Stable).
* **Payout Calculator**: Interactive quintal calculator to estimate immediate crop sales revenue.

### 🔊 5. Localized Text-to-Speech (TTS)
* **Regional Voice Synthesis**: Reads out weather forecasts, treatments, soil recommendations, and pathologist notes.
* **11 Regional Languages**: Fully supports English, Telugu (తెలుగు), Hindi (हिन्दी), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Marathi (मराठी), Bengali (বাংলা), Gujarati (ગુજરાતી), Punjabi (ਪੰਜਾਬੀ), and Oriya (ଓଡ଼ିଆ).

---

## 🛠️ Run Locally

**Prerequisites:** Node.js (v18+)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` or `.env.local` file in the root folder and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

3. **Start Local Development Server**:
   ```bash
   npm run dev
   ```
   * Access the local development port at: [http://localhost:3000](http://localhost:3000)

4. **Verify / Run Linter checks**:
   ```bash
   npm run lint
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## ☁️ Vercel Serverless Deployment

This platform is configured for instant deployment to Vercel:
* Vite assets build to `/dist` and are served statically.
* API routes are mapped via the configuration specified in [vercel.json](vercel.json).
* Runtime database storage falls back to `/tmp/db.json` ensuring serverless writes do not trigger file-lock errors.
