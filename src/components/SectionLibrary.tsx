import { Badge } from "@/components/ui/badge"

const situations = [
    {
        category: "Inteligência de Mercado",
        items: ["Trend Report", "Market Sizing", "Competitor Map", "Market Entry"]
    },
    {
        category: "Validação & Descoberta",
        items: ["Customer Interview", "Persona Builder", "Demand Validation", "Survey Design"]
    },
    {
        category: "Lançamento & GTM",
        items: ["GTM Channel Analysis", "Pricing Strategy", "Brand Positioning", "Product Launch"]
    },
    {
        category: "Decisões Complexas",
        items: ["Second-Order Thinking", "Steelmanning", "Pre-Mortem", "Exposição de Vieses"]
    },
    {
        category: "Execução & Desbloqueio",
        items: ["Próximo Passo Físico", "Decomposição Recursiva", "Feedback Específico", "Janela de Oportunidade"]
    },
    {
        category: "Vantagem Competitiva",
        items: ["Contra-Posicionamento", "Efeito Volante", "Alavancagem Máxima", "Arbitragem de Conhecimento"]
    }
]

const niches = [
    {
        category: "Startups Early-Stage",
        items: ["Demand Validation", "Market Sizing", "GTM Channel", "Pre-Mortem"]
    },
    {
        category: "Consultores & Agências",
        items: ["Customer Interview", "Competitor Map", "Feedback Específico", "Storytelling"]
    },
    {
        category: "E-commerce & Varejo",
        items: ["Pricing Strategy", "Customer Persona", "Market Entry", "Sinais Fracos"]
    },
    {
        category: "B2B Enterprise",
        items: ["SWOT Acionável", "Second-Order Thinking", "Contra-Posicionamento", "Efeito Volante"]
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Explore a Biblioteca de <span className="text-gradient">Frameworks Estratégicos</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        35+ frameworks organizados para você encontrar a ferramenta certa para cada desafio.
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Classification 1: Situation */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-orange-500 pl-4">
                            Por Situação
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {situations.map((group, idx) => (
                                <div key={idx} className="bg-[#0F1F3D]/50 p-6 rounded-xl border border-white/5 hover:border-blue-500/20 transition-colors">
                                    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                        {group.category}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {group.items.map((item, i) => (
                                            <Badge key={i} variant="secondary" className="bg-blue-900/30 text-blue-300 border-blue-500/10 hover:bg-blue-800/50">
                                                {item}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Classification 2: Niche */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-blue-500 pl-4">
                            Por Nicho/Setor
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {niches.map((group, idx) => (
                                <div key={idx} className="bg-[#1A2B4F]/30 p-5 rounded-lg border border-white/5">
                                    <h4 className="font-medium text-gray-200 mb-3 text-sm uppercase tracking-wide">
                                        {group.category}
                                    </h4>
                                    <ul className="space-y-2">
                                        {group.items.map((item, i) => (
                                            <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-orange-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
