/**
 * parse-prompts-v2.js
 * Parses prompts-dump.txt using ===PROMPT=== separators
 * Extracts structured fields with markdown formatting preserved
 * Outputs prompts-v2.json
 */
const fs = require('fs');
const path = require('path');

// Premium prompt tags (matched against the bracket tag or Nome Completo)
const PREMIUM_TAGS = [
    'validação da demanda',
    'trend report',
    'análise swot',
    'alavancagem máxima',
    'entendimento estrutural',
    'análise go-to-market',
    'go-to-market',
    'efeito volante'
];

function slugify(text) {
    return text.toString().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function isPremium(bracketTag, nomeCompleto) {
    const combined = (bracketTag + ' ' + nomeCompleto).toLowerCase();
    return PREMIUM_TAGS.some(tag => combined.includes(tag));
}

/**
 * Formats raw text into clean markdown:
 * - Preserves bullet points (●, ○, -, •)
 * - Preserves numbered lists
 * - Cleans up extra whitespace
 * - Joins broken lines (from PDF extraction)
 */
function formatMarkdown(text) {
    if (!text) return '';

    const lines = text.split('\n');
    const result = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Clean up trailing/leading whitespace but preserve indentation pattern
        line = line.replace(/\r/g, '').trimEnd();

        // Skip completely empty lines but keep them as paragraph breaks
        if (line.trim() === '') {
            // Only add blank line if previous wasn't blank
            if (result.length > 0 && result[result.length - 1] !== '') {
                result.push('');
            }
            continue;
        }

        // Detect bullet/list lines
        const isBullet = /^\s*[●○•\-]\s/.test(line);
        const isNumbered = /^\s*\d+[\.\)]\s/.test(line);
        const isSubBullet = /^\s{2,}[●○•\-]\s/.test(line) || /^\s{2,}○/.test(line);
        const isIndentedContinuation = /^\s{4,}/.test(line) && !isBullet && !isNumbered;

        // Normalize bullet characters to markdown
        line = line.replace(/^\s*●\s*/, '• ');
        line = line.replace(/^\s*○\s*/, '  ◦ ');  // sub-bullet

        // Check if this line is a continuation of a broken paragraph from PDF
        if (!isBullet && !isNumbered && !isSubBullet && result.length > 0) {
            const prevLine = result[result.length - 1];
            const prevIsBullet = /^[•◦\-]/.test(prevLine.trim()) || /^\s+[•◦\-]/.test(prevLine);
            const prevIsNumbered = /^\d+[\.\)]/.test(prevLine.trim());

            // If previous line doesn't end with punctuation and this line starts with lowercase or continues thought
            if (prevLine && prevLine !== '' &&
                !prevLine.endsWith(':') &&
                !prevLine.endsWith('.') &&
                !prevLine.endsWith(';') &&
                !prevLine.endsWith('"') &&
                !prevLine.endsWith(')') &&
                !line.trim().startsWith('→') &&
                !line.trim().startsWith('●') &&
                !line.trim().startsWith('•') &&
                !line.trim().startsWith('○') &&
                isIndentedContinuation) {
                // Join with previous line
                result[result.length - 1] = prevLine + ' ' + line.trim();
                continue;
            }
        }

        result.push(line);
    }

    // Clean up: remove leading/trailing blank lines
    while (result.length > 0 && result[0] === '') result.shift();
    while (result.length > 0 && result[result.length - 1] === '') result.pop();

    return result.join('\n');
}

/**
 * Extract a section from the prompt text between two markers
 */
function extractSection(text, startMarker, endMarkers) {
    const startIdx = text.indexOf(startMarker);
    if (startIdx === -1) return '';

    let content = text.substring(startIdx + startMarker.length);

    // Find the earliest end marker
    let endIdx = content.length;
    for (const marker of endMarkers) {
        const idx = content.indexOf(marker);
        if (idx !== -1 && idx < endIdx) {
            endIdx = idx;
        }
    }

    return content.substring(0, endIdx).trim();
}

function parsePrompt(rawText, index) {
    const text = rawText.trim();
    if (!text) return null;

    // 1. Extract bracket tag (e.g. [Trend Report])
    const bracketMatch = text.match(/\[([^\]]+)\]/);
    const bracketTag = bracketMatch ? bracketMatch[1].trim() : '';

    // 2. Extract SITE section fields
    const siteNomeMatch = text.match(/Nome:\s*(.+?)(?:\n|$)/);
    const siteName = siteNomeMatch ? siteNomeMatch[1].trim() : '';

    const microDescMatch = text.match(/Micro-descrição:\s*([\s\S]*?)(?=\n(?:PLATAFORMA|Nome Completo:|Para que serve:))/);
    let microDesc = microDescMatch ? microDescMatch[1].trim() : '';
    // Clean multi-line micro description
    microDesc = microDesc.replace(/\n\s*/g, ' ').trim();

    // 3. Extract PLATAFORMA section fields
    // Nome Completo - handle with or without ** markers
    const nomeCompletoMatch = text.match(/(?:\*\*)?Nome Completo(?:\*\*)?:?\s*([\s\S]*?)(?=\n(?:\*\*)?Para que serve)/);
    let nomeCompleto = nomeCompletoMatch ? nomeCompletoMatch[1].trim() : '';
    nomeCompleto = nomeCompleto.replace(/\*\*/g, '').replace(/\n\s*/g, ' ').trim();

    // Para que serve
    const paraQueServeMatch = text.match(/(?:\*\*)?Para que serve(?:\*\*)?:?\s*([\s\S]*?)(?=\n(?:\*\*)?Quando usar)/);
    let paraQueServe = paraQueServeMatch ? paraQueServeMatch[1].trim() : '';
    paraQueServe = paraQueServe.replace(/\*\*/g, '').replace(/\n\s*/g, ' ').trim();

    // Quando usar
    const quandoUsarMatch = text.match(/(?:\*\*)?Quando usar(?:\*\*)?:?\s*([\s\S]*?)(?=\n(?:\*\*)?Prompt Completo)/);
    let quandoUsar = quandoUsarMatch ? quandoUsarMatch[1].trim() : '';
    quandoUsar = formatMarkdown(quandoUsar);

    // Prompt Completo
    const promptCompletoMatch = text.match(/(?:\*\*)?Prompt Completo(?:\*\*)?:?\s*([\s\S]*?)(?=\nExemplo de Uso:)/);
    let promptCompleto = promptCompletoMatch ? promptCompletoMatch[1].trim() : '';
    promptCompleto = formatMarkdown(promptCompleto);

    // Exemplo de Uso (entire section to end)
    const exemploMatch = text.match(/Exemplo de Uso:\s*([\s\S]*?)$/);
    let exemplo = exemploMatch ? exemploMatch[1].trim() : '';

    // Split example into Input and Output
    let exampleInput = '';
    let exampleOutput = '';

    const inputMatch = exemplo.match(/●\s*Input\s*\([^)]*\):\s*([\s\S]*?)(?=●\s*Output:)/);
    const outputMatch = exemplo.match(/●\s*Output:\s*([\s\S]*?)$/);

    if (inputMatch) {
        exampleInput = formatMarkdown(inputMatch[1].trim());
    }
    if (outputMatch) {
        exampleOutput = formatMarkdown(outputMatch[1].trim());
    }

    // Build combined example with markdown headers
    let exampleCombined = '';
    if (exampleInput || exampleOutput) {
        exampleCombined = '## Input\n' + exampleInput + '\n\n## Output\n' + exampleOutput;
    }

    // Determine premium status
    const premium = isPremium(bracketTag, nomeCompleto);

    // Determine category from bracket tag
    const categoryTag = bracketTag || 'General';

    // Use site name as title (shorter, user-facing)
    const title = nomeCompleto || siteName || bracketTag;
    const slug = slugify(siteName || nomeCompleto || bracketTag);

    const prompt = {
        title: title,
        slug: slug,
        category_situation: categoryTag,
        category_niche: 'General',
        is_premium: premium,
        description_short: microDesc,
        description_full: paraQueServe,
        content_template: promptCompleto,
        usage_instructions: quandoUsar,
        example_output: exampleCombined
    };

    return prompt;
}

// Main execution
const dumpPath = path.join(__dirname, '..', 'prompts-dump.txt');
const content = fs.readFileSync(dumpPath, 'utf8');

const rawPrompts = content.split('===PROMPT===').filter(p => p.trim().length > 0);

console.log('Found ' + rawPrompts.length + ' prompt sections\n');

const prompts = [];
const errors = [];

rawPrompts.forEach((raw, i) => {
    try {
        const prompt = parsePrompt(raw, i);
        if (prompt && prompt.title) {
            prompts.push(prompt);
            const premiumLabel = prompt.is_premium ? ' [PREMIUM]' : '';
            console.log((i + 1) + '. ' + prompt.title.substring(0, 70) + premiumLabel);
        } else {
            errors.push('Prompt ' + (i + 1) + ': could not extract title');
        }
    } catch (e) {
        errors.push('Prompt ' + (i + 1) + ': ' + e.message);
    }
});

console.log('\n--- Summary ---');
console.log('Total parsed: ' + prompts.length);
console.log('Premium: ' + prompts.filter(p => p.is_premium).length);
console.log('Free: ' + prompts.filter(p => !p.is_premium).length);

if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(e => console.log('  ' + e));
}

// Write output
const outputPath = path.join(__dirname, '..', 'prompts-v2.json');
fs.writeFileSync(outputPath, JSON.stringify(prompts, null, 2), 'utf8');
console.log('\nWritten to: ' + outputPath);
