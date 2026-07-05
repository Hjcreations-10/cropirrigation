/**
 * Local Development Server
 * ========================
 * This file is ONLY used for local development (`npm run dev`).
 * It imports the Express app from api/index.ts (which is self-contained)
 * and attaches Vite's dev middleware for hot-module-replacement.
 *
 * On Vercel, api/index.ts is deployed directly as a serverless function
 * and this file is never loaded.
 */
import express from "express";
import path from "path";
// tsx resolves .ts extensions at runtime — this import is fine for local dev
import app from "./api/index.ts";

const PORT = 3000;

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 KrishiMitra AI server running on port ${PORT}`);
  });
}

startServer();
