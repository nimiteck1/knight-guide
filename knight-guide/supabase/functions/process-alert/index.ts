/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

console.log("Hello from Functions!")

serve(async (req: Request) => {
    const { record } = await req.json()

    const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
    )

    const alertId = record.id
    console.log(`Processing emergency alert: ${alertId}`)

    try {
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

        console.log('Alert details:', {
            alertId,
            userId: record.user_id,
            location: record.location,
            timestamp: record.created_at
        })

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

        return new Response(
            JSON.stringify({ success: true, alertId }),
            { headers: { "Content-Type": "application/json" } },
        )
    } catch (error: unknown) {
        console.error('Error processing emergency alert:', error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        )
    }
})
