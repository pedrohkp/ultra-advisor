import { BookOpen, CheckCircle, AlertTriangle, Zap } from "lucide-react";

export const metadata = {
    title: "Boas Práticas | Ultra Advisor",
    description: "Guia de boas práticas para extrair o máximo do Ultra Advisor.",
};

export default function BestPracticesPage() {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-blue-400 font-medium uppercase tracking-wider">
                    <BookOpen size={16} />
                    <span>Guia de Uso</span>
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                    Boas Práticas: O Padrão ULTRA
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Siga estas diretrizes para transformar IAs genéricas em verdadeiros consultores estratégicos usando nossos frameworks.
                </p>
            </div>

            {/* Main Content */}
            <div className="space-y-6">

                {/* DOs */}
                <div className="bg-[#0F1F3D] border border-green-500/20 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <CheckCircle className="text-green-500" /> O QUE FAZER (DOs)
                    </h2>
                    <ul className="space-y-6 text-gray-300">
                        <li className="flex items-start gap-3">
                            <span className="text-green-500 mt-1">•</span>
                            <div>
                                <strong className="text-white block mb-1">Sempre use o Context Builder primeiro.</strong>
                                A IA precisa conhecer o panorama e as métricas do seu negócio antes de receber um framework complexo. Sem contexto, a resposta será genérica.
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-500 mt-1">•</span>
                            <div>
                                <strong className="text-white block mb-1">Empilhe Frameworks.</strong>
                                Problemas complexos não são resolvidos com um único prompt. Combine-os em uma mesma conversa.
                                <br />
                                <span className="italic text-gray-400">Exemplo de Combo:</span> Use o <strong>Trend Report</strong> (para achar a oportunidade) → <strong>Validação da Demanda</strong> (para confirmar o mercado) → <strong>Go-to-Market</strong> (para definir a execução).
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-500 mt-1">•</span>
                            <div>
                                <strong className="text-white block mb-1">Use a IA adequada.</strong>
                                Cada modelo tem uma especialidade. Direcione seu prompt para a ferramenta certa:
                                <ul className="mt-3 space-y-2 ml-4">
                                    <li className="flex items-start gap-2">
                                        <span className="text-gray-500 mt-1">-</span>
                                        <span><strong className="text-white">Claude 4.5 Sonnet:</strong> Superior para análises profundas, nuances, empatia e escrita estratégica (copywriting).</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-gray-500 mt-1">-</span>
                                        <span><strong className="text-white">ChatGPT (GPT-4o):</strong> Excelente para raciocínio lógico rigoroso, estruturação de dados e tabelas.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-gray-500 mt-1">-</span>
                                        <span><strong className="text-white">Perplexity:</strong> A melhor escolha para pesquisa de mercado, tendências em tempo real e busca com fontes citadas.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-gray-500 mt-1">-</span>
                                        <span><strong className="text-white">NotebookLM (Google):</strong> Imbatível para cruzar dezenas de PDFs longos, relatórios extensos e atuar sobre uma base de conhecimento fechada.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-gray-500 mt-1">-</span>
                                        <span><strong className="text-white">Gemini (Advanced/Pro):</strong> Ideal para analisar volumes massivos de dados de uma só vez (janela de contexto gigante) e integrar com o ecossistema Google.</span>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* DONTs */}
                <div className="bg-[#0F1F3D] border border-red-500/20 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="text-red-500" /> O QUE EVITAR (DON'Ts)
                    </h2>
                    <ul className="space-y-6 text-gray-300">
                        <li className="flex items-start gap-3">
                            <span className="text-red-500 mt-1">•</span>
                            <div>
                                <strong className="text-white block mb-1">Não altere a estrutura do prompt.</strong>
                                Nossos comandos usam engenharia específica (colchetes, marcadores, seções). Copie e cole integralmente na sua IA sem quebrar a formatação lógica.
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-500 mt-1">•</span>
                            <div>
                                <strong className="text-white block mb-1">Não misture frameworks no mesmo envio.</strong>
                                Tentar rodar um "SWOT" e um "Go-to-Market" no mesmo <em>enter</em> confunde o modelo. Faça um de cada vez, seguindo a lógica de empilhamento.
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-500 mt-1">•</span>
                            <div>
                                <strong className="text-white block mb-1">Não aceite a primeira resposta se for rasa.</strong>
                                Se a IA for genérica ou concordar demais com você, force o contraditório. Responda apenas: <em>"Atue como um auditor rigoroso. Aponte 3 falhas críticas ou premissas perigosas nesta sua análise."</em>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Pro Tip */}
                <div className="bg-gradient-to-r from-orange-500/10 to-blue-500/10 border border-orange-500/20 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    <h2 className="text-lg font-bold text-orange-400 mb-2 flex items-center gap-2 relative z-10">
                        <Zap size={20} /> DICA DE OURO (PREMIUM)
                    </h2>
                    <p className="text-gray-300 relative z-10 leading-relaxed">
                        Ao invés de tentar adaptar um prompt manualmente, use a ferramenta <strong className="text-white">Otimizar Agora</strong> na barra lateral da página de cada prompt. O Agente do Ultra Advisor fará o trabalho de alinhar o seu cenário específico com a engenharia do framework em segundos.
                    </p>
                </div>

            </div>
        </div>
    );
}
