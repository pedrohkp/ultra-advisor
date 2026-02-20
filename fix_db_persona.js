import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPersona() {
    const { data: prompt, error } = await supabase
        .from('prompts')
        .select('*')
        .ilike('title', '%PERSONAS COMPORTAMENTAIS%')
        .single();

    if (error) {
        console.error('Error fetching prompt:', error);
        return;
    }

    let newTemplate = prompt.content_template;

    // Remove as tags soltas especificadas pelo usuário
    newTemplate = newTemplate.replace(/<role>/gi, '');
    newTemplate = newTemplate.replace(/<\/role>/gi, '');
    newTemplate = newTemplate.replace(/<task>/gi, '');
    newTemplate = newTemplate.replace(/<\/task>/gi, '');
    newTemplate = newTemplate.replace(/<constraints>/gi, '');
    newTemplate = newTemplate.replace(/<\/constraints>/gi, '');

    // Limpar espaços extras em branco caso as tags estivessem sozinhas numa linha
    newTemplate = newTemplate.replace(/\n\s*\n\s*\n/g, '\n\n').trim();

    const { error: updateError } = await supabase
        .from('prompts')
        .update({ content_template: newTemplate })
        .eq('id', prompt.id);

    if (updateError) {
        console.error('Error updating prompt:', updateError);
    } else {
        console.log('Successfully fixed "PERSONAS COMPORTAMENTAIS" prompt templates.');
    }
}

fixPersona();
