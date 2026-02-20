

/**
 * Updates category_situation for all 31 prompts
 * in both prompts-v3.json and Supabase.
 */
const fs = require('fs');
const path = require('path');

// New category mapping by prompt number (1-indexed)
const categoryMap = {
    1: 'Análise de Mercado',
    2: 'Análise de Mercado',
    3: 'Estratégia e Posicionamento',
    4: 'Análise de Mercado',
    5: 'Análise de Mercado',
    6: 'Estratégia e Posicionamento',
    7: 'Estratégia e Posicionamento',
    8: 'Análise de Mercado',
    9: 'Decisões Estratégicas',
    10: 'Decisões Estratégicas',
    11: 'Estratégia e Posicionamento',
    12: 'Crescimento e Aprendizado',
    13: 'Pensamento Crítico',
    14: 'Pensamento Crítico',
    15: 'Análise de Mercado',
    16: 'Decisões Estratégicas',
    17: 'Execução e Operação',
    18: 'Pensamento Crítico',
    19: 'Decisões Estratégicas',
    20: 'Estratégia e Posicionamento',
    21: 'Pensamento Crítico',
    22: 'Execução e Operação',
    23: 'Comunicação e Conteúdo',
    24: 'Execução e Operação',
    25: 'Execução e Operação',
    26: 'Comunicação e Conteúdo',
    27: 'Crescimento e Aprendizado',
    28: 'Pensamento Crítico',
    29: 'Crescimento e Aprendizado',
    30: 'Decisões Estratégicas',
    31: 'Estratégia e Posicionamento',
};

// --- UPDATE LOCAL JSON ---
const jsonPath = path.join(__dirname, '..', 'prompts-v3.json');
const prompts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const changes = [];

prompts.forEach((p, i) => {
    const num = i + 1;
    const newCat = categoryMap[num];
    if (!newCat) return;

    const oldCat = p.category_situation;
    if (oldCat !== newCat) {
        changes.push({ num, title: p.title, old: oldCat, new: newCat });
    }
    p.category_situation = newCat;
});

fs.writeFileSync(jsonPath, JSON.stringify(prompts, null, 2), 'utf8');

console.log(`📄 prompts-v3.json saved (${prompts.length} prompts)`);
console.log(`\n🔄 Changes made:`);
changes.forEach(c => console.log(`  #${c.num} ${c.title}: "${c.old}" → "${c.new}"`));
console.log(`\n  Total changed: ${changes.length} | Unchanged: ${prompts.length - changes.length}`);

// --- UPDATE SUPABASE ---
async function updateSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error('❌ Missing Supabase env vars');
        process.exit(1);
    }

    console.log('\n☁️  Updating Supabase...');

    for (const p of prompts) {
        const res = await fetch(`${url}/rest/v1/prompts?slug=eq.${p.slug}`, {
            method: 'PATCH',
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ category_situation: p.category_situation })
        });

        if (!res.ok) {
            const txt = await res.text();
            console.error(`❌ Failed for ${p.slug}: ${res.status} ${txt}`);
            process.exit(1);
        }
    }

    console.log(`✅ Supabase: all ${prompts.length} prompts updated`);
}

updateSupabase().catch(err => {
    console.error('❌ Supabase error:', err.message);
    process.exit(1);
});
