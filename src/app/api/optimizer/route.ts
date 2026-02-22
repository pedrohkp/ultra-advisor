import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userInput, promptTitle, promptTemplate } = await req.json();

        if (!userInput || !userInput.trim()) {
            return NextResponse.json(
                { error: "Input do usuário é obrigatório." },
                { status: 400 }
            );
        }

        const n8nWebhookUrl = process.env.N8N_OPTIMIZER_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL;

        if (!n8nWebhookUrl) {
            return NextResponse.json(
                { error: "Webhook do n8n não configurado." },
                { status: 500 }
            );
        }

        // Build the user prompt — includes context about which prompt was selected
        const userPrompt = `O usuário selecionou o framework "${promptTitle}" da biblioteca.

Entrada bruta do usuário:
${userInput.trim()}`;

        const n8nResponse = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.N8N_API_KEY || ''
            },
            body: JSON.stringify({
                userPrompt,
                promptTitle,
                type: 'optimizer'
            })
        });

        if (!n8nResponse.ok) {
            console.error("n8n optimizer error:", n8nResponse.status, n8nResponse.statusText);

            let errorMessage = `Erro no servidor de IA: ${n8nResponse.statusText}`;
            if (n8nResponse.status === 404) {
                errorMessage = "O serviço de otimização de prompts está temporariamente indisponível. Por favor, tente novamente em alguns instantes.";
            }

            return NextResponse.json(
                { error: errorMessage },
                { status: n8nResponse.status }
            );
        }

        const result = await n8nResponse.json();

        // Extract text from various possible n8n response formats
        let analysisText: string | null = null;

        if (typeof result === 'string') {
            analysisText = result;
        } else if (result.text) {
            analysisText = result.text;
        } else if (result.data?.text || result.data?.content) {
            analysisText = result.data.text || result.data.content;
        } else if (result.content || result.output || result.message) {
            analysisText = result.content || result.output || (typeof result.message === 'string' ? result.message : result.message?.content);
        } else if (Array.isArray(result) && result[0]?.output?.[0]?.content?.[0]?.text) {
            analysisText = result[0].output[0].content[0].text;
        }

        if (!analysisText) {
            console.error("Unexpected n8n response format:", JSON.stringify(result));
            return NextResponse.json(
                { error: "Formato de resposta inesperado da IA.", debug: result },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            analysis: typeof analysisText === 'string' ? analysisText : JSON.stringify(analysisText)
        });

    } catch (error) {
        console.error("Optimizer API error:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor." },
            { status: 500 }
        );
    }
}
