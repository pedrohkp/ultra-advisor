import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Target, Clock, Puzzle, Briefcase } from "lucide-react"

const problems = [
    {
        icon: Target,
        title: "Outputs superficiais",
        description: "Prompts genéricos geram respostas rasas que parecem inteligentes mas não resolvem nada."
    },
    {
        icon: Clock,
        title: "Retrabalho constante",
        description: "Você perde horas iterando e corrigindo a IA até conseguir algo minimamente útil."
    },
    {
        icon: Puzzle,
        title: "Falta de metodologia",
        description: "Sem estrutura clara, a IA alucina ou se perde em tarefas complexas de estratégia."
    },
    {
        icon: Briefcase,
        title: "Zero contexto de negócio",
        description: "A IA não entende sua empresa, seus diferenciais ou seu momento de mercado."
    }
]

export function SectionProblem() {
    return (
        <section className="py-24 bg-[#0F1F3D]/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Por que decisões estratégicas falham com <span className="text-blue-500">IA genérica</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Usar o ChatGPT sem frameworks é como contratar um consultor júnior e esperar conselhos de CEO.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {problems.map((item, index) => (
                        <Card key={index} className="bg-[#1A2B4F]/50 border-white/5 hover:border-blue-500/30 transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                                    <item.icon className="w-6 h-6 text-blue-400" />
                                </div>
                                <CardTitle className="text-xl">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
