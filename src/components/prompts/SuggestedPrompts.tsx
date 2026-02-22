"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, LayoutTemplate } from "lucide-react";

interface Suggestion {
    slug: string;
    title: string;
    reason: string;
}

interface SuggestedPromptsProps {
    suggestions: Suggestion[];
}

export function SuggestedPrompts({ suggestions }: SuggestedPromptsProps) {
    if (!suggestions || suggestions.length === 0) {
        return (
            <div className="text-gray-400 italic text-sm py-4">
                Nenhuma sugestão encontrada para este cenário. Tente detalhar um pouco mais.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {suggestions.map((sug, i) => (
                <div
                    key={`${sug.slug}-${i}`}
                    className="group bg-[#0F1F3D] border border-white/10 rounded-xl p-5 hover:border-blue-500/50 hover:bg-blue-900/10 transition-all flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center relative overflow-hidden"
                >
                    {/* Left Accent Line */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:via-blue-500/60 group-hover:to-blue-500/20 transition-all"></div>

                    {/* Header */}
                    <div className="flex items-center gap-4 sm:w-1/3 shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                            <LayoutTemplate className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                            {sug.title}
                        </h3>
                    </div>

                    {/* AI Reasoning */}
                    <div className="flex-grow bg-black/20 rounded-lg p-3 border border-white/5 relative w-full sm:w-auto mt-2 sm:mt-0">
                        <Sparkles className="absolute top-3 right-3 w-4 h-4 text-orange-500/50" />
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-orange-400 mb-1">Por que usar:</span>
                        <p className="text-sm text-gray-300 leading-relaxed pr-6">
                            {sug.reason}
                        </p>
                    </div>

                    {/* Footer / CTA */}
                    <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5 sm:border-l sm:pl-6 flex justify-end">
                        <Link
                            href={`/prompts/${sug.slug}?from=finder`}
                            className="inline-flex items-center text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors whitespace-nowrap"
                        >
                            Acessar Framework
                            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
