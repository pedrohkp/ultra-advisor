import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import PromptsGrid from "@/components/prompts/PromptsGrid";
import "@/components/prompts/prompts.css";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function PromptsPage() {
    const user = await currentUser();

    // Ler metadata do Clerk
    const role = user?.publicMetadata?.role as string | undefined;
    const plan = user?.publicMetadata?.plan as string | undefined;

    const isAdmin = role === 'admin';
    const isPremiumUser = plan === 'premium';
    const hasAccess = isAdmin || isPremiumUser;

    const { data: prompts, error } = await supabase
        .from('prompts')
        .select('id, title, slug, category_situation, category_niche, is_premium, description_short, created_at')
        .order('id', { ascending: true });

    if (error) {
        console.error("Error fetching prompts:", error);
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#EF4444' }}>
                Erro ao carregar prompts. Tente novamente mais tarde.
            </div>
        );
    }

    return (
        <div style={{ fontFamily: 'var(--font-geist-sans), sans-serif', color: '#fff' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Biblioteca de Prompts
                </h1>
                <p style={{ color: '#9CA3AF' }}>
                    Explore nossa coleção de frameworks de IA prontos para uso.
                </p>
            </div>

            <PromptsGrid prompts={prompts || []} hasAccess={hasAccess} />
        </div>
    );
}
