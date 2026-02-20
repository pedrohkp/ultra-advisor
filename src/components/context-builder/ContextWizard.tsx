"use client";

import { useState, useMemo } from "react";
import { Building2, Target, Check, ArrowRight, ArrowLeft, Download, FileText, Lightbulb } from "lucide-react";
import { jsPDF } from "jspdf";

// --- Data Model ---

interface ContextFormData {
    sector: string;
    businessModel: string;
    audience: string;
    products: string;
    goals: string;
    channels: string;
    painPoints: string;
    sectorVices: string;
}

const initialData: ContextFormData = {
    sector: "",
    businessModel: "",
    audience: "",
    products: "",
    goals: "",
    channels: "",
    painPoints: "",
    sectorVices: "",
};

// --- Field Definitions ---

interface FieldDef {
    key: keyof ContextFormData;
    label: string;
    hint: string;
    placeholder: string;
    type: "input" | "textarea";
    pdfTitle: string;
}

const FIELDS: FieldDef[] = [
    {
        key: "sector",
        label: "Setor de Atuação",
        hint: "Em que mercado ou indústria o seu negócio opera?",
        placeholder: "Ex.: SaaS B2B, E-commerce de moda, Consultoria financeira, Clínica odontológica",
        type: "input",
        pdfTitle: "Setor de Atuação",
    },
    {
        key: "businessModel",
        label: "Modelo de Negócio",
        hint: "Como o seu negócio funciona? Qual o modelo de receita, quem são os clientes diretos e qual a proposta central?",
        placeholder: "Ex.: Plataforma de assinaturas mensais para gestão de estoque, atendendo varejistas de médio porte no Sudeste. Receita recorrente (MRR) com 3 faixas de preço.",
        type: "textarea",
        pdfTitle: "Modelo de Negócio",
    },
    {
        key: "audience",
        label: "Público-Alvo",
        hint: "Quem é o seu cliente ideal? Cargo, perfil, tamanho de empresa, dor principal.",
        placeholder: "Ex.: Donos de e-commerce com faturamento entre R$ 50k–500k/mês que precisam automatizar logística e não têm equipe de TI dedicada.",
        type: "textarea",
        pdfTitle: "Público-Alvo",
    },
    {
        key: "products",
        label: "Produtos / Serviços",
        hint: "O que você vende? Descreva seus principais produtos, planos ou serviços.",
        placeholder: "Ex.: 3 planos (Starter, Pro, Enterprise). Starter: gestão básica de estoque. Pro: + integrações com marketplaces. Enterprise: + API dedicada e suporte prioritário.",
        type: "textarea",
        pdfTitle: "Produtos e Serviços",
    },
    {
        key: "goals",
        label: "Metas e Objetivos",
        hint: "Quais as metas concretas para os próximos 6–12 meses? Pense em números, marcos, prazos.",
        placeholder: "Ex.: Atingir 500 clientes ativos em 12 meses; Reduzir churn de 8% para 4%; Lançar módulo de relatórios até Q3; Aumentar ticket médio em 20%.",
        type: "textarea",
        pdfTitle: "Metas e Objetivos",
    },
    {
        key: "channels",
        label: "Canais de Aquisição",
        hint: "Por onde seus clientes chegam até você? Quais os canais de marketing e vendas ativos?",
        placeholder: "Ex.: Google Ads (principal), LinkedIn orgânico, parcerias com contadores, indicação de clientes atuais, webinars mensais.",
        type: "textarea",
        pdfTitle: "Canais de Aquisição",
    },
    {
        key: "painPoints",
        label: "Dores do Cliente",
        hint: "Quais os problemas reais que seus clientes enfrentam antes de te encontrar?",
        placeholder: "Ex.: Perdem tempo com planilhas manuais; Não sabem o estoque real em tempo real; Sofrem com rupturas sem aviso; Dificuldade em integrar com marketplaces.",
        type: "textarea",
        pdfTitle: "Dores do Cliente",
    },
    {
        key: "sectorVices",
        label: "Vícios e Padrões do Setor",
        hint: "Que práticas ruins, costumes ultrapassados ou padrões ineficientes são comuns no seu setor ou dentro da sua empresa?",
        placeholder: "Ex.: Gestores ainda dependem de planilhas manuais; Decisões baseadas em achismo e não em dados; Resistência a ferramentas novas; Processos duplicados entre departamentos; Falta de padronização no atendimento.",
        type: "textarea",
        pdfTitle: "Vícios e Padrões do Setor",
    },
];

// Fields per step
const STEP_1_FIELDS = FIELDS.filter(f => ["sector", "businessModel", "audience", "products"].includes(f.key));
const STEP_2_FIELDS = FIELDS.filter(f => ["goals", "channels", "painPoints", "sectorVices"].includes(f.key));

// --- Steps ---

const steps = [
    { id: 1, label: "Seu Negócio", icon: Building2 },
    { id: 2, label: "Estratégia", icon: Target },
    { id: 3, label: "Revisão & Download", icon: Download },
];

// --- Component ---

export function ContextWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<ContextFormData>(initialData);

    const updateField = (key: keyof ContextFormData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    // Only fields with content
    const filledFields = useMemo(() => {
        return FIELDS.filter(f => formData[f.key].trim() !== "");
    }, [formData]);

    const hasAnyContent = filledFields.length > 0;

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // --- PDF Generation ---
    const generatePDF = () => {
        if (!hasAnyContent) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const contentWidth = pageWidth - margin * 2;
        let y = 20;

        const checkPageBreak = (needed: number) => {
            if (y + needed > doc.internal.pageSize.getHeight() - 20) {
                doc.addPage();
                y = 20;
            }
        };

        // Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(20, 20, 20);
        doc.text("Contexto Estratégico do Negócio", margin, y);
        y += 10;

        // Date
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`, margin, y);
        y += 8;

        // Divider
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 12;

        // Sections — only filled ones
        for (const field of filledFields) {
            const value = formData[field.key].trim();

            checkPageBreak(30);

            // Section title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(30, 30, 30);
            doc.text(field.pdfTitle, margin, y);
            y += 8;

            // Section content — split into bullet points by line breaks or semicolons
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(50, 50, 50);

            // Split value into items (by newlines or semicolons)
            const items = value
                .split(/[\n;]+/)
                .map(s => s.trim())
                .filter(s => s.length > 0);

            if (items.length === 1) {
                // Single paragraph — wrap text
                const lines = doc.splitTextToSize(items[0], contentWidth);
                checkPageBreak(lines.length * 6);
                doc.text(lines, margin, y);
                y += lines.length * 6;
            } else {
                // Multiple items — render as bullet list
                for (const item of items) {
                    const bulletText = `• ${item}`;
                    const lines = doc.splitTextToSize(bulletText, contentWidth - 4);
                    checkPageBreak(lines.length * 6);
                    doc.text(lines, margin + 2, y);
                    y += lines.length * 6 + 2;
                }
            }

            y += 8; // gap between sections
        }

        // Footer line
        checkPageBreak(20);
        y += 4;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text("Gerado por Ultra Advisor — ultraadvisor.com.br", margin, y);

        // Save
        const fileName = formData.sector.trim()
            ? `${formData.sector.replace(/[^a-z0-9áàâãéèêíïóôõöúüç\s]/gi, '').replace(/\s+/g, '_').toLowerCase()}_contexto.pdf`
            : "contexto_estrategico.pdf";
        doc.save(fileName);
    };

    // --- Render Field ---
    const renderField = (field: FieldDef) => (
        <div key={field.key} className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-200">
                {field.label}
                <span className="text-gray-500 ml-1 text-xs font-normal">(opcional)</span>
            </label>
            <p className="text-xs text-gray-500 flex items-start gap-1.5">
                <Lightbulb size={12} className="mt-0.5 shrink-0 text-yellow-500/60" />
                {field.hint}
            </p>
            {field.type === "input" ? (
                <input
                    type="text"
                    value={formData[field.key]}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-[#0A1628] border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                />
            ) : (
                <textarea
                    value={formData[field.key]}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    rows={3}
                    placeholder={field.placeholder}
                    className="w-full bg-[#0A1628] border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600 resize-none"
                />
            )}
        </div>
    );

    // --- Render Step Content ---
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {STEP_1_FIELDS.map(renderField)}
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {STEP_2_FIELDS.map(renderField)}
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {hasAnyContent ? (
                            <>
                                <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-6 space-y-5">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <Check size={20} className="text-blue-500" />
                                        Resumo do seu Contexto
                                    </h3>
                                    <dl className="space-y-4">
                                        {filledFields.map(field => (
                                            <div key={field.key}>
                                                <dt className="text-sm font-medium text-gray-400">{field.pdfTitle}</dt>
                                                <dd className="mt-1 text-sm text-white whitespace-pre-line">{formData[field.key]}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>

                                <div className="flex flex-col items-center gap-4 pt-2">
                                    <button
                                        onClick={generatePDF}
                                        className="bg-green-600 hover:bg-green-500 text-white px-10 py-3 rounded-lg font-bold transition-all transform hover:scale-[1.03] shadow-lg shadow-green-900/30 flex items-center gap-2"
                                    >
                                        <Download size={20} />
                                        Gerar PDF
                                    </button>
                                    <p className="text-gray-500 text-sm text-center max-w-md">
                                        O PDF será baixado com apenas os campos que você preencheu, formatado em tópicos e bullets.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <FileText size={48} className="mx-auto text-gray-600 mb-4" />
                                <h3 className="text-lg font-medium text-gray-400">Nenhum campo preenchido</h3>
                                <p className="text-sm text-gray-500 mt-2">
                                    Volte aos passos anteriores e preencha pelo menos um campo para gerar o PDF.
                                </p>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Sidebar / Progress Steps */}
            <div className="lg:col-span-3 space-y-4">
                <div className="bg-[#0F1F3D] border border-white/10 rounded-xl p-4 sticky top-6">
                    <nav className="space-y-1">
                        {steps.map((step) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={step.id}
                                    className={`w-full flex items-center justify-between p-2 rounded-lg text-sm font-medium transition-colors ${currentStep === step.id
                                        ? 'bg-blue-600/20 text-blue-400'
                                        : currentStep > step.id
                                            ? 'text-green-500'
                                            : 'text-gray-500'
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs box-border border ${currentStep === step.id
                                            ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                                            : currentStep > step.id
                                                ? 'border-green-500 bg-green-500/20 text-green-500'
                                                : 'border-gray-700 bg-gray-800 text-gray-500'
                                            }`}>
                                            {currentStep > step.id ? <Check size={12} /> : step.id}
                                        </span>
                                        {step.label}
                                    </span>
                                    {currentStep > step.id && <Check size={14} />}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Field completion indicator */}
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-xs text-gray-500 mb-2">Campos preenchidos</p>
                        <div className="flex gap-1">
                            {FIELDS.map(f => (
                                <div
                                    key={f.key}
                                    className={`h-1.5 flex-1 rounded-full transition-colors ${formData[f.key].trim() ? 'bg-blue-500' : 'bg-gray-700'
                                        }`}
                                    title={f.label}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-gray-600 mt-1.5">{filledFields.length} de {FIELDS.length}</p>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="lg:col-span-9">
                <div className="bg-[#0F1F3D] border border-white/10 rounded-xl p-8 min-h-[500px] flex flex-col">

                    {/* Header */}
                    <div className="mb-8 border-b border-white/5 pb-4">
                        <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                            {(() => {
                                const StepIcon = steps[currentStep - 1].icon;
                                return <StepIcon className="text-blue-500" />;
                            })()}
                            Passo {currentStep}: {steps[currentStep - 1].label}
                        </h2>
                        {currentStep < 3 && (
                            <p className="text-sm text-gray-500 mt-2">
                                Todos os campos são opcionais — preencha apenas o que for relevante.
                            </p>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {renderStepContent()}
                    </div>

                    {/* Navigation */}
                    {currentStep <= 3 && (
                        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                className={`px-6 py-2.5 flex items-center gap-2 font-medium transition-colors ${currentStep === 1
                                    ? 'text-gray-600 cursor-not-allowed'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <ArrowLeft size={16} /> Voltar
                            </button>

                            {currentStep < 3 && (
                                <button
                                    onClick={handleNext}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-900/20 flex items-center gap-2"
                                >
                                    Próximo Passo <ArrowRight size={16} />
                                </button>
                            )}
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
}
