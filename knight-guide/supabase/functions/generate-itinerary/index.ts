import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
        if (!GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY not configured')
        }

        const {
            location,
            startDate,
            endDate,
            mood,
            radius,
            aiEnabled,
            crowd,
            preferences
        } = await req.json()

        // Calculate trip duration
        const start = new Date(startDate)
        const end = new Date(endDate)
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

        // Build accessibility requirements from preferences
        const accessibilityNeeds = []
        if (preferences?.wheelchairFriendly) accessibilityNeeds.push('wheelchair accessible venues')
        if (preferences?.avoidStairs) accessibilityNeeds.push('no stairs or step-free access')
        if (preferences?.accessibleRestrooms) accessibilityNeeds.push('accessible restrooms available')
        if (preferences?.accessibleParking) accessibilityNeeds.push('accessible parking nearby')
        if (preferences?.serviceAnimal) accessibilityNeeds.push('service animal friendly')
        if (preferences?.nearHospitals) accessibilityNeeds.push('close to medical facilities')
        if (preferences?.emergencyRestStops) accessibilityNeeds.push('frequent rest stops')
        if (preferences?.avoidIsolated) accessibilityNeeds.push('avoid isolated areas')
        if (preferences?.avoidCrowded) accessibilityNeeds.push('avoid crowded places')
        if (preferences?.smoothPaths) accessibilityNeeds.push('smooth walking paths')
        if (preferences?.scenicRoutes) accessibilityNeeds.push('scenic routes preferred')

        // Dietary preferences
        const dietaryNeeds = []
        if (preferences?.mealPlan) dietaryNeeds.push('include meal recommendations')
        if (preferences?.culinary) dietaryNeeds.push('focus on culinary experiences')
        if (preferences?.halal) dietaryNeeds.push('halal food options only')

        const prompt = `You are an expert accessibility-focused travel planner. Create a detailed ${days}-day travel itinerary.

TRIP DETAILS:
- Destination: ${location}
- Dates: ${startDate} to ${endDate} (${days} days)
- Travel Mood: ${mood || 'balanced'}
- Exploration Radius: ${radius || 5}km from city center
- Crowd Preference: ${crowd || 'moderate'}

ACCESSIBILITY REQUIREMENTS:
${accessibilityNeeds.length > 0 ? accessibilityNeeds.map(n => `- ${n}`).join('\n') : '- Standard accessibility'}

DIETARY PREFERENCES:
${dietaryNeeds.length > 0 ? dietaryNeeds.map(n => `- ${n}`).join('\n') : '- No specific dietary requirements'}

INSTRUCTIONS:
1. Create a day-by-day itinerary with morning, afternoon, and evening activities
2. Include specific venue names and addresses when possible
3. Add accessibility notes for each venue
4. Include estimated travel times between locations
5. Add practical tips for each day
6. Consider the travel mood and pace

OUTPUT FORMAT (respond in valid JSON only):
{
    "tripTitle": "Your Trip to [Destination]",
    "summary": "Brief 2-3 sentence overview",
    "days": [
        {
            "dayNumber": 1,
            "date": "YYYY-MM-DD",
            "theme": "Day theme",
            "activities": [
                {
                    "time": "09:00 AM",
                    "title": "Activity name",
                    "description": "What to do here",
                    "location": "Venue name and address",
                    "duration": "2 hours",
                    "accessibilityNotes": "Wheelchair accessible, elevator available",
                    "tips": "Arrive early to avoid crowds"
                }
            ]
        }
    ],
    "travelTips": ["tip1", "tip2", "tip3"],
    "accessibilityHighlights": ["highlight1", "highlight2"],
    "emergencyInfo": {
        "nearestHospital": "Hospital name and address",
        "emergencyNumber": "Local emergency number"
    }
}

Respond ONLY with valid JSON, no markdown or extra text.`

        // Call Gemini API
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 8192,
                    }
                })
            }
        )

        if (!geminiResponse.ok) {
            const error = await geminiResponse.text()
            console.error('Gemini API error:', error)
            throw new Error(`Gemini API error: ${geminiResponse.status}`)
        }

        const geminiData = await geminiResponse.json()
        const textResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

        if (!textResponse) {
            throw new Error('No response from Gemini')
        }

        // Parse JSON from response (handle markdown code blocks)
        let itinerary
        try {
            const jsonMatch = textResponse.match(/```json\n?([\s\S]*?)\n?```/) ||
                textResponse.match(/```\n?([\s\S]*?)\n?```/)
            const jsonString = jsonMatch ? jsonMatch[1] : textResponse
            itinerary = JSON.parse(jsonString.trim())
        } catch (parseError) {
            console.error('JSON parse error:', parseError)
            // Return raw text if JSON parsing fails
            itinerary = {
                tripTitle: `Trip to ${location}`,
                rawItinerary: textResponse,
                parseError: true
            }
        }

        return new Response(
            JSON.stringify({ success: true, itinerary }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Edge function error:', error)
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
