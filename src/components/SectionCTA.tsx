import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

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

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">

                    {/* Base Plan Card Small */}
                    <Card className="bg-[#0A1628]/50 border-white/5 hover:border-blue-500/30 text-left">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">ULTRA BASE</CardTitle>
                            <p className="text-2xl font-bold text-white mt-2">R$ 2.500</p>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center gap-2 text-sm text-gray-400">
                                    <Check className="w-4 h-4 text-green-500" /> Biblioteca Completa (35+)
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-400">
                                    <Check className="w-4 h-4 text-green-500" /> Context Builder
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="secondary" className="w-full">Começar com Base</Button>
                        </CardFooter>
                    </Card>

                    {/* Premium Plan Card Highlighted */}
                    <Card className="bg-[#1A2B4F] border-orange-500/30 glow-orange text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase">
                            Melhor escolha
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl text-white">ULTRA PREMIUM</CardTitle>
                            <p className="text-2xl font-bold text-white mt-2">R$ 5.500</p>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center gap-2 text-sm text-gray-200">
                                    <Check className="w-4 h-4 text-orange-500" /> Tudo do Base +
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-200">
                                    <Check className="w-4 h-4 text-orange-500" /> Optimizer Agent Ilimitado
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-200">
                                    <Check className="w-4 h-4 text-orange-500" /> +15 Prompts Exclusivos
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button size="lg" className="w-full">Garantir Premium</Button>
                        </CardFooter>
                    </Card>

                </div>
            </div>
        </section>
    )
}
