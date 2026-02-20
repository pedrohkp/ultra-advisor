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
            { text: "Biblioteca completa (35+ prompts)", included: true },
            { text: "Context Builder Agent", included: true },
            { text: "Guia de uso + exemplos", included: true },
            { text: "Atualizações vitalícias", included: true },
            { text: "Trial Optimizer (7 dias, 20 usos)", included: true },
            { text: "Optimizer ilimitado", included: false },
            { text: "Multi-Step & Templates", included: false },
            { text: "15 prompts premium exclusivos", included: false },
        ],
        cta: "Começar com Base",
        variant: "secondary",
        highlight: false
    },
    {
        name: "ULTRA PREMIUM",
        price: "R$ 5.500",
        description: "A experiência completa para consultoria de elite.",
        features: [
            { text: "Biblioteca completa (35+ prompts)", included: true },
            { text: "Context Builder Agent", included: true },
            { text: "Guia de uso + exemplos", included: true },
            { text: "Atualizações vitalícias", included: true },
            { text: "Optimizer Agent ilimitado", included: true },
            { text: "Multi-Step & Templates Inteligentes", included: true },
            { text: "Biblioteca expandida (+15 prompts)", included: true },
            { text: "30 Casos Reais Setoriais", included: true },
        ],
        cta: "Escolher Premium",
        variant: "default",
        highlight: true,
        tag: "Recomendado"
    }
]

export function SectionComparison() {
    return (
        <section id="planos" className="py-24 bg-[#0A1628]">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Escolha o plano ideal para suas <span className="text-gradient">decisões estratégicas</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Acesso vitalício, pagamento único e garantia de satisfação.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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

                            <CardFooter className="pt-8 pb-10">
                                <Button variant={plan.variant as "default" | "secondary"} className="w-full h-12 text-base">
                                    {plan.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500">
                        Garantia de 7 dias para o plano Base e 30 dias para o Premium.
                    </p>
                </div>
            </div>
        </section>
    )
}
