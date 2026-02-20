const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const logFile = 'db_check_result.txt';
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};

if (!supabaseUrl || !supabaseAnonKey) {
    log("Missing env vars");
    process.exit(1);
}

log(`Connecting to ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkPrompts() {
    log("Checking prompts table...");
    try {
        const { data, error } = await supabase.from('prompts').select('id, slug, title, is_premium');

        if (error) {
            log(`Error: ${JSON.stringify(error, null, 2)}`);
        } else {
            log(`Found ${data.length} prompts.`);
            if (data.length > 0) {
                log(JSON.stringify(data, null, 2));
            } else {
                log("Table is empty (or RLS blocking read).");
            }
        }
    } catch (err) {
        log(`Exception: ${err.message}`);
    }
}

fs.writeFileSync(logFile, ''); // Clear log
checkPrompts();
