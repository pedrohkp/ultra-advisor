const fs = require('fs');
const c = fs.readFileSync('prompts-dump.txt', 'utf8');
const parts = c.split('===PROMPT===').filter(p => p.trim().length > 0);
const out = [];

// Check prompts that are failing: 16-31
for (let idx = 15; idx < parts.length; idx++) {
    const t = parts[idx].trim();
    const lines = t.split('\n');

    out.push('=== PROMPT ' + (idx + 1) + ' (total lines: ' + lines.length + ') ===');
    out.push('First 3 lines: ' + lines.slice(0, 3).join(' | '));

    // Check for key markers
    const hasPromptCompleto = t.includes('Prompt Completo:') || t.includes('**Prompt Completo:**') || t.includes('**Prompt Completo**');
    const hasExemploUso = t.includes('Exemplo de Uso:') || t.includes('**Exemplo de Uso:**') || t.includes('**Exemplo de Uso**');
    const hasInput = t.includes('● Input') || t.includes('**Input');
    const hasOutput = t.includes('● Output') || t.includes('**Output');
    const hasParaQueServe = t.includes('Para que serve:') || t.includes('**Para que serve:**');
    const hasQuandoUsar = t.includes('Quando usar:') || t.includes('**Quando usar:**') || t.includes('**Quando usar**');
    const hasNomeCompleto = t.includes('Nome Completo:') || t.includes('**Nome Completo:**');

    out.push('  Markers: ' +
        'NomeCompleto=' + hasNomeCompleto +
        ' ParaQueServe=' + hasParaQueServe +
        ' QuandoUsar=' + hasQuandoUsar +
        ' PromptCompleto=' + hasPromptCompleto +
        ' ExemploUso=' + hasExemploUso +
        ' Input=' + hasInput +
        ' Output=' + hasOutput
    );

    // Show the formatting variants found
    if (t.includes('**')) {
        const boldMatches = t.match(/\*\*[^*]+\*\*/g) || [];
        out.push('  Bold markers found: ' + boldMatches.slice(0, 10).join(', '));
    }

    out.push('');
}

fs.writeFileSync('parser-debug.txt', out.join('\n'), 'utf8');
console.log('Written to parser-debug.txt');
