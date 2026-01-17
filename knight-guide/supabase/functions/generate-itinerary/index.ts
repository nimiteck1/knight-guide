/// <reference lib="deno.ns" />

export const config = {
    verify_jwt: false,
};

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.26.0";

const openai = new OpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY"),
});

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const body = await req.json();

        const { location, startDate, endDate, mood, userNeedsContext } = body;

        const prompt = `
You are an accessibility-first travel planner.

Generate a detailed itinerary.

Location: ${location}
Dates: ${startDate} to ${endDate}
Mood: ${mood}

Accessibility needs:
${JSON.stringify(userNeedsContext, null, 2)}

Return ONLY valid JSON in this format:
{
  "tripSummary": string,
  "accessibilityNotes": string,
  "days": [
    {
      "day": number,
      "title": string,
      "activities": [
        {
          "time": string,
          "activity": string,
          "accessibility": string
        }
      ]
    }
  ]
}
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You generate accessible travel itineraries." },
                { role: "user", content: prompt },
            ],
            temperature: 0.6,
        });

        let text = completion.choices[0].message.content || "";

        text = text.replace(/```json|```/g, "").trim();

        const itinerary = JSON.parse(text);

        return new Response(
            JSON.stringify({ success: true, itinerary }),
            {
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (err: unknown) {
        console.error("EDGE ERROR:", err);

        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";

        return new Response(
            JSON.stringify({
                success: false,
                error: errorMessage,
            }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );
    }
});
