import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/generate', async (req, res) => {
    try {
      const { idea } = req.body;
      if (!idea) {
        return res.status(400).json({ error: "Idea is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing" });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `You are an expert product manager and software architect.
Generate a structured prototype concept for the follow idea: "${idea}"

Respond EXCLUSIVELY with a raw JSON object matching this schema (do NOT wrap in markdown \`\`\`json blocks):
{
  "title": "A catchy title",
  "tagline": "A short, punchy tagline",
  "targetAudience": "Who is this for?",
  "problemSolved": "What problem does this solve?",
  "coreFeatures": ["Feature 1", "Feature 2", "Feature 3"],
  "suggestedScreens": [
    { "name": "Dashboard", "description": "What is on the dashboard" }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text || "{}";
      let parsed;
      try {
        const cleanedText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
        parsed = JSON.parse(cleanedText);
      } catch (err) {
        console.error("Failed to parse JSON", responseText);
        return res.status(500).json({ error: "Failed to parse AI response" });
      }

      res.json(parsed);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || "An error occurred" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
