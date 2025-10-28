import express from "express";
import OpenAI from "openai";

const router = express.Router();

router.get("/test", async (req, res) => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const models = await openai.models.list();
    res.json({ message: "✅ AI Connected Successfully", models: models.data.slice(0, 3) });
  } catch (err) {
    console.error("AI connection failed:", err);
    res.status(500).json({ message: "❌ AI connection failed" });
  }
});

export default router;
