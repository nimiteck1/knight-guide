/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (_req: Request) => {
    const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 90)

    try {
        const { error, count } = await supabaseClient
            .from('emergency_alerts')
            .delete({ count: 'exact' })
            .lt('created_at', cutoffDate.toISOString())

        if (error) throw error

        console.log(`Deleted ${count} old emergency alerts`)

        return new Response(
            JSON.stringify({ success: true, deletedCount: count }),
            { headers: { "Content-Type": "application/json" } },
        )
    } catch (error: unknown) {
        console.error('Error cleaning up alerts:', error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        )
    }
})
