/**
 * seed-prompts.js
 * Seeds the Supabase prompts table using the service role key (bypasses RLS).
 * Reads prompts from prompts.json and inserts them in batches.
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local manually (no dotenv dependency needed)
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) return;
    const key = line.substring(0, eqIndex).trim();
    const value = line.substring(eqIndex + 1).trim();
    env[key] = value;
});

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL'];
const SERVICE_ROLE_KEY = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}

console.log('Supabase URL:', SUPABASE_URL);
console.log('Service Role Key:', SERVICE_ROLE_KEY.substring(0, 20) + '...');

// Create Supabase admin client (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function seedPrompts() {
    // Load prompts from JSON
    const promptsPath = path.join(__dirname, '..', 'prompts.json');
    const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

    console.log('\n--- Seeding ' + prompts.length + ' prompts ---\n');

    // First, check existing prompts to avoid duplicates
    const { data: existing, error: fetchError } = await supabase
        .from('prompts')
        .select('slug');

    if (fetchError) {
        console.error('Error fetching existing prompts:', fetchError.message);
        process.exit(1);
    }

    const existingSlugs = new Set((existing || []).map(p => p.slug));
    console.log('Existing prompts in DB:', existingSlugs.size);

    // Filter out prompts that already exist
    const newPrompts = prompts.filter(p => !existingSlugs.has(p.slug));
    console.log('New prompts to insert:', newPrompts.length);

    if (newPrompts.length === 0) {
        console.log('\nAll prompts already exist in the database. Nothing to do.');
        return;
    }

    // Map to database columns
    const rows = newPrompts.map(p => ({
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

    // Insert in batches of 10
    const BATCH_SIZE = 10;
    let inserted = 0;
    let errors = 0;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const batch = rows.slice(i, i + BATCH_SIZE);
        const { data, error } = await supabase
            .from('prompts')
            .insert(batch)
            .select('id, title');

        if (error) {
            console.error('Error inserting batch ' + (Math.floor(i / BATCH_SIZE) + 1) + ':', error.message);
            // Try inserting one by one to find the problematic row
            for (const row of batch) {
                const { data: single, error: singleError } = await supabase
                    .from('prompts')
                    .insert(row)
                    .select('id, title');

                if (singleError) {
                    console.error('  FAILED: "' + row.title + '" - ' + singleError.message);
                    errors++;
                } else {
                    console.log('  OK: "' + single[0].title + '" (id: ' + single[0].id + ')');
                    inserted++;
                }
            }
        } else {
            data.forEach(d => {
                console.log('  OK: "' + d.title + '" (id: ' + d.id + ')');
            });
            inserted += data.length;
        }
    }

    console.log('\n--- Results ---');
    console.log('Inserted: ' + inserted);
    console.log('Errors: ' + errors);
    console.log('Total in DB: ' + (existingSlugs.size + inserted));
}

seedPrompts().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
