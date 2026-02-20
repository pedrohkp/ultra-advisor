const fs = require('fs');
const p = JSON.parse(fs.readFileSync('prompts-v2.json', 'utf8'));
const lines = [];
p.forEach(function (x, i) {
    const hasTemplate = x.content_template && x.content_template.trim().length > 20;
    const hasExample = x.example_output && x.example_output.trim().length > 20;
    const hasUsage = x.usage_instructions && x.usage_instructions.trim().length > 5;
    const tLen = x.content_template ? x.content_template.trim().length : 0;
    const eLen = x.example_output ? x.example_output.trim().length : 0;
    const uLen = x.usage_instructions ? x.usage_instructions.trim().length : 0;
    lines.push(
        (i + 1) + '. ' +
        (hasTemplate ? 'T:OK(' + tLen + ')' : 'T:MISS(' + tLen + ')') + ' | ' +
        (hasExample ? 'E:OK(' + eLen + ')' : 'E:MISS(' + eLen + ')') + ' | ' +
        (hasUsage ? 'U:OK(' + uLen + ')' : 'U:MISS(' + uLen + ')') + ' | ' +
        x.title
    );
});
fs.writeFileSync('prompts-diagnostic.txt', lines.join('\n'), 'utf8');
console.log('Done. Written to prompts-diagnostic.txt');
