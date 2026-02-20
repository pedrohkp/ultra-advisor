import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

const plans = [
    {
        name: "ULTRA BASE",
        price: "R$ 2.500",
        description: "Para quem quer acesso imediato à biblioteca.",
        features: [
            { text: "Acesso limitado à biblioteca", included: true },
            { text: "Context Builder Agent", included: true },
            { text: "Guia de usos + exemplos", included: true },
            { text: "Atualizações vitalícias (acesso limitado)", included: true },
            { text: "Trial Optimizer (5 usos)", included: true },
        ],
        cta: "Começar com Base",
        variant: "secondary",
        highlight: false,
        guarantee: "✅ Garantia de 7 dias"
    },
    {
        name: "ULTRA PREMIUM",
        price: "R$ 5.500",
        description: "A experiência completa para consultoria de elite.",
        features: [
            { text: "Biblioteca expandida", included: true },
            { text: "Context Builder Agent", included: true },
            { text: "Guia de usos + exemplos", included: true },
            { text: "Atualizações vitalícias (full access)", included: true },
            { text: "Optimizer Agent ilimitado", included: true },
            { text: "Exemplos de casos reais", included: true },
            { text: "Prompt Finder (em breve...)", included: true },
        ],
        cta: "Escolher Premium",
        variant: "default",
        highlight: true,
        tag: "Recomendado",
        guarantee: "✅ Garantia de 7 dias"
    }
]

export function SectionCTA() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628] to-[#0F1F3D]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-8 max-w-3xl mx-auto leading-tight">
                    Escolha seu plano e comece a tomar decisões de <span className="text-gradient">alto impacto</span> hoje mesmo.
                </h2>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12 text-left">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`relative flex flex-col ${plan.highlight ? 'border-orange-500/50 bg-[#1A2B4F] glow-orange' : 'bg-[#0F1F3D]/50 border-white/5'}`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 inset-x-0 flex justify-center">
                                    <Badge className="bg-orange-500 text-white px-4 py-1 uppercase text-xs tracking-wider font-bold">
                                        {plan.tag}
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="text-center pb-8 pt-10">
                                <CardTitle className="text-2xl mb-2 text-white">{plan.name}</CardTitle>
                                <div className="text-4xl font-bold text-white mb-2">{plan.price}</div>
                                <p className="text-gray-400 text-sm">{plan.description}</p>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <ul className="space-y-4">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm">
                                            {feature.included ? (
                                                <Check className="w-5 h-5 text-green-500 shrink-0" />
                                            ) : (
                                                <X className="w-5 h-5 text-gray-600 shrink-0" />
                                            )}
                                            <span className={feature.included ? "text-gray-200" : "text-gray-600"}>
                                                {feature.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter className="pt-4 pb-10 flex flex-col gap-4">
                                <span className="text-sm font-medium text-green-400 self-start">{plan.guarantee}</span>
                                <Button variant={plan.variant as "default" | "secondary"} className="w-full h-12 text-base">
                                    {plan.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
