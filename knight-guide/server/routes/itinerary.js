import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST: Generate AI trip plan
router.post("/generate", async (req, res) => {
  try {
    const {
      from,
      to,
      days,
      budget,
      pace,
      accessibility,
      interests,
    } = req.body;

    // 1️⃣ Build AI prompt
    const prompt = `
You are an expert travel planner.
Create a ${days}-day travel itinerary.

User details:
- From: ${from}
- Destination: ${to}
- Budget: ${budget}
- Travel pace: ${pace}
- Accessibility needs: ${accessibility.join(", ")}
- Interests: ${interests.join(", ")}

Rules:
- Make it accessibility-friendly
- Give day-wise plan
- Include travel tips
- Keep it simple and clear

Output format:
Day 1:
Day 2:
...
    `;

    // 2️⃣ Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 3️⃣ Send AI response to frontend
    res.json({
      success: true,
      itinerary: text,
    });

  } catch (error) {
    console.error("Gemini AI error:", error.message || error);
    console.error("Full error details:", JSON.stringify(error, null, 2));
    res.status(500).json({
      success: false,
      error: "AI failed to generate itinerary",
      details: error.message || "Unknown error"
    });
  }
});

export default router;
