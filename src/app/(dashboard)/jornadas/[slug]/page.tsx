import { jornadas } from "@/data/jornadas"
import { getClient } from "@/lib/supabase"
import { currentUser } from "@clerk/nextjs/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import * as Icons from "lucide-react"
import PromptsGrid from "@/components/prompts/PromptsGrid"
import "@/components/prompts/prompts.css"

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function JornadaDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const jornada = jornadas.find((j) => j.id === slug)

    if (!jornada) {
        notFound()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const HeaderIcon = (Icons as any)[jornada.icon] || Icons.Map;

    const user = await currentUser();
    const role = user?.publicMetadata?.role as string | undefined;
    const plan = user?.publicMetadata?.plan as string | undefined;
    const isAdmin = role === 'admin';
    const isPremiumUser = plan === 'premium';
    const hasAccess = isAdmin || isPremiumUser;

    const supabase = await getClient();
    const { data: prompts, error } = await supabase
        .from('prompts')
        .select('id, title, slug, category_situation, category_niche, is_premium, description_short, created_at');

    if (error || !prompts) {
        console.error("Error fetching prompts:", error);
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#EF4444' }}>
                Erro ao carregar os prompts da jornada.
            </div>
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedPrompts = jornada.steps
        .map(step => prompts.find(p => p.slug === step.slug))
        .filter(Boolean) as any[];

    return (
        <div className="flex-1 w-full flex flex-col min-h-screen bg-dashboard-dark">
            <div className="border-b border-white/5 bg-dashboard-card/50 px-8 py-8 flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                <Link
                    href="/jornadas"
                    className="inline-flex items-center text-sm text-white/50 hover:text-white transition-colors w-fit group"
                >
                    <Icons.ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Voltar para Jornadas
                </Link>

                <div className="flex items-start gap-5 mt-2 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                        <HeaderIcon className="w-8 h-8 text-orange-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3">
                            {jornada.title}
                        </h1>
                        <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
                            {jornada.description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-8 w-full max-w-7xl mx-auto" style={{ fontFamily: 'var(--font-geist-sans), sans-serif', color: '#fff' }}>
                <PromptsGrid
                    prompts={mappedPrompts}
                    hasAccess={hasAccess}
                    fromJourney={jornada.id}
                    preserveOrder={true}
                />
            </div>
        </div>
    )
}
