import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixSpacing() {
    const { data: prompts, error } = await supabase
        .from('prompts')
        .select('id, example_output');

    if (error) {
        console.error('Error fetching prompts:', error);
        return;
    }

    let updateCount = 0;

    for (const prompt of prompts) {
        if (!prompt.example_output) continue;

        let newOutput = prompt.example_output;

        // Replace single newlines with spacing, except when followed by lists/markers
        newOutput = newOutput.replace(/(?<!\n)\n(?!\n)(?!\s*(-|\*|\d+\.|\d+\)|○|●)\s)/g, ' ');

        // Remove 3 ou mais quebras de linha substituindo por 2 (parágrafo limpo)
        newOutput = newOutput.replace(/\n{3,}/g, '\n\n').trim();

        if (newOutput !== prompt.example_output) {
            await supabase
                .from('prompts')
                .update({ example_output: newOutput })
                .eq('id', prompt.id);
            updateCount++;
            console.log(`Updated spacing for prompt ID ${prompt.id}`);
        }
    }
    console.log(`Finished updating spacing. ${updateCount} prompts normalized.`);
}

fixSpacing();
