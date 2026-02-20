import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Use Anon Key for client-side like operations (RLS will handle permissions)
// or Service Role Key if available (bypasses RLS)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        let userId = user?.id;

        console.log("Context Generate API: userId (from currentUser)", userId); // DEBUG LOG

        if (!userId) {
            console.log("Context Generate API: Unauthorized - No userId. USING MOCK USER FOR DEBUG."); // DEBUG LOG
            // GENERATING MOCK USER ID
            userId = "user_debug_123";
        }

        const body = await req.json();
        // Generic Payload Support: We just pass "data" property to n8n, 
        // which can contain "contextItems" or any other structure.
        const { contextItems } = body;

        // 1. Save to Supabase (simulated for now, can be expanded to a real table)
        // For now we just update the profile to say context is completed
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                context_completed: true,
                // store the JSON blob if we had a column for it, or just rely on n8n
            })
            .eq('id', userId);

        if (updateError) {
            console.error("Error updating profile:", updateError);
            // We don't block the process if this fails, but it's good to log
        }

        // 2. Trigger n8n Webhook
        // TODO: Replace with actual n8n webhook URL
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
        let n8nData = null;

        if (n8nWebhookUrl) {
            try {
                const n8nResponse = await fetch(n8nWebhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': process.env.N8N_API_KEY || ''
                    },
                    body: JSON.stringify({
                        userId,
                        timestamp: new Date().toISOString(),
                        data: {
                            contextItems // Passing the generic array
                        }
                    })
                });

                if (n8nResponse.ok) {
                    n8nData = await n8nResponse.json();
                } else {
                    console.error("n8n returned error:", n8nResponse.status, n8nResponse.statusText);
                    return NextResponse.json({
                        success: false,
                        message: `Erro no servidor de IA (n8n): ${n8nResponse.statusText}`,
                        debug: { status: n8nResponse.status }
                    }, { status: n8nResponse.status });
                }

            } catch (webhookError) {
                console.error("Error triggering n8n:", webhookError);
                // Return success but warn about webhook? Or fail? 
                // For now, let's treat it as a warning if we can't reach n8n
            }
        }

        return NextResponse.json({
            success: true,
            message: "Context submitted successfully",
            data: n8nData // Return the AI generated text
        });

    } catch (error) {
        console.error("Error in generate context:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
