"use client"

import { jornadas } from "@/data/jornadas"
import Link from "next/link"
import * as Icons from "lucide-react"

export default function JornadasHubPage() {
    return (
        <div className="flex-1 w-full flex flex-col min-h-screen bg-dashboard-dark">
            {/* Header section matching Prompts page style */}
            <div className="border-b border-white/5 bg-dashboard-card/50 px-8 py-8 flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <Icons.Map className="w-8 h-8 text-orange-500" />
                    Jornadas
                </h1>
                <p className="text-white/60 text-lg max-w-2xl">
                    Rotas guiadas com sequências de prompts selecionados para resolver os desafios mais complexos do seu negócio.
                </p>
            </div>

            {/* Content Section */}
            <div className="p-8 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jornadas.map((jornada) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const IconComponent = (Icons as any)[jornada.icon] || Icons.Map;

                        return (
                            <Link
                                href={`/jornadas/${jornada.id}`}
                                key={jornada.id}
                                className="group bg-dashboard-card border border-white/10 rounded-xl p-6 hover:border-orange-500/50 hover:bg-white/[0.03] transition-all flex flex-col h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/20 group-hover:via-orange-500/40 group-hover:to-orange-500/20 transition-all"></div>

                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-300">
                                        <IconComponent className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/10 flex items-center gap-1.5">
                                        <Icons.ListOrdered className="w-3.5 h-3.5" />
                                        {jornada.steps.length} passos
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                                    {jornada.title}
                                </h3>

                                <p className="text-white/60 text-sm leading-relaxed flex-grow">
                                    {jornada.description}
                                </p>

                                <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-sm font-medium text-orange-500 group-hover:text-orange-400 transition-colors">
                                    Começar jornada
                                    <Icons.ArrowRight className="w-4 h-4 ml-2 max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
