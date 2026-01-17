import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialize Gemini - will be null if no API key
let genAI = null;
if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
    console.log("GEMINI_API_KEY not found in environment variables. using mock.");
}

// POST: Generate AI trip plan
router.post("/generate", async (req, res) => {
    try {
        const {
            location,
            startDate,
            endDate,
            mood,
            userNeedsContext,
        } = req.body;

        // Calculate days
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dayCount = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

        // If no Gemini API key, return mock
        if (!genAI) {
            return res.json({
                success: true,
                itinerary: generateMockItinerary(location, dayCount, mood, userNeedsContext)
            });
        }

        // Build concise prompt for speed
        const prompt = `Generate a ${dayCount}-day accessible travel itinerary for ${location}.
Mood: ${mood || "balanced"}
Accessibility: ${JSON.stringify(userNeedsContext || {})}

Return ONLY valid JSON (no markdown):
{
  "tripSummary": "brief summary",
  "accessibilityNotes": "key accessibility features",
  "days": [{"day": 1, "title": "Day 1 Title", "activities": [{"time": "9:00 AM", "activity": "description", "accessibility": "accessibility note"}]}]
}`;

        // Use flash model for speed
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash-exp",
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1500,
            }
        });

        // Add timeout
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("AI generation timed out")), 25000)
        );

        const aiPromise = model.generateContent(prompt);
        const result = await Promise.race([aiPromise, timeoutPromise]);
        
        const response = await result.response;
        let text = response.text();

        // Clean up response
        text = text.replace(/```json|```/g, "").trim();

        // Parse JSON
        let itinerary;
        try {
            itinerary = JSON.parse(text);
        } catch (parseError) {
            console.error("Failed to parse AI response, using fallback");
            itinerary = generateMockItinerary(location, dayCount, mood, userNeedsContext);
        }

        res.json({
            success: true,
            itinerary,
        });

    } catch (error) {
        console.error("Gemini AI error:", error.message || error);
        
        // Fallback to mock on any error
        const { location, startDate, endDate, mood, userNeedsContext } = req.body;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dayCount = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

        res.json({
            success: true,
            itinerary: generateMockItinerary(location, dayCount, mood, userNeedsContext),
        });
    }
});

// Mock itinerary generator for fallback
function generateMockItinerary(location, dayCount, mood, userNeedsContext) {
    const days = [];
    for (let i = 0; i < dayCount; i++) {
        days.push({
            day: i + 1,
            title: `Day ${i + 1} - Exploring ${location}`,
            activities: [
                {
                    time: "9:00 AM",
                    activity: `Morning: ${mood === "adventure" ? "Hiking trails" : mood === "relaxing" ? "Spa & wellness" : "City walking tour"} in ${location}`,
                    accessibility: userNeedsContext?.mobility?.wheelchairAccess ? "Wheelchair accessible" : "Standard access"
                },
                {
                    time: "12:30 PM",
                    activity: `Lunch at accessible local restaurant`,
                    accessibility: "Accessible seating available"
                },
                {
                    time: "2:30 PM",
                    activity: `Afternoon: ${mood === "cultural" ? "Museum visit" : mood === "adventure" ? "Adventure activity" : "Sightseeing"}`,
                    accessibility: userNeedsContext?.mobility?.avoidStairs ? "Elevator access" : "Multiple floors"
                },
                {
                    time: "7:00 PM",
                    activity: `Dinner at recommended restaurant`,
                    accessibility: userNeedsContext?.dietary?.halal ? "Halal options" : "Diverse menu"
                }
            ]
        });
    }

    return {
        tripSummary: `Your ${dayCount}-day ${mood || "personalized"} trip to ${location}`,
        accessibilityNotes: "Itinerary optimized for your accessibility preferences",
        days
    };
}

export default router;

