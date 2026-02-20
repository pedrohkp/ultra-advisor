/**
 * reseed-prompts.js
 * Deletes all existing prompts and re-seeds with the corrected prompts-v2.json
 * Uses service role key to bypass RLS
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) return;
    env[line.substring(0, eqIndex).trim()] = line.substring(eqIndex + 1).trim();
});

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL'];
const SERVICE_ROLE_KEY = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function reseed() {
    // Load v2 prompts
    const promptsPath = path.join(__dirname, '..', 'prompts-v2.json');
    const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
    console.log('Loaded ' + prompts.length + ' prompts from prompts-v2.json');

    // Step 1: Delete ALL existing prompts
    console.log('\n--- Deleting all existing prompts ---');
    const { error: deleteError } = await supabase
        .from('prompts')
        .delete()
        .gte('id', 0); // Delete all rows

    if (deleteError) {
        console.error('Error deleting:', deleteError.message);
        process.exit(1);
    }
    console.log('All existing prompts deleted.');

    // Step 2: Insert new prompts in batches
    console.log('\n--- Inserting ' + prompts.length + ' prompts ---');

    const BATCH_SIZE = 5;
    let inserted = 0;
    let errors = 0;

    for (let i = 0; i < prompts.length; i += BATCH_SIZE) {
        const batch = prompts.slice(i, i + BATCH_SIZE).map(p => ({
            title: p.title,
            slug: p.slug,
            category_situation: p.category_situation || 'General',
            category_niche: p.category_niche || 'General',
            is_premium: p.is_premium || false,
            description_short: p.description_short || '',
            description_full: p.description_full || '',
            content_template: p.content_template || '',
            usage_instructions: p.usage_instructions || '',
            example_output: p.example_output || ''
        }));

        const { data, error } = await supabase
            .from('prompts')
            .insert(batch)
            .select('id, title, is_premium');

        if (error) {
            console.error('Batch error:', error.message);
            // Fallback: insert one by one
            for (const row of batch) {
                const { data: single, error: singleError } = await supabase
                    .from('prompts')
                    .insert(row)
                    .select('id, title, is_premium');
                if (singleError) {
                    console.error('  FAIL: "' + row.title.substring(0, 50) + '" - ' + singleError.message);
                    errors++;
                } else {
                    const label = single[0].is_premium ? ' [PREMIUM]' : '';
                    console.log('  OK: ' + single[0].id + '. ' + single[0].title.substring(0, 60) + label);
                    inserted++;
                }
            }
        } else {
            data.forEach(d => {
                const label = d.is_premium ? ' [PREMIUM]' : '';
                console.log('  OK: ' + d.id + '. ' + d.title.substring(0, 60) + label);
            });
            inserted += data.length;
        }
    }

    console.log('\n--- Results ---');
    console.log('Inserted: ' + inserted);
    console.log('Errors: ' + errors);
    console.log('Premium: ' + prompts.filter(p => p.is_premium).length);
    console.log('Free: ' + prompts.filter(p => !p.is_premium).length);
}

reseed().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
