import { Badge } from "@/components/ui/badge"
import { Bot, MessageSquare, BarChart3, CreditCard, Calendar } from "lucide-react"

const automations = [
    { icon: MessageSquare, title: "Captura de Lead", desc: "WhatsApp → CRM" },
    { icon: Bot, title: "Follow-up Automático", desc: "Cadência multi-etapa" },
    { icon: BarChart3, title: "Relatórios Automáticos", desc: "Extração + Envio" },
    { icon: CreditCard, title: "Cobrança Recorrente", desc: "Integração pagamento" },
    { icon: Calendar, title: "Agendamento + Confirmação", desc: "Google Calendar + WhatsApp" },
]

export function SectionAutomations() {
    return (
        <section className="py-24 bg-[#0A1628] relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-16 relative z-20">
                    <Badge className="bg-orange-500/20 text-orange-500 hover:bg-orange-500/30 mb-4 px-4 py-1">
                        EM BREVE
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Automações <span className="text-gray-500">Inteligentes</span>
                    </h2>
                </div>

                {/* Blurred Content Container */}
                <div className="relative">
                    {/* Overlay with Lock/Blur */}
                    <div className="absolute inset-0 bg-[#0A1628]/60 backdrop-blur-[6px] z-20 flex items-center justify-center border border-white/5 rounded-2xl">
                        <div className="bg-[#0F1F3D] border border-blue-500/20 px-8 py-4 rounded-full shadow-2xl flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-gray-200 font-medium">Em desenvolvimento</span>
                        </div>
                    </div>

                    {/* Grid Content (Blurred via Overlay) */}
                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 opacity-50 grayscale-[0.5]">
                        {automations.map((item, index) => (
                            <div key={index} className="bg-[#1A2B4F] border border-white/5 p-6 rounded-xl flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-lg bg-blue-900/20 flex items-center justify-center mb-4 text-blue-400">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}
