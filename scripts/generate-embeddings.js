import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

// Carrega as variáveis do arquivo .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Verifica as chaves (use a service_role_key para ignorar as restrições de RLS do banco no script)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // NECESSÁRIO PARA FAZER UPDATE NO BANCO VIA SCRIPT

// Verificação: precisamos de uma chave da OpenAI, adicione ela no .env.local se não houver
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !OPENAI_API_KEY) {
    console.error("Faltam chaves de ambiente essenciais (.env.local).");
    console.error(`- SUPABASE_URL: ${!!SUPABASE_URL}`);
    console.error(`- SUPABASE_SERVICE_ROLE_KEY: ${!!SUPABASE_SERVICE_KEY}`);
    console.error(`- OPENAI_API_KEY: ${!!OPENAI_API_KEY}`);
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function generateEmbeddings() {
    console.log("Iniciando geração de embeddings...");

    // Busca todos os prompts que não possuem embedding
    const { data: prompts, error } = await supabase
        .from('prompts')
        .select('id, title, description_short, description_full, usage_instructions')
        .is('embedding', null);

    if (error) {
        console.error("Erro ao buscar prompts:", error);
        return;
    }

    console.log(`Encontrados ${prompts.length} prompts para processar.`);

    for (const prompt of prompts) {
        // Criar o "Documento" que será vetorizado.
        const contentToEmbed = `
            Título: ${prompt.title}
            Descrição Curta: ${prompt.description_short || ''}
            Descrição Completa: ${prompt.description_full || ''}
            Quando usar: ${prompt.usage_instructions || ''}
        `.trim();

        console.log(`Gerando embedding para: ${prompt.title}`);

        try {
            const response = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: contentToEmbed,
                encoding_format: "float",
            });

            const embedding = response.data[0].embedding;

            const { error: updateError } = await supabase
                .from('prompts')
                .update({ embedding })
                .eq('id', prompt.id);

            if (updateError) {
                console.error(`Erro ao salvar embedding do id ${prompt.id}:`, updateError);
            } else {
                console.log(`✅ Sucesso!`);
            }

        } catch (openaiErr) {
            console.error(`Erro na OpenAI para o prompt ${prompt.title}:`, openaiErr);
        }

        // Aguarda meio segundo entre chamadas para evitar Rate Limits na API
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log("Processo finalizado!");
}

generateEmbeddings();
