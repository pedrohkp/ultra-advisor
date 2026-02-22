import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json();

        if (!query || !query.trim()) {
            return NextResponse.json(
                { error: "A busca não pode ser vazia." },
                { status: 400 }
            );
        }

        // Ideally add this new env var to your .env.local: N8N_PROMPT_FINDER_WEBHOOK_URL
        // For now, checking if it exists, otherwise using a generic placeholder or the test one.
        const n8nWebhookUrl = process.env.N8N_PROMPT_FINDER_WEBHOOK_URL;

        if (!n8nWebhookUrl) {
            return NextResponse.json(
                { error: "Webhook do Prompt Finder não configurado." },
                { status: 500 }
            );
        }

        const n8nResponse = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userQuery: query.trim()
            })
        });

        if (!n8nResponse.ok) {
            console.error("n8n prompt finder error:", n8nResponse.status, n8nResponse.statusText);

            let errorMessage = "Erro no servidor de Inteligência Artificial.";
            if (n8nResponse.status === 404) {
                errorMessage = "O serviço de recomendação está temporariamente indisponível.";
            }

            return NextResponse.json(
                { error: errorMessage },
                { status: n8nResponse.status }
            );
        }

        const textResult = await n8nResponse.text();

        let result;
        try {
            result = JSON.parse(textResult);
        } catch (parseError) {
            console.error("Failed to parse n8n response as JSON. Raw text:", textResult);
            return NextResponse.json(
                { error: "O servidor de IA retornou um formato inválido (vazio ou texto).", debug: textResult },
                { status: 500 }
            );
        }

        let promptsArray = null;

        // Tenta extrair a array de prompts de várias estruturas possíveis
        if (Array.isArray(result) && result.length > 0 && result[0].slug) {
            // O n8n mandou puramente a array plana (A abordagem mais segura)
            promptsArray = result;
        } else if (result && result.prompts && Array.isArray(result.prompts)) {
            // Estrutura plana dentro de objeto { prompts: [...] }
            promptsArray = result.prompts;
        } else if (Array.isArray(result) && result[0]?.output?.[0]?.content?.[0]?.text?.prompts) {
            // Estrutura aninhada do n8n LangChain UI
            promptsArray = result[0].output[0].content[0].text.prompts;
        }

        // The n8n workflow should return an array of prompts
        if (!promptsArray || !Array.isArray(promptsArray)) {
            console.error("Unexpected n8n response format:", JSON.stringify(result));
            return NextResponse.json(
                { error: "Formato de resposta inesperado da IA.", debug: result },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            prompts: promptsArray
        });

    } catch (error) {
        console.error("Prompt Finder API error:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor." },
            { status: 500 }
        );
    }
}
