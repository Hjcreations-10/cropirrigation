# 🚀 Deploying KrishiMitra AI on Vercel

This full-stack voice-and-SMS agricultural intelligence platform is designed to be easily deployed to Vercel with zero additional configuration required.

## Quick Start (Deploy to Vercel)

1. **Push to GitHub**: Push this codebase to a repository on your GitHub account.
2. **Import to Vercel**: 
   - Go to [Vercel](https://vercel.com) and click **Add New Project**.
   - Select your imported GitHub repository.
3. **Configure Settings**:
   - Vercel automatically detects the project framework (Vite).
   - Under **Build and Development Settings**, leave the default settings as they are:
     - **Build Command**: `vite build` (or `npm run build` which Vite configures)
     - **Output Directory**: `dist`
4. **Add Environment Variables**:
   - In Vercel's project settings, navigate to **Environment Variables** and add:
     - `GEMINI_API_KEY`: Your Google Gemini API key (retrieve one from [Google AI Studio](https://aistudio.google.com/)).
     - `NODE_ENV`: `production` (automatically set by Vercel).
5. **Click Deploy**: Vercel will build the frontend assets and automatically host the backend APIs as lightning-fast Serverless Functions!

---

## Technical Architecture for Serverless Compatibility

To ensure the platform runs flawlessly on serverless environments like Vercel, the following optimizations have been built-in:
1. **Express Serverless Handler**: An `api/index.ts` entry point is provided to export the Express application instance, which Vercel maps automatically to a serverless function endpoint.
2. **Read-Only Filesystem Adaptability**: Serverless environments have read-only filesystems (except for the `/tmp` folder). The application automatically detects Vercel environments and points the local JSON state database `db.json` to `/tmp/db.json`, automatically seeding it from the project root `db.json` if it does not yet exist.
3. **Dynamic Pathing & Fallback Router**: A clean `vercel.json` maps incoming `/api/*` requests to the serverless function and delegates all other requests to the Vite Single Page Application (SPA) bundle.
