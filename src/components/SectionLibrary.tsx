import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import Image from "next/image"

const categories = [
    {
        name: "Inteligência de Mercado",
        items: ["Relatório de Tendências", "Tamanho do Mercado", "Mapa de Concorrentes", "Entrada no Mercado"]
    },
    {
        name: "Validação & Descoberta",
        items: ["Entrevista de Cliente", "Criação de Persona", "Validação de Demanda", "Design de Pesquisa"]
    },
    {
        name: "Lançamento & GTM",
        items: ["Análise de Canais GTM", "Estratégia de Preço", "Posicionamento de Marca", "Lançamento de Produto"]
    },
    {
        name: "Decisões Complexas",
        items: ["Pensamento de 2ª Ordem", "Argumentação (Steelmanning)", "Análise Pre-Mortem", "Identificação de Vieses"]
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
                    <h2 className="text-3xl md:text-5xl font-bold max-w-4xl mx-auto leading-tight">
                        A biblioteca de frameworks que transforma IA em <span className="text-gradient">consultor estratégico</span>
                    </h2>
                </div>

                <div className="mt-20 space-y-12 max-w-6xl mx-auto">
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
