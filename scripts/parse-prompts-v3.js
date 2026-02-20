/**
 * parse-prompts-v3.js
 * Robust parser that handles ALL edge cases found in prompts-dump.txt:
 * - ===PROMPT=== separators
 * - Bold markers (**text**) or plain text markers
 * - "Prompt completo:" vs "Prompt Completo:" (case insensitive)
 * - "● [OUTPUT]:" vs "● Output:" (both formats)
 * - Emojis in section headers
 * - Missing "Prompt Completo" section (prompt 23)
 * - Different Input/Output formats (prompt 31)
 * - Applies user-approved Portuguese names
 */
const fs = require('fs');
const path = require('path');

// ==================== USER-APPROVED NAMES ====================
const NAME_MAP = {
    0: 'Relatório de Inteligência de Mercado',
    1: 'Roteiro de Entrevista Comportamental',
    2: 'Análise de Canais de Go-to-Market',
    3: 'Dimensionamento de Mercado (TAM/SAM/SOM)',
    4: 'Personas Comportamentais',
    5: 'Análise de Posicionamento Competitivo',
    6: 'Precificação Baseada em Reverse-Engineering',
    7: 'Metodologia de Pesquisa Comportamental',
    8: 'Análise SWOT Estratégica',
    9: 'Estudo de Viabilidade de Entrada em Mercado',
    10: 'Gerador de Posicionamento de Marca',
    11: 'Catálogo de Erros de Iniciantes',
    12: 'Second-Order Thinking — Análise de Consequências em Cascata',
    13: 'Argumento Mais Forte da Posição Oposta',
    14: 'Antecipação de Tendências Emergentes',
    15: 'Validação de Demanda Pré-Construção',
    16: 'Decomposição Recursiva de Problemas',
    17: 'Arbitragem de Conhecimento entre Setores',
    18: 'Janela de Oportunidade Estratégica',
    19: 'Contra-Posicionamento Estratégico',
    20: 'Exposição de Vieses Cognitivos',
    21: 'Alavancagem Máxima de Recursos',
    22: 'Feedback Específico — Parte Fraca, Parte Forte e Pontos Cegos',
    23: 'Próximo Passo Físico',
    24: 'Arquitetura de Soluções',
    25: 'Narrativa de Caso de Uso',
    26: 'Efeito Volante — Crescimento Composto',
    27: 'Entendimento Estrutural de Sistemas',
    28: 'Meta-Learning — Protocolo de Aprendizado Acelerado',
    29: 'Pré-Mortem — Mapeamento de Falhas e Prevenção',
    30: 'Definição de Público-Alvo Ideal (ICP)'
};

// Premium prompt indices (0-indexed)
const PREMIUM_INDICES = new Set([0, 2, 8, 21, 27, 28, 26]);

function slugify(text) {
    return text.toString().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

/**
 * Clean up text: remove ** markers, normalize whitespace
 */
function clean(text) {
    if (!text) return '';
    return text.replace(/\*\*/g, '').trim();
}

/**
 * Find section content between a start marker and any of the end markers.
 * Uses case-insensitive matching and handles ** bold markers.
 */
function extractBetween(text, startPatterns, endPatterns) {
    let startIdx = -1;
    let markerLen = 0;

    for (const pattern of startPatterns) {
        const regex = new RegExp(pattern, 'i');
        const match = text.match(regex);
        if (match) {
            startIdx = match.index + match[0].length;
            markerLen = match[0].length;
            break;
        }
    }

    if (startIdx === -1) return '';

    let content = text.substring(startIdx);

    // Find the earliest end marker
    let endIdx = content.length;
    for (const pattern of endPatterns) {
        const regex = new RegExp(pattern, 'i');
        const match = content.match(regex);
        if (match && match.index < endIdx) {
            endIdx = match.index;
        }
    }

    return content.substring(0, endIdx).trim();
}

/**
 * Format text: preserve bullets, numbered lists, clean line breaks
 */
function formatText(text) {
    if (!text) return '';
    return clean(text)
        .replace(/\r/g, '')
        .split('\n')
        .map(line => line.trimEnd())
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function parsePrompt(rawText, index) {
    const text = rawText.trim();
    if (!text) return null;

    // Use approved name
    const title = NAME_MAP[index] || 'Prompt ' + (index + 1);
    const slug = slugify(title);
    const isPremium = PREMIUM_INDICES.has(index);

    // Extract bracket tag for category
    const bracketMatch = text.match(/\[([^\]]+)\]/);
    const categoryTag = bracketMatch ? clean(bracketMatch[1]) : 'General';

    // --- Micro-descrição ---
    const microDescPatterns = [
        '(?:\\*\\*)?Micro-descri(?:ção|çao)(?:\\*\\*)?:\\s*'
    ];
    const microDescEnd = [
        '\n(?:\\*\\*)?(?:PLATAFORMA|Nome Completo)',
        '\n🖥'
    ];
    let microDesc = extractBetween(text, microDescPatterns, microDescEnd);
    microDesc = clean(microDesc).replace(/\n\s*/g, ' ');

    // --- Para que serve ---
    const paraQueServePatterns = [
        '(?:\\*\\*)?Para que serve(?:\\*\\*)?:?\\s*'
    ];
    const paraQueServeEnd = [
        '\n(?:\\*\\*)?Quando usar'
    ];
    let paraQueServe = extractBetween(text, paraQueServePatterns, paraQueServeEnd);
    paraQueServe = clean(paraQueServe).replace(/\n\s*/g, ' ');

    // --- Quando usar ---
    const quandoUsarPatterns = [
        '(?:\\*\\*)?Quando usar(?:\\*\\*)?:?\\s*'
    ];
    const quandoUsarEnd = [
        '\n(?:\\*\\*)?Prompt [Cc]ompleto',
        '\nExemplo de Uso:'
    ];
    let quandoUsar = extractBetween(text, quandoUsarPatterns, quandoUsarEnd);
    quandoUsar = formatText(quandoUsar);

    // --- Prompt Completo ---
    const promptCompletoPatterns = [
        '(?:\\*\\*)?Prompt [Cc]ompleto(?:\\*\\*)?:?\\s*'
    ];
    const promptCompletoEnd = [
        '\nExemplo de Uso:'
    ];
    let promptCompleto = extractBetween(text, promptCompletoPatterns, promptCompletoEnd);
    promptCompleto = formatText(promptCompleto);

    // Remove leading/trailing quotes if wrapped
    if (promptCompleto.startsWith('"') && promptCompleto.endsWith('"')) {
        promptCompleto = promptCompleto.slice(1, -1).trim();
    }

    // --- Exemplo de Uso ---
    const exemploPatterns = [
        'Exemplo de Uso:?\\s*'
    ];
    let exemplo = extractBetween(text, exemploPatterns, ['$$$NEVER_MATCH$$$']);

    // Split into Input and Output - handle multiple formats:
    // Format 1: ● Input (...): ... ● Output: ...
    // Format 2: ● Input (...): ... ● [OUTPUT]: ...
    // Format 3: Input: ... Output: ...
    let exampleInput = '';
    let exampleOutput = '';

    if (exemplo) {
        // Try splitting by various Output markers
        const outputSplitters = [
            /●\s*\[OUTPUT\]:?\s*/i,
            /●\s*Output:?\s*/i,
            /\nOutput:?\s*/i
        ];

        let splitIdx = -1;
        let outputMarkerLen = 0;

        for (const regex of outputSplitters) {
            const match = exemplo.match(regex);
            if (match) {
                splitIdx = match.index;
                outputMarkerLen = match[0].length;
                break;
            }
        }

        if (splitIdx !== -1) {
            // Extract input (everything from Input marker to Output marker)
            const inputPart = exemplo.substring(0, splitIdx);
            const outputPart = exemplo.substring(splitIdx + outputMarkerLen);

            // Clean input: remove the "● Input (...): " prefix
            const inputClean = inputPart.replace(/●\s*Input\s*\([^)]*\):?\s*/i, '').replace(/Input:?\s*/i, '');
            exampleInput = formatText(inputClean);
            exampleOutput = formatText(outputPart);
        } else {
            // No output marker — try detecting if Input exists alone
            const inputMatch = exemplo.match(/●?\s*Input\s*(?:\([^)]*\))?:?\s*/i);
            if (inputMatch) {
                exampleInput = formatText(exemplo.substring(inputMatch.index + inputMatch[0].length));
            } else {
                // Entire text is the example
                exampleInput = formatText(exemplo);
            }
        }
    }

    // Build combined example
    let exampleCombined = '';
    if (exampleInput || exampleOutput) {
        const parts = [];
        if (exampleInput) parts.push('## Input\n' + exampleInput);
        if (exampleOutput) parts.push('## Output\n' + exampleOutput);
        exampleCombined = parts.join('\n\n');
    }

    // Special fix: Prompt 23 (Feedback Específico) - use user-provided template if not found in source
    if (index === 22 && !promptCompleto) {
        promptCompleto = `Preciso de feedback sobre: [descreva o trabalho/ideia/projeto].
Contexto: [para quem é, qual problema resolve, em que estágio está].
Não me dê feedback genérico tipo 'está bom' ou 'precisa melhorar'. Responda especificamente:
PARTE MAIS FRACA: → Qual é o componente/seção/ideia mais fraco disso e por quê → O que especificamente não funciona (seja brutal) → Como você melhoraria essa parte (ação concreta, não princípio vago)
PARTE MAIS FORTE: → O que você manteria exatamente como está → Por que isso funciona melhor que o resto
TESTE DE CLAREZA: → Reformule a ideia central com suas palavras → Se não for idêntico ao que eu quis dizer, aponte onde fui confuso
BLIND SPOTS: → O que está faltando que deveria estar aqui → Que premissa eu assumi que não está explícita
Me dê o feedback que machuca mas melhora, não o que conforta mas não muda nada.`;
    }
    // =============================================
    // CATEGORIZATION MAPPING (approved by user)
    // =============================================
    const PURPOSE_MAP = {
        0: 'Análise de Mercado',           // 1. Relatório de Inteligência de Mercado
        1: 'Análise de Mercado',           // 2. Roteiro de Entrevista Comportamental
        2: 'Estratégia & Posicionamento',  // 3. Análise de Canais de Go-to-Market
        3: 'Análise de Mercado',           // 4. Dimensionamento de Mercado (TAM/SAM/SOM)
        4: 'Análise de Mercado',           // 5. Personas Comportamentais
        5: 'Estratégia & Posicionamento',  // 6. Análise de Posicionamento Competitivo
        6: 'Estratégia & Posicionamento',  // 7. Precificação Baseada em Reverse-Engineering
        7: 'Análise de Mercado',           // 8. Metodologia de Pesquisa Comportamental
        8: 'Validação & Decisão',          // 9. Análise SWOT Estratégica
        9: 'Validação & Decisão',          // 10. Estudo de Viabilidade de Entrada em Mercado
        10: 'Estratégia & Posicionamento',  // 11. Gerador de Posicionamento de Marca
        11: 'Pensamento Crítico',           // 12. Catálogo de Erros de Iniciantes
        12: 'Pensamento Crítico',           // 13. Second-Order Thinking
        13: 'Pensamento Crítico',           // 14. Argumento Mais Forte da Posição Oposta
        14: 'Análise de Mercado',           // 15. Antecipação de Tendências Emergentes
        15: 'Validação & Decisão',          // 16. Validação de Demanda Pré-Construção
        16: 'Execução & Operação',          // 17. Decomposição Recursiva de Problemas
        17: 'Pensamento Crítico',           // 18. Arbitragem de Conhecimento entre Setores
        18: 'Validação & Decisão',          // 19. Janela de Oportunidade Estratégica
        19: 'Estratégia & Posicionamento',  // 20. Contra-Posicionamento Estratégico
        20: 'Pensamento Crítico',           // 21. Exposição de Vieses Cognitivos
        21: 'Execução & Operação',          // 22. Alavancagem Máxima de Recursos
        22: 'Comunicação & Conteúdo',       // 23. Feedback Específico
        23: 'Execução & Operação',          // 24. Próximo Passo Físico
        24: 'Execução & Operação',          // 25. Arquitetura de Soluções
        25: 'Comunicação & Conteúdo',       // 26. Narrativa de Caso de Uso
        26: 'Crescimento & Aprendizado',    // 27. Efeito Volante
        27: 'Pensamento Crítico',           // 28. Entendimento Estrutural de Sistemas
        28: 'Crescimento & Aprendizado',    // 29. Meta-Learning
        29: 'Validação & Decisão',          // 30. Pré-Mortem
        30: 'Estratégia & Posicionamento',  // 31. Definição de Público-Alvo Ideal (ICP)
    };

    const NICHE_MAP = {
        0: 'Todos',
        1: 'SaaS, Startups, Consultoria',
        2: 'SaaS, E-commerce, Startups',
        3: 'SaaS, Startups',
        4: 'Todos',
        5: 'Todos',
        6: 'SaaS, E-commerce, Infoprodutos',
        7: 'SaaS, Consultoria, Startups',
        8: 'Todos',
        9: 'SaaS, E-commerce, Startups',
        10: 'Todos',
        11: 'Startups, Infoprodutos',
        12: 'Todos',
        13: 'Todos',
        14: 'Todos',
        15: 'SaaS, Startups, Infoprodutos',
        16: 'Todos',
        17: 'Consultoria, SaaS, Startups',
        18: 'SaaS, E-commerce, Startups',
        19: 'SaaS, E-commerce, Startups',
        20: 'Todos',
        21: 'PMEs, Startups',
        22: 'Todos',
        23: 'Todos',
        24: 'SaaS, Consultoria',
        25: 'Consultoria, Infoprodutos',
        26: 'SaaS, E-commerce, Infoprodutos',
        27: 'Todos',
        28: 'Todos',
        29: 'Todos',
        30: 'Todos',
    };

    return {
        title: title,
        slug: slug,
        category_situation: PURPOSE_MAP[index] || 'Geral',
        category_niche: NICHE_MAP[index] || 'Todos',
        is_premium: isPremium,
        description_short: microDesc,
        description_full: paraQueServe,
        content_template: promptCompleto,
        usage_instructions: quandoUsar,
        example_output: exampleCombined
    };
}

// ==================== MAIN ====================
const dumpPath = path.join(__dirname, '..', 'prompts-dump.txt');
const content = fs.readFileSync(dumpPath, 'utf8');

const rawPrompts = content.split('===PROMPT===').filter(p => p.trim().length > 0);
console.log('Found ' + rawPrompts.length + ' prompt sections\n');

const prompts = [];
const report = [];

rawPrompts.forEach((raw, i) => {
    const prompt = parsePrompt(raw, i);
    if (!prompt) {
        report.push((i + 1) + '. FAILED: could not parse');
        return;
    }

    prompts.push(prompt);

    const tLen = prompt.content_template.length;
    const eLen = prompt.example_output.length;
    const uLen = prompt.usage_instructions.length;
    const dLen = prompt.description_short.length;
    const fLen = prompt.description_full.length;

    const hasAll = tLen > 20 && eLen > 20 && uLen > 5 && dLen > 5 && fLen > 5;
    const status = hasAll ? 'OK' : 'ISSUES';
    const premium = prompt.is_premium ? ' [PREMIUM]' : '';

    const line = (i + 1) + '. [' + status + '] T:' + tLen + ' E:' + eLen + ' U:' + uLen + ' D:' + dLen + ' F:' + fLen + premium + ' | ' + prompt.title;
    report.push(line);

    if (!hasAll) {
        if (tLen <= 20) report.push('   -> MISSING: content_template');
        if (eLen <= 20) report.push('   -> MISSING: example_output');
        if (uLen <= 5) report.push('   -> MISSING: usage_instructions');
        if (dLen <= 5) report.push('   -> MISSING: description_short');
        if (fLen <= 5) report.push('   -> MISSING: description_full');
    }
});

// Write report
const reportPath = path.join(__dirname, '..', 'parser-v3-report.txt');
fs.writeFileSync(reportPath, report.join('\n'), 'utf8');
console.log('Report written to: parser-v3-report.txt');

// Write JSON
const outputPath = path.join(__dirname, '..', 'prompts-v3.json');
fs.writeFileSync(outputPath, JSON.stringify(prompts, null, 2), 'utf8');
console.log('JSON written to: prompts-v3.json');
console.log('Total prompts: ' + prompts.length);
