import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Brain } from "lucide-react"

export function SectionHero() {
    return (
        <section className="relative pt-20 pb-32 md:pt-32 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-orange-500/10 blur-[120px] rounded-full opacity-30 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">

                <Badge variant="glass" className="mb-6 px-4 py-1.5 text-sm gap-2 backdrop-blur-md">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span className="text-blue-400 font-medium">Biblioteca com 35+ frameworks validados</span>
                </Badge>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-5xl leading-tight">
                    Comandos de Elite validados que extraem o melhor da IA <br className="hidden md:block" /> em qualquer chat — por menos de 1% do custo de uma consultoria real.
                </h1>

                <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl leading-relaxed mx-auto">
                    Ultra Advisor usa Engenharia de Prompt de 2ª Geração — comandos estruturados e livres de viés que expõem o que você ainda não vê. O resultado: planos estratégicos prontos em minutos, decisões mais seguras e zero retrabalho.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link href="#planos">
                        <Button size="lg" className="px-8 text-base h-12 shadow-lg shadow-orange-500/20">
                            Desbloquear meus Comandos de Elite
                        </Button>
                    </Link>
                    <Link href="#biblioteca">
                        <Button variant="secondary" size="lg" className="px-8 text-base h-12">
                            <Brain className="w-5 h-5 mr-2" />
                            Explorar biblioteca
                        </Button>
                    </Link>
                </div>

                <div className="mt-8 flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span>Agora com <strong className="text-white">Agentes de I.A. Integrados</strong> (Prompt Finder & Agente Otimizador)</span>
                </div>

            </div>
        </section>
    )
}
