import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import {
    ArrowLeft,
    Lock,
    Copy,
    AlertCircle
} from "lucide-react";
import { notFound } from "next/navigation";
import { FormattedText } from "@/components/ui/formatted-text";
import { CollapsibleExample } from "@/components/ui/collapsible-example";
import { PromptOptimizer } from "@/components/prompts/PromptOptimizer";
import { CopyButton } from "@/components/ui/copy-button";
import { ExpectationBanner } from "@/components/ui/expectation-banner";
import { FinderBackButton } from "@/components/ui/finder-back-button";
import "./prompt-detail.css";

import { jornadas } from "@/data/jornadas";

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function PromptDetailsPage(
    { params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const fromJourney = resolvedSearchParams?.fromJourney as string | undefined;
    const sourceJourney = fromJourney ? jornadas.find(j => j.id === fromJourney) : null;

    const user = await currentUser();

    // Ler metadata do Clerk
    const role = user?.publicMetadata?.role as string | undefined;
    const plan = user?.publicMetadata?.plan as string | undefined;

    const isAdmin = role === 'admin';
    const isPremiumUser = plan === 'premium';
    const hasAccess = isAdmin || isPremiumUser;

    let query = supabase.from('prompts').select('*').single();

    if (/^\d+$/.test(slug)) {
        query = supabase.from('prompts').select('*').eq('id', slug).maybeSingle();
    } else {
        query = supabase.from('prompts').select('*').eq('slug', slug).maybeSingle();
    }

    const { data: prompt, error } = await query;

    if (error) {
        console.error("Error fetching prompt:", JSON.stringify(error, null, 2));
        throw error;
    }

    if (!prompt) {
        notFound();
    }

    const isLocked = prompt.is_premium && !hasAccess;

    return (
        <div className="prompt-detail">

            {/* Back Link */}
            {sourceJourney ? (
                <Link href={`/jornadas/${sourceJourney.id}`} className="prompt-detail-back mb-6 inline-flex">
                    <ArrowLeft size={16} /> Retornar para a Jornada: {sourceJourney.title}
                </Link>
            ) : resolvedSearchParams?.from === 'finder' ? (
                <FinderBackButton />
            ) : (
                <Link href="/prompts" className="prompt-detail-back mb-6 inline-flex">
                    <ArrowLeft size={16} /> Voltar para Biblioteca
                </Link>
            )}

            {/* Header */}
            <div className="prompt-detail-header">
                <div className="prompt-detail-badges">
                    <span className="prompt-badge-category">
                        {prompt.category_situation}
                    </span>
                    {prompt.is_premium && (
                        <span className="prompt-badge-premium">
                            <Lock size={10} /> PREMIUM
                        </span>
                    )}
                </div>

                <h1>{prompt.title}</h1>

                <p className="prompt-detail-short-desc">
                    {prompt.description_short}
                </p>

                {prompt.description_full && (
                    <p className="prompt-detail-full-desc">
                        {prompt.description_full}
                    </p>
                )}
            </div>

            {/* Expectation Banner */}
            <ExpectationBanner />

            {/* Layout Grid */}
            <div className="prompt-detail-grid">
                {/* Left Column (Content) */}
                <div className="prompt-detail-main">
                    {/* Main Content Area */}
                    <div className="prompt-content-card">

                        {/* Content Header */}
                        <div className="prompt-content-bar">
                            <span className="prompt-content-bar-label">Template do Prompt</span>
                            {!isLocked && (
                                <CopyButton text={prompt.content_template} className="prompt-copy-btn" />
                            )}
                        </div>

                        {/* Content Body */}
                        <div className="prompt-content-body">
                            {isLocked ? (
                                <>
                                    <div className="prompt-blur-wrapper">
                                        {prompt.usage_instructions && (
                                            <div className="prompt-section-block">
                                                <h4 className="prompt-section-label">Quando Usar</h4>
                                                <div className="prompt-blurred">
                                                    <FormattedText text={prompt.usage_instructions} />
                                                </div>
                                            </div>
                                        )}

                                        {prompt.content_template && (
                                            <div className="prompt-section-block">
                                                <h4 className="prompt-section-label">Prompt Completo</h4>
                                                <div className="prompt-blurred">
                                                    <FormattedText text={prompt.content_template} />
                                                </div>
                                            </div>
                                        )}

                                        {prompt.example_output && (
                                            <div>
                                                <h4 className="prompt-section-label">Exemplo de Uso</h4>
                                                <div className="prompt-blurred prompt-blurred-example">
                                                    <FormattedText text={prompt.example_output} />
                                                </div>
                                            </div>
                                        )}

                                        {/* CTA Overlay */}
                                        <div className="prompt-cta-overlay">
                                            <div className="prompt-cta-card">
                                                <div className="prompt-cta-icon">
                                                    <Lock size={28} />
                                                </div>
                                                <h3>Faça upgrade para PREMIUM e desbloqueie este framework</h3>
                                                <p>Acesse o prompt completo, instruções de uso e exemplos práticos de todos os frameworks estratégicos.</p>
                                                <button className="prompt-cta-button">
                                                    🔓 Desbloquear Acesso PREMIUM
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="prompt-content-text">
                                    <FormattedText text={prompt.content_template} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Usage Instructions (if unlocked) */}
                    {!isLocked && prompt.usage_instructions && (
                        <div className="prompt-usage-box">
                            <h3>
                                <AlertCircle size={18} /> Quando Usar
                            </h3>
                            <FormattedText text={prompt.usage_instructions} style={{ color: '#D1D5DB' }} />
                        </div>
                    )}

                    {/* Example Output (if unlocked) — Collapsible */}
                    {!isLocked && prompt.example_output && (
                        <CollapsibleExample content={prompt.example_output} />
                    )}
                </div>

                {/* Prompt Optimizer — Premium Only (Right Column) */}
                {hasAccess && !isLocked && (
                    <div className="prompt-detail-sidebar">
                        <PromptOptimizer
                            promptTitle={prompt.title}
                            promptTemplate={prompt.content_template}
                        />
                    </div>
                )}
            </div>
        </div >
    );
}
