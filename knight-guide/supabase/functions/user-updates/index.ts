
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
    const { record, old_record } = await req.json()

    // Check if emergency contact was updated
    // Note: 'record' is the new data, 'old_record' is the previous data
    if (
        record.emergencyContactPhone !== old_record?.emergencyContactPhone ||
        record.emergencyContactName !== old_record?.emergencyContactName
    ) {
        console.log(`Emergency contact updated for user ${record.id}`)
        // In production: Verify new emergency contact
    }

    return new Response(
        JSON.stringify({ success: true }),
        { headers: { "Content-Type": "application/json" } },
    )
})
