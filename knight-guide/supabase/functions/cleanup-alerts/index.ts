
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Use Service Role Key for admin tasks
    )

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 90) // 90 days retention

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
    } catch (error) {
        console.error('Error cleaning up alerts:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        )
    }
})
