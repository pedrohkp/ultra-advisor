import { Zap } from "lucide-react";

export function ExpectationBanner() {
    return (
        <div className="bg-[#1e293b] border-l-4 border-orange-500 rounded-r-lg p-4 mb-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-start sm:items-center gap-3 relative z-10">
                <div className="bg-orange-500/10 p-2 rounded-full shrink-0">
                    <Zap className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-sm md:text-base text-gray-200 leading-relaxed font-medium">
                    O ULTRA ADVISOR não gera respostas automáticas — <span className="text-orange-400">ele entrega os comandos (prompts) perfeitamente estruturados</span> para que você extraia o máximo das IAs que já usa (ChatGPT, Claude, Gemini, etc).
                </p>
            </div>
        </div>
    );
}
