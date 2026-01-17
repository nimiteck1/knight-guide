export const config = {
    verify_jwt: false,
};

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.26.0";

// CORS headers for browser requests
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // Check for API key
        const apiKey = Deno.env.get("OPENAI_API_KEY");
        if (!apiKey) {
            throw new Error("OPENAI_API_KEY not configured");
        }

        const openai = new OpenAI({ apiKey });

        const body = await req.json();

        const {
            location,
            startDate,
            endDate,
            mood,
            preferences,
        } = body;

        // Validate required fields
        if (!location || !startDate || !endDate) {
            throw new Error("Missing required fields: location, startDate, or endDate");
        }

        // Calculate number of days
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

        // Build accessibility summary
        const accessibilityNeeds = [];
        if (preferences?.wheelchairFriendly) accessibilityNeeds.push("wheelchair accessible");
        if (preferences?.avoidStairs) accessibilityNeeds.push("avoid stairs");
        if (preferences?.nearHospitals) accessibilityNeeds.push("near hospitals");

        const accessibilitySummary = accessibilityNeeds.length > 0
            ? accessibilityNeeds.join(", ")
            : "standard";

        // Concise prompt for fast generation
        const prompt = `Create a ${days}-day travel itinerary for ${location}.
Mood: ${mood || "relaxed"}
Accessibility needs: ${accessibilitySummary}

Return ONLY valid JSON in this exact format:
{
  "tripSummary": "A brief one-sentence summary of the trip",
  "accessibilityNotes": "Key accessibility information for the trip",
  "days": [
    {
      "day": 1,
      "title": "Day theme or title",
      "activities": [
        {
          "time": "9:00 AM",
          "activity": "Activity name and brief description",
          "accessibility": "Accessibility note for this activity"
        }
      ]
    }
  ]
}

Include 3 activities per day. No markdown, no code blocks, just pure JSON.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a travel planner. Always respond with valid JSON only. No markdown formatting."
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.4,
            max_tokens: 1500,
        });

        let text = completion.choices[0]?.message?.content;

        if (!text) {
            throw new Error("No response from AI");
        }

        // Clean up response - remove any markdown formatting
        text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

        // Parse and validate JSON
        let itinerary;
        try {
            itinerary = JSON.parse(text);
        } catch (parseError) {
            console.error("Failed to parse AI response:", text);
            throw new Error("Failed to parse itinerary response");
        }

        return new Response(
            JSON.stringify({ success: true, itinerary }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("Edge Function Error:", err.message);
        return new Response(
            JSON.stringify({
                success: false,
                error: err.message || "Failed to generate itinerary"
            }),
            {
                status: 200, // Return 200 to avoid CORS issues, error is in the body
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );
    }
});
