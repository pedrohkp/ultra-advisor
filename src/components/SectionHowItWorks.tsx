import { ClipboardList, Search, Zap } from "lucide-react"

const steps = [
    {
        icon: ClipboardList,
        title: "1. Crie seu contexto",
        description: "Responda 10-15 perguntas no Context Wizard e gere um PDF estruturado com o DNA da sua empresa."
    },
    {
        icon: Search,
        title: "2. Escolha o framework",
        description: "Navegue pela biblioteca ou descreva seu problema para nossa I.A. recomendar o framework ideal."
    },
    {
        icon: Zap,
        title: "3. Otimize e Gere",
        description: "Copie o prompt validado ou deixe nosso Agente Otimizador refiná-lo automaticamente antes do uso."
    }
]

export function SectionHowItWorks() {
    return (
        <section className="py-24 bg-[#0F1F3D]">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Como o ULTRA ADVISOR eleva suas decisões em <span className="text-blue-500">3 passos</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 z-0" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-2xl bg-[#1A2B4F] border border-blue-500/20 flex items-center justify-center mb-6 shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform duration-300">
                                <step.icon className="w-10 h-10 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-gray-400 max-w-xs text-sm leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
