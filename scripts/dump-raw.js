const fs = require('fs');
const c = fs.readFileSync('prompts-dump.txt', 'utf8');
const parts = c.split('===PROMPT===').filter(p => p.trim().length > 0);

// Dump the raw text of problematic prompts
const problematic = [15, 22, 27, 29, 30]; // 0-indexed: prompts 16, 23, 28, 30, 31
const out = [];

problematic.forEach(idx => {
    const t = parts[idx].trim();
    out.push('========== PROMPT ' + (idx + 1) + ' ==========');
    out.push(t);
    out.push('');
    out.push('');
});

fs.writeFileSync('raw-problematic.txt', out.join('\n'), 'utf8');
console.log('Written to raw-problematic.txt');
