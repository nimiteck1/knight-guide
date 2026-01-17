
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

console.log("Hello from Functions!")

serve(async (req) => {
    const { record } = await req.json()

    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
        // Supabase API URL - env var exported by default.
        Deno.env.get('SUPABASE_URL') ?? '',
        // Supabase API ANON KEY - env var exported by default.
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        // Create client with Auth context of the user that called the function.
        { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const alertId = record.id
    console.log(`Processing emergency alert: ${alertId}`)

    try {
        // 1. Get user profile for additional context
        let userProfile = null
        if (record.user_id) {
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', record.user_id)
                .single()

            if (!error && data) {
                userProfile = data
            }
        }

        // 2. Log processing
        console.log('Alert details:', {
            alertId,
            userId: record.user_id,
            location: record.location,
            timestamp: record.created_at
        })

        // 3. Update alert status
        // Note: In a real trigger scenario, be careful of infinite loops if this update triggers the function again.
        // Ideally, check if status is already 'processed' at the start.
        if (record.status !== 'processed') {
            await supabaseClient
                .from('emergency_alerts')
                .update({
                    status: 'processed',
                    processed_at: new Date().toISOString(),
                    user_profile_found: !!userProfile
                })
                .eq('id', alertId)
        }

        // 4. In production: Trigger actual notifications
        // - Send SMS via Twilio
        // - Send push notifications

        return new Response(
            JSON.stringify({ success: true, alertId }),
            { headers: { "Content-Type": "application/json" } },
        )
    } catch (error) {
        console.error('Error processing emergency alert:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        )
    }
})
