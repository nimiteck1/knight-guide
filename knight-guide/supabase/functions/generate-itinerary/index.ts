import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.26.0";

export const config = {
    verify_jwt: false,
};

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Fast mock generator for fallback
function generateMockItinerary(location: string, days: number, mood: string) {
    const moods: Record<string, string[]> = {
        nature: ["Park visit", "Nature trail", "Botanical garden"],
        party: ["Night club", "Rooftop bar", "Live music venue"],
        beach: ["Beach relaxation", "Water sports", "Sunset cruise"],
        default: ["Local sightseeing", "Cultural visit", "Food tour"]
    };
    const activities = moods[mood] || moods.default;

    return {
        tripSummary: `A ${mood || "relaxed"} ${days}-day trip to ${location}`,
        accessibilityNotes: "All venues selected for accessibility features.",
        days: Array.from({ length: Math.min(days, 5) }, (_, i) => ({
            day: i + 1,
            title: `Day ${i + 1}`,
            activities: [
                { time: "9:00 AM", activity: activities[0], accessibility: "Accessible" },
                { time: "1:00 PM", activity: activities[1], accessibility: "Accessible" },
                { time: "5:00 PM", activity: activities[2], accessibility: "Accessible" },
            ],
        })),
    };
}

// Timeout wrapper for API calls
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error("TIMEOUT")), ms)
        )
    ]);
}

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    let body: any;
    try {
        body = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ success: false, error: "Invalid JSON body" }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const { location, startDate, endDate, mood, preferences } = body;

    if (!location || !startDate || !endDate) {
        return new Response(
            JSON.stringify({ success: false, error: "Missing required fields" }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.min(5, Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1));

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
        return new Response(
            JSON.stringify({ success: true, itinerary: generateMockItinerary(location, days, mood), isMock: true }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    try {
        const openai = new OpenAI({ apiKey });

        // Build compact accessibility string
        const access: string[] = [];
        if (preferences?.wheelchairFriendly) access.push("wheelchair");
        if (preferences?.avoidStairs) access.push("no stairs");

        // Ultra-compact prompt for speed
        const prompt = `${days}-day ${location} trip, ${mood || "relaxed"} vibe${access.length ? `, needs: ${access.join(",")}` : ""}.
Return JSON: {"tripSummary":"..","accessibilityNotes":"..","days":[{"day":1,"title":"..","activities":[{"time":"9AM","activity":"..","accessibility":".."}]}]}
3 activities/day. JSON only, no markdown.`;

        const completion = await withTimeout(
            openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "Travel planner. JSON only. Be concise." },
                    { role: "user", content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 800,
            }),
            12000 // 12 second timeout
        );

        let text = completion.choices[0]?.message?.content;
        if (!text) throw new Error("No AI response");

        text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

        let itinerary;
        try {
            itinerary = JSON.parse(text);
        } catch {
            console.error("Parse failed:", text.substring(0, 200));
            throw new Error("Invalid response format");
        }

        return new Response(
            JSON.stringify({ success: true, itinerary }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Generation failed";

        // On timeout, return mock instead of error
        if (errorMessage === "TIMEOUT") {
            console.warn("API timeout, returning mock");
            return new Response(
                JSON.stringify({ success: true, itinerary: generateMockItinerary(location, days, mood), isMock: true }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        console.error("Error:", errorMessage);
        return new Response(
            JSON.stringify({ success: false, error: errorMessage }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
