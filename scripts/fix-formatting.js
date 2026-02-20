/**
 * fix-formatting.js
 * Post-processes prompts-v3.json to fix PDF line-wrap artifacts.
 * 
 * Strategy: Join continuation lines (lines that are clearly wrapped mid-sentence)
 * while preserving intentional structure:
 * - Bullets (●, ○, ■, -, →)
 * - Numbered items (1., 2., etc.)
 * - Section headers (ALL CAPS lines, lines ending with :)
 * - Paragraph breaks (empty lines)
 * - Lines starting with special markers ([, <, ##)
 */
const fs = require('fs');
const path = require('path');
/**
 * Determine if a line is a "structural" line that should NOT be joined to the previous line.
 */
function isStructuralLine(line) {
    const trimmed = line.trim();
    if (!trimmed) return true; // empty line = paragraph break

    // Bullets and list markers
    if (/^[●○■►▪▸\-→]/.test(trimmed)) return true;
    // Numbered items
    if (/^\d+[\.\)]\s/.test(trimmed)) return true;
    // Lettered items
    if (/^[a-z][\.\)]\s/.test(trimmed)) return true;
    // Section headers in CAPS (at least 3 uppercase words)
    if (/^[A-ZÁÉÍÓÚÀÃÕÂÊÔÇ\s\-\/\(\)]{8,}:/.test(trimmed)) return true;
    // Lines starting with markdown headers  
    if (/^##/.test(trimmed)) return true;
    // Lines starting with special chars - only short template-style brackets like [SETOR]
    if (/^\[([A-ZÁÉÍÓÚÀÃÕÂÊÔÇ\-\s\/]{1,30})\]/.test(trimmed) || /^</.test(trimmed)) return true;
    // Lines that are labels/fields (short line ending with :)
    if (trimmed.endsWith(':') && trimmed.length < 60) return true;
    // Lines starting with keywords that are section starters
    if (/^(Para cada|Para isso|Para \[|Formato:|Evite:|Depois|Não me|Se você|Quero|Critérios|Importante|Atenção|Obs:|Nota:|Resultado|Exemplo|PROIBIDO|PERMITIDO|Crie|Execute|Desenhe|Preciso|Meu produto|Minha ideia|Cliente alvo|Ponto de preço|Analise|Tell me)/i.test(trimmed)) return true;
    // Lines that start with a capitalized word followed by colon (field labels)
    if (/^[A-ZÁÉÍÓÚÀÃÕÂÊÔÇ][A-Za-záéíóúàãõâêôç\-\s]+:/.test(trimmed) && trimmed.indexOf(':') < 40) return true;

    return false;
}

/**
 * Check if line looks like it was cut mid-sentence from PDF wrapping
 */
function isContinuationLine(prevLine, currentLine) {
    const prev = prevLine.trim();
    const curr = currentLine.trim();

    if (!prev || !curr) return false;
    if (isStructuralLine(currentLine)) return false;

    // NEVER join after a structural previous line (headers, labels, etc.)
    if (isStructuralLine(prevLine)) return false;

    // Current line starts with lowercase = very likely continuation
    const currStartsLower = /^[a-záéíóúàãõâêôç]/.test(curr);

    if (currStartsLower) return true;

    // Previous line ends mid-word/sentence (no terminal punctuation)
    const prevEndsClean = /[.!?;:"\)\]>»]$/.test(prev);
    if (!prevEndsClean && /[a-záéíóúàãõâêôç,]$/.test(prev)) {
        // Prev ends with letter or comma - likely continuation
        return true;
    }

    return false;
}

/**
 * Smart reformat: join PDF-wrapped lines while preserving structure
 */
function smartReformat(text) {
    if (!text) return '';

    const lines = text.split('\n');
    const result = [];
    let currentParagraph = '';
    let lastRawLine = ''; // Track the actual last line for continuation detection

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        if (!trimmed) {
            // Empty line = paragraph break
            if (currentParagraph) {
                result.push(currentParagraph);
                currentParagraph = '';
                lastRawLine = '';
            }
            result.push('');
            continue;
        }

        if (currentParagraph && isContinuationLine(lastRawLine, line)) {
            // Join with previous - add space if needed
            currentParagraph = currentParagraph.trimEnd() + ' ' + trimmed;
        } else {
            // Start new paragraph/line
            if (currentParagraph) {
                result.push(currentParagraph);
            }
            currentParagraph = trimmed;
        }
        lastRawLine = trimmed;
    }

    if (currentParagraph) {
        result.push(currentParagraph);
    }

    // Clean up: remove consecutive empty lines
    const cleaned = [];
    let lastWasEmpty = false;
    for (const line of result) {
        if (!line.trim()) {
            if (!lastWasEmpty) {
                cleaned.push('');
                lastWasEmpty = true;
            }
        } else {
            cleaned.push(line);
            lastWasEmpty = false;
        }
    }

    // Remove leading/trailing empty lines
    while (cleaned.length > 0 && !cleaned[0].trim()) cleaned.shift();
    while (cleaned.length > 0 && !cleaned[cleaned.length - 1].trim()) cleaned.pop();

    return cleaned.join('\n');
}

// ==================== MAIN ====================
const inputPath = path.join(__dirname, '..', 'prompts-v3.json');
const prompts = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

console.log('Reformatting ' + prompts.length + ' prompts...\n');

prompts.forEach((prompt, i) => {
    // Reformat all text fields
    prompt.content_template = smartReformat(prompt.content_template);
    prompt.usage_instructions = smartReformat(prompt.usage_instructions);
    prompt.example_output = smartReformat(prompt.example_output);
    prompt.description_short = prompt.description_short.replace(/\n\s*/g, ' ').trim();
    prompt.description_full = prompt.description_full.replace(/\n\s*/g, ' ').trim();
});

// Write back
const outputPath = path.join(__dirname, '..', 'prompts-v3.json');
fs.writeFileSync(outputPath, JSON.stringify(prompts, null, 2), 'utf8');
console.log('Done. Reformatted and saved to prompts-v3.json');

// Write comparison file for verification
const compare = [];
[0, 5, 15, 22, 25, 28].forEach(i => {
    compare.push('=== PROMPT ' + (i + 1) + ': ' + prompts[i].title + ' ===');
    compare.push('--- TEMPLATE ---');
    compare.push(prompts[i].content_template.substring(0, 600));
    compare.push('');
    compare.push('--- EXAMPLE (first 600 chars) ---');
    compare.push(prompts[i].example_output.substring(0, 600));
    compare.push('\n');
});
fs.writeFileSync(path.join(__dirname, '..', 'format-check.txt'), compare.join('\n'), 'utf8');
console.log('Comparison written to format-check.txt');
