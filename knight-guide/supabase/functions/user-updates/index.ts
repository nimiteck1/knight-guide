/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts"

serve(async (req: Request) => {
    const { record, old_record } = await req.json()

    if (
        record.emergencyContactPhone !== old_record?.emergencyContactPhone ||
        record.emergencyContactName !== old_record?.emergencyContactName
    ) {
        console.log(`Emergency contact updated for user ${record.id}`)
    }

    return new Response(
        JSON.stringify({ success: true }),
        { headers: { "Content-Type": "application/json" } },
    )
})
