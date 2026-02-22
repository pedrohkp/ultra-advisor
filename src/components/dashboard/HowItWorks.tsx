import React from "react";
import { ExpectationBanner } from "@/components/ui/expectation-banner";

export function HowItWorks() {
    const steps = [
        {
            number: "1",
            title: "1. CONSTRUA SEU CONTEXTO",
            description: "Use o Context Wizard para gerar seu PDF com o panorama completo da sua empresa.",
        },
        {
            number: "2",
            title: "ESCOLHA SEU FRAMEWORK",
            description: "Acesse a Biblioteca e selecione o prompt ideal para sua decisão ou desafio.",
        },
        {
            number: "3",
            title: "LEVE PARA SUA IA FAVORITA",
            description: "Copie o comando gerado e cole no ChatGPT, Claude ou qualquer IA que preferir.",
        },
        {
            number: "4",
            title: "APLIQUE O RESULTADO",
            description: "Use o output da IA para tomar decisões mais rápidas e fundamentadas.",
        }
    ];

    return (
        <div className="mb-12">
            <h2 className="text-center text-white/80 font-bold text-xl mb-6">
                É simples assim
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                {steps.map((step, index) => (
                    <div key={index} className="relative group">
                        <div className="h-full flex flex-col p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl transition-colors hover:bg-white/10 z-10 relative">
                            <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-lg flex items-center justify-center mb-4 shrink-0">
                                {step.number}
                            </div>
                            <h3 className="text-sm font-bold tracking-wider text-white mb-2 uppercase">
                                {step.title}
                            </h3>
                            <p className="text-sm text-white/70 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                        {/* Seta conectora (só visível no desktop e não no último) */}
                        {index < steps.length - 1 && (
                            <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-0 text-white/20 text-2xl font-light">
                                →
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <ExpectationBanner />
            </div>

            <div className="mt-8 text-center border-b border-white/10 pb-8">
                <p className="text-sm text-white/60 max-w-2xl mx-auto leading-relaxed">
                    ⚡ Pense como um maestro: O ULTRA ADVISOR conduz, a IA executa!
                </p>
            </div>
        </div >
    );
}
