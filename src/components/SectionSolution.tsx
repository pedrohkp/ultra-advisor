import { Card } from "@/components/ui/card"
import { CheckCircle2, Zap, Database, Layers, Search } from "lucide-react"
import Image from "next/image"

const benefits = [
    {
        icon: Zap,
        title: "Prompts testados em campo",
        description: "Cada framework foi validado em situações reais de consultoria estratégica."
    },
    {
        icon: Database,
        title: "Contexto + Otimização de IA",
        description: "O Context Wizard entende sua empresa e nosso Agente Otimizador refina seu comando antes do uso."
    },
    {
        icon: Layers,
        title: "Comandos prontos para copiar",
        description: "Fizemos o trabalho de engenharia para você. É só preencher e rodar no seu ChatGPT, Gemini ou Claude."
    },
    {
        icon: Search,
        title: "Prompt Finder (Agente de IA Integrado)",
        description: "Não sabe qual framework usar? Descreva sua dor e a IA recomenda a solução exata para o seu momento."
    }
]

export function SectionSolution() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-900/20 blur-[100px] rounded-full opacity-40 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>A solução definitiva</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                            A biblioteca de frameworks que transforma IA em <span className="text-gradient">consultor estratégico</span>
                        </h2>

                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            O ULTRA ADVISOR não é apenas um &quot;pack de prompts&quot;. É um sistema completo com 35+ frameworks estruturados, Context Wizard e Agentes Otimizadores.
                        </p>

                        <div className="space-y-6">
                            {benefits.map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-[#0F1F3D] border border-white/5 flex items-center justify-center shrink-0">
                                        <item.icon className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                                        <p className="text-gray-400 text-sm">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        {/* Dashboard Mockup / Screenshot */}
                        <div className="relative w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/60 via-transparent to-transparent z-10 pointer-events-none" />

                            {/* Fake Browser Header */}
                            <div className="bg-[#0F1F3D] border-b border-white/5 px-4 py-3 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                                    <div className="w-3 h-3 rounded-full bg-[#EAB308]" />
                                    <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
                                </div>
                                <div className="mx-auto bg-[#1A2B4F] text-xs text-gray-400 px-4 py-1.5 rounded-md max-w-sm w-full text-center border border-white/5">
                                    ultra-advisor.com.br/dashboard
                                </div>
                            </div>

                            {/* Actual image */}
                            <div className="relative aspect-[16/9] bg-[#0A1628] flex items-center justify-center overflow-hidden">
                                <Image
                                    src="/dashboard-preview.png"
                                    alt="Dashboard Visão Geral"
                                    fill
                                    className="object-cover object-left-top"
                                    unoptimized
                                />
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 z-20 bg-[#0F1F3D] border border-orange-500/20 p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Tempo economizado</p>
                                <p className="font-bold text-white">120+ horas/mês</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
