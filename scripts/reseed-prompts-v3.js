/**
 * reseed-prompts-v3.js
 * Deletes all prompts and re-inserts from prompts-v3.json
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing SUPABASE env vars. Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function reseed() {
    const promptsPath = path.join(__dirname, '..', 'prompts-v3.json');
    const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
    console.log('Loaded ' + prompts.length + ' prompts from prompts-v3.json');

    // Delete all existing prompts
    console.log('Deleting all existing prompts...');
    const { error: delError } = await supabase
        .from('prompts')
        .delete()
        .neq('id', 0); // delete all (rows have id > 0)

    if (delError) {
        console.error('Delete error:', delError);
        process.exit(1);
    }
    console.log('All existing prompts deleted.');

    // Insert in batches of 5
    let inserted = 0;
    let errors = 0;
    const batchSize = 5;

    for (let i = 0; i < prompts.length; i += batchSize) {
        const batch = prompts.slice(i, i + batchSize);
        const { data, error } = await supabase
            .from('prompts')
            .insert(batch);

        if (error) {
            console.error('Insert error at batch', i, ':', error.message);
            // Try one-by-one
            for (const p of batch) {
                const { error: singleErr } = await supabase.from('prompts').insert(p);
                if (singleErr) {
                    console.error('  Failed: ' + p.title + ' - ' + singleErr.message);
                    errors++;
                } else {
                    inserted++;
                }
            }
        } else {
            inserted += batch.length;
        }
    }

    console.log('\n=== RESEED COMPLETE ===');
    console.log('Inserted: ' + inserted);
    console.log('Errors: ' + errors);
    console.log('Premium: ' + prompts.filter(p => p.is_premium).length);
    console.log('Free: ' + prompts.filter(p => !p.is_premium).length);
}

reseed().catch(console.error);
