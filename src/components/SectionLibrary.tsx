import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import Image from "next/image"

const categories = [
    {
        name: "Inteligência de Mercado",
        items: ["Trend Report", "Market Sizing", "Competitor Map", "Market Entry"]
    },
    {
        name: "Validação & Descoberta",
        items: ["Customer Interview", "Persona Builder", "Demand Validation", "Survey Design"]
    },
    {
        name: "Lançamento & GTM",
        items: ["GTM Channel Analysis", "Pricing Strategy", "Brand Positioning", "Product Launch"]
    },
    {
        name: "Decisões Complexas",
        items: ["Second-Order Thinking", "Steelmanning", "Pre-Mortem", "Exposição de Vieses"]
    },
    {
        name: "Execução & Desbloqueio",
        items: ["Próximo Passo Físico", "Decomposição Recursiva", "Feedback Específico", "Janela de Oportunidade"]
    },
    {
        name: "Vantagem Competitiva",
        items: ["Contra-Posicionamento", "Efeito Volante", "Alavancagem Máxima", "Arbitragem de Conhecimento"]
    }
]

export function SectionLibrary() {
    return (
        <section id="biblioteca" className="py-24 bg-[#0A1628]">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <Badge variant="outline" className="mb-4 border-blue-500/30 text-blue-400">
                        Acervo Completo
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
                        A biblioteca de frameworks que transforma IA em <span className="text-gradient">consultor estratégico</span>
                    </h2>

                    {/* Dashboard Mockup / Screenshot */}
                    <div className="mt-12 relative max-w-5xl mx-auto rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent z-10 pointer-events-none" />

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

                        {/* Image Placeholder - User needs to drop dashboard-preview.png in public */}
                        <div className="relative aspect-[16/9] bg-[#0A1628] flex items-center justify-center overflow-hidden">
                            {/* Fallback CSS Mockup just in case the image is missing */}
                            <div className="absolute inset-0 p-8 flex flex-col pointer-events-none opacity-40">
                                <div className="h-4 w-32 bg-white/20 rounded mb-8" />
                                <h3 className="text-3xl font-bold text-white mb-2">Olá, Pedro! 👋</h3>
                                <div className="h-4 w-64 bg-white/10 rounded mb-12" />
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="bg-[#1A2B4F] border border-white/5 rounded-xl p-6 h-40" />
                                    <div className="bg-[#1A2B4F] border border-white/5 rounded-xl p-6 h-40" />
                                    <div className="bg-[#1A2B4F] border border-white/5 rounded-xl p-6 h-40" />
                                </div>
                            </div>

                            {/* Actual image - will sit on top of fallback if it exists */}
                            <Image
                                src="/dashboard-preview.png"
                                alt="Dashboard Visão Geral"
                                fill
                                className="object-cover object-top"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-32 space-y-12 max-w-6xl mx-auto">
                    {categories.map((group, idx) => (
                        <div key={idx}>
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 border-l-4 border-orange-500 pl-3">
                                {group.name}
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {group.items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="bg-[#0F1F3D]/50 p-5 rounded-xl border border-white/5 hover:border-orange-500/30 hover:bg-[#1A2B4F]/50 transition-all flex flex-col justify-center h-24 group cursor-default shadow-sm shadow-blue-900/10"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="w-5 h-5 text-orange-500/70 group-hover:text-orange-500 transition-colors shrink-0" />
                                            <h4 className="font-semibold text-gray-200 group-hover:text-white transition-colors leading-tight">
                                                {item}
                                            </h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
