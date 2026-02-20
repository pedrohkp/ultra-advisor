const fs = require('fs');

function slugify(text) {
    return text.toString().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
}

function parse() {
    console.log('Reading prompts-dump.txt...');
    let raw = fs.readFileSync('prompts-dump.txt', 'utf8');

    // 1. Clean Page Markers
    // Pattern: -- 1 of 132 --
    raw = raw.replace(/-- \d+ of \d+ --/g, '');

    // 2. Normalize multiple newlines
    raw = raw.replace(/\n\s*\n/g, '\n\n');

    // 3. Split by "SITE (Ponta do Iceberg)"
    // The file structure is: [Category]\n... SITE ... \n Content \n ... [Next Category]
    const delimiter = 'SITE (Ponta do Iceberg)';
    const parts = raw.split(delimiter);

    const prompts = [];

    // Part 0 is preamble, contains first category at end
    // Last line of part 0 should be [Category]
    let currentCategory = '';

    const extractCategoryFromEnd = (text) => {
        const lines = text.trim().split('\n');
        // Look at last few lines for [Something]
        for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i].trim();
            if (line.match(/^\[.+\]$/)) {
                return line.replace(/[\[\]]/g, '');
            }
        }
        return 'General';
    };

    // Initialize first category from preamble
    currentCategory = extractCategoryFromEnd(parts[0]);

    console.log(`Found ${parts.length - 1} prompt sections.`);

    for (let i = 1; i < parts.length; i++) {
        let content = parts[i];

        // Define Next Category for next iteration, AND remove it from current content
        // But wait, split removed 'SITE...' so current content ends with [Next Category] (which belongs to next part)
        // So we extract it from current content end, and that becomes category for next loop (not this one)
        // Actually, current prompt's category was extracted from previous part.

        let nextCategoryIdentifier = extractCategoryFromEnd(content);

        // Remove the [Category] lines from content end to clean up
        // We can just strip the last line if it matches
        const lines = content.trim().split('\n');

        // Helper to find index of line starting with...
        const findStart = (prefix) => lines.findIndex(l => l.trim().startsWith(prefix));

        // Fields
        let title = '';
        let shortDesc = '';
        let fullDesc = '';
        let usageInstr = '';
        let promptTemplate = '';
        let exampleOutput = '';

        // Title: Nome: ...
        const nameIdx = findStart('Nome:');
        if (nameIdx !== -1) {
            title = lines[nameIdx].replace('Nome:', '').trim();
        }

        // Short Desc: Micro-descrição:
        const microIdx = findStart('Micro-descrição:');
        if (microIdx !== -1) {
            // It might be multi-line? Usually single line in dump?
            // checking dump: "Micro-descrição: Transforme ... \n emergentes ..."
            // It goes until "PLATAFORMA"
            const platIdx = findStart('PLATAFORMA (Conteúdo Completo)');
            if (platIdx !== -1) {
                shortDesc = lines.slice(microIdx, platIdx).join(' ').replace('Micro-descrição:', '').trim();
            } else {
                shortDesc = lines[microIdx].replace('Micro-descrição:', '').trim();
            }
        }

        // Full Desc: Para que serve: ... until Quando usar:
        const pqsIdx = findStart('Para que serve:');
        const quIdx = findStart('Quando usar:');
        if (pqsIdx !== -1 && quIdx !== -1) {
            fullDesc = lines.slice(pqsIdx, quIdx).join(' ').replace('Para que serve:', '').trim();
        }

        // Usage: Quando usar: ... until Prompt Completo:
        const pcIdx = findStart('Prompt Completo:');
        if (quIdx !== -1 && pcIdx !== -1) {
            usageInstr = lines.slice(quIdx + 1, pcIdx).join('\n').trim();
        }

        // Prompt: Prompt Completo: ... until Exemplo de Uso:
        const exIdx = findStart('Exemplo de Uso:');
        if (pcIdx !== -1 && exIdx !== -1) {
            promptTemplate = lines.slice(pcIdx + 1, exIndexWithOffset(lines, pcIdx)).join('\n').trim();
        }

        function exIndexWithOffset(linesArr, searchAfter) {
            for (let k = searchAfter; k < linesArr.length; k++) {
                if (linesArr[k].trim().startsWith('Exemplo de Uso:')) return k;
            }
            return linesArr.length;
        }

        // Example: Exemplo de Uso: ... until End (minus category tag)
        const realExIdx = exIndexWithOffset(lines, 0);
        if (realExIdx < lines.length) {
            // We need to cut off the [Next Category] at the end
            // We identified it as `nextCategoryIdentifier`
            // Let's remove lines that look like [Identifier] at the end
            let exampleLines = lines.slice(realExIdx + 1);

            // Remove last line if it is [Category]
            if (exampleLines.length > 0 && exampleLines[exampleLines.length - 1].trim() === `[${nextCategoryIdentifier}]`) {
                exampleLines.pop();
            }
            // Also remove blank lines at end
            while (exampleLines.length > 0 && !exampleLines[exampleLines.length - 1].trim()) {
                exampleLines.pop();
            }

            exampleOutput = exampleLines.join('\n').trim();
        }

        // Fallbacks
        if (!title) title = `Prompt ${i}`;

        prompts.push({
            title,
            slug: slugify(title),
            category_situation: currentCategory,
            category_niche: 'General', // Default
            description_short: shortDesc,
            description_full: fullDesc,
            content_template: promptTemplate,
            usage_instructions: usageInstr,
            example_output: exampleOutput,
            is_premium: false
        });

        // Set category for next loop
        currentCategory = nextCategoryIdentifier;
    }

    console.log(`Parsed ${prompts.length} prompts.`);

    // Write JSON
    fs.writeFileSync('prompts.json', JSON.stringify(prompts, null, 2));
    console.log('Saved prompts.json');

    // Write SQL
    let sql = `INSERT INTO prompts (title, slug, category_situation, category_niche, description_short, description_full, content_template, usage_instructions, example_output, is_premium) VALUES\n`;

    const escapeSql = (str) => {
        if (!str) return "''";
        return "'" + str.replace(/'/g, "''") + "'"; // Basic SQL escaping
    };

    const values = prompts.map(p => {
        return `(${escapeSql(p.title)}, ${escapeSql(p.slug)}, ${escapeSql(p.category_situation)}, ${escapeSql(p.category_niche)}, ${escapeSql(p.description_short)}, ${escapeSql(p.description_full)}, ${escapeSql(p.content_template)}, ${escapeSql(p.usage_instructions)}, ${escapeSql(p.example_output)}, false)`;
    });

    sql += values.join(',\n') + ';';

    fs.writeFileSync('insert_prompts.sql', sql);
    console.log('Saved insert_prompts.sql');
}

parse();
