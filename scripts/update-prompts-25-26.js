/**
 * Updates prompts 25 (Arquitetura de Soluções) and 26 (Narrativa de Caso de Uso)
 * in both prompts-v3.json and Supabase.
 */
const fs = require('fs');
const path = require('path');

// --- NEW DATA ---

const updates = {
    'arquitetura-de-solucoes': {
        description_short: 'Estruture qualquer solução, produto ou sistema antes de construir. MVP, riscos, etapas executáveis e decisão de arquitetura.',
        description_full: 'Estruturar qualquer solução, produto, sistema ou iniciativa ANTES de começar a construir — definindo MVP, arquitetura simplificada, riscos, dependências e plano de execução em etapas com critérios claros de validação.',
        content_template: `Preciso estruturar uma [SOLUÇÃO/PRODUTO/SISTEMA/INICIATIVA] antes de começar a construir.

CONTEXTO ATUAL:
[Descreva o problema real, o fluxo atual (manual ou não), quem usa, frequência, impacto]

OBJETIVO (CRITÉRIO DE SUCESSO):
[O que precisa estar verdadeiro no final — em termos observáveis e testáveis]

ENTRADAS:
[Que dados/eventos disparam a solução? de onde vêm?]

SAÍDAS:
[Que entregas a solução produz? para quem? onde ficam registradas?]

RESTRIÇÕES:
Orçamento: [valor ou "flexível"]
Prazo: [tempo disponível]
Ambiente: [web/mobile/desktop/operacional/campo/etc.]
Sistemas/recursos envolvidos: [ferramentas, plataformas, bases de dados, integrações, pessoas]
Volume e frequência: [quantidade/dia, picos, sazonalidade]
Segurança e privacidade: [nível de sensibilidade dos dados, compliance se houver]
Limitações técnicas conhecidas: [se houver]

Preciso que você:
Defina o "mínimo que funciona" (MVP) e separe componentes essenciais vs opcionais
Proponha a arquitetura mais simples que resolve o problema (não a mais elegante)

deixe claro: fluxo principal, pontos de decisão, onde os dados moram, como o estado é rastreado

Aponte riscos técnicos, dependências críticas e onde pode quebrar
Quebre em etapas executáveis (o que fazer primeiro, segundo, terceiro), com entregáveis claros
Sinalize onde dá para ganhar tempo com ferramentas prontas/reuso vs construir do zero
Indique como validar cedo (teste rápido/"prova de funcionamento") antes de investir pesado
Seja direto: escolha a melhor abordagem e justifique com base em prazo, risco e impacto (não me dê um menu de opções)

FORMATO DE SAÍDA (obrigatório):
Decisão de arquitetura (1 parágrafo)
Componentes (Essenciais / Opcionais)
Fluxo fim a fim (passo a passo)
Riscos e dependências (com mitigação)
Plano de execução em etapas (com critérios de pronto)
Aceleradores (pronto vs do zero)`
    },

    'narrativa-de-caso-de-uso': {
        description_short: 'Transforme qualquer projeto ou iniciativa em conteúdo educativo com narrativa real, dados concretos e insight não-óbvio.',
        description_full: 'Transformar qualquer projeto ou iniciativa em conteúdo educativo — com problema real, antes/durante/depois tangível, resultados quantificados e insight não-óbvio — em múltiplos formatos (LinkedIn, Twitter, case study, vídeo, newsletter).',
        content_template: `Preciso transformar um [PROJETO/INICIATIVA] em conteúdo educativo.

PROJETO/INICIATIVA:
[Descreva o que você fez, em termos simples, e qual foi o resultado]

CONTEXTO:
[Em que cenário isso aconteceu: empresa, time, rotina, restrição, urgência]

PÚBLICO-ALVO:
[Para quem é: pessoas que ainda não percebem o problema / pessoas que querem aprender a habilidade por trás / um nicho específico]

Crie uma narrativa que:
Comece com um problema real e palpável (nada de "isso é importante")
Mostre o antes de forma tangível (tempo, erros, retrabalho, stress, custo, perda de oportunidade)
Explique a abordagem e as decisões-chave sem jargão desnecessário
(o que você mudou, por que escolheu esse caminho, quais trade-offs aceitou)
Mostre o durante com 1–2 momentos concretos
(um obstáculo, uma hipótese que caiu, uma restrição que mudou o plano)
Quantifique o resultado
(ex.: R$ X economizados/gerados, Y horas poupadas, Z% de redução de erro, tempo de entrega de A → B, aumento de conversão de C% → D%)
Termine com um insight não-óbvio
(algo que você aprendeu fazendo: sobre pessoas, processo, produto, comunicação, risco, qualidade, priorização)

FORMATO:
[post LinkedIn / thread X (Twitter) / case study completo / roteiro de vídeo curto / e-mail newsletter]

TOM:
Direto, específico, com exemplos concretos. Frases curtas.

EVITE:
"transformação digital", "otimização de processos", "revolucionário", "game changer", "solução robusta", "sinergia".`
    }
};

// --- UPDATE LOCAL JSON ---

const jsonPath = path.join(__dirname, '..', 'prompts-v3.json');
const prompts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

for (const [slug, data] of Object.entries(updates)) {
    const prompt = prompts.find(p => p.slug === slug);
    if (!prompt) {
        console.error(`❌ Prompt not found: ${slug}`);
        process.exit(1);
    }
    prompt.description_short = data.description_short;
    prompt.description_full = data.description_full;
    prompt.content_template = data.content_template;
    console.log(`✅ Updated in JSON: ${prompt.title}`);
}

fs.writeFileSync(jsonPath, JSON.stringify(prompts, null, 2), 'utf8');
console.log(`\n📄 prompts-v3.json saved (${prompts.length} prompts)\n`);

// --- UPDATE SUPABASE ---

async function updateSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error('❌ Missing Supabase env vars. Run with: node -r dotenv/config scripts/update-prompts-25-26.js');
        process.exit(1);
    }

    for (const [slug, data] of Object.entries(updates)) {
        const res = await fetch(`${url}/rest/v1/prompts?slug=eq.${slug}`, {
            method: 'PATCH',
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                description_short: data.description_short,
                description_full: data.description_full,
                content_template: data.content_template
            })
        });

        if (!res.ok) {
            const txt = await res.text();
            console.error(`❌ Supabase PATCH failed for ${slug}: ${res.status} ${txt}`);
            process.exit(1);
        }

        const result = await res.json();
        console.log(`✅ Supabase updated: ${slug} (${result.length} row(s) affected)`);
    }
}

updateSupabase().catch(err => {
    console.error('❌ Supabase error:', err.message);
    process.exit(1);
});
