import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables!")
}

// Cliente público legado (ainda usado se não precisarmos de RLS rigoroso no momento, ou para bypass)
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder',
    {
        auth: {
            persistSession: false
        }
    }
)

// Cliente Autenticado Integrado com o Clerk
export async function getClient() {
    const { getToken } = await auth();
    // Tenta pegar o token do template "supabase" configurado no Clerk
    const supabaseToken = await getToken({ template: 'supabase' });

    return createClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseAnonKey || 'placeholder',
        {
            global: {
                headers: supabaseToken ? { Authorization: `Bearer ${supabaseToken}` } : {},
            },
            auth: {
                persistSession: false // Server-side
            }
        }
    )
}
