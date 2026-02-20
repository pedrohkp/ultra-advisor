import React from 'react';

export type OptimizerStep = 1 | 2 | 3;

interface OptimizerStepperProps {
    currentStep: OptimizerStep;
}

export function OptimizerStepper({ currentStep }: OptimizerStepperProps) {
    const steps = [
        {
            num: 1,
            icon: "✏️",
            title: "Você descreve",
            subtitle: "Descreva sua situação ou desafio"
        },
        {
            num: 2,
            icon: "⚡",
            title: "ULTRA processa",
            subtitle: "Mapeamos riscos, fricções e premissas ocultas"
        },
        {
            num: 3,
            icon: "🤖",
            title: "Você cola na IA",
            subtitle: "Leve o bloco para o ChatGPT, Claude ou outra IA"
        }
    ];

    return (
        <div className="w-full mb-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                {steps.map((step, index) => {
                    const isActive = currentStep === step.num;
                    const isPast = currentStep > step.num;

                    return (
                        <React.Fragment key={step.num}>
                            {/* Step Item */}
                            <div className="flex items-center gap-4 z-10 bg-[var(--background-secondary)] px-4 py-2 rounded-xl border border-white/5">
                                <div className={`flex items-center justify-center w-12 h-12 rounded-full text-xl transition-colors ${isActive ? 'bg-[var(--primary)]/20 border border-[var(--primary)]/50' : isPast ? 'bg-white/10' : 'bg-white/5 opacity-50'}`}>
                                    {step.icon}
                                </div>
                                <div>
                                    <p className={`font-bold text-sm tracking-wide uppercase transition-colors ${isActive ? 'text-[var(--primary)]' : isPast ? 'text-white' : 'text-white/30'}`}>
                                        {step.num}. {step.title}
                                    </p>
                                    <p className={`text-xs transition-colors ${isActive ? 'text-white/80' : 'text-white/30'}`}>
                                        {step.subtitle}
                                    </p>
                                </div>
                            </div>

                            {/* Connector (not after last item) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:flex flex-1 items-center justify-center px-4">
                                    <div className="flex items-center gap-1 text-white/20">
                                        <span className="text-xl">→</span>
                                        <span className="text-xl">→</span>
                                    </div>
                                </div>
                            )}

                            {/* Mobile connector */}
                            {index < steps.length - 1 && (
                                <div className="md:hidden flex items-center justify-center py-1 text-white/20">
                                    <span className="text-xl">↓</span>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
