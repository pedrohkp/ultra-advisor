'use client';

import { useState } from 'react';
import { Zap, Copy, Check, Loader2, ExternalLink } from 'lucide-react';
import './optimizer.css';

interface PromptOptimizerProps {
    promptTitle: string;
    promptTemplate: string;
}

export function PromptOptimizer({ promptTitle, promptTemplate }: PromptOptimizerProps) {
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [finalPrompt, setFinalPrompt] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOptimize = async () => {
        if (!userInput.trim()) return;

        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setFinalPrompt(null);

        try {
            const res = await fetch('/api/optimizer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userInput: userInput.trim(),
                    promptTitle,
                    promptTemplate
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Erro ao processar otimização.');
            }

            const analysisText = data.analysis;
            setAnalysis(analysisText);

            const concatenated = `[INSTRUÇÕES DO SISTEMA]
${promptTemplate}

---
[CENÁRIO E PREMISSAS DO USUÁRIO]
${analysisText}

---
[COMANDO DE EXECUÇÃO]
Aja rigorosamente de acordo com as [INSTRUÇÕES DO SISTEMA].
Faça a sua análise e entregue o resultado baseando-se exclusivamente na realidade detalhada na seção [CENÁRIO E PREMISSAS DO USUÁRIO].
Não faça perguntas adicionais. Inicie a sua resposta imediatamente utilizando a formatação exigida nas instruções.`;

            setFinalPrompt(concatenated);

        } catch (err: any) {
            setError(err.message || 'Erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!finalPrompt) return;
        try {
            await navigator.clipboard.writeText(finalPrompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = finalPrompt;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    let optimizerState: 'idle' | 'loading' | 'done' = 'idle';
    if (isLoading) optimizerState = 'loading';
    else if (finalPrompt) optimizerState = 'done';

    return (
        <div className="optimizer-container">
            <div className="optimizer-accent-line" />

            {/* Progress Indicator */}
            {optimizerState === 'idle' && (
                <div className="flex items-center gap-2 text-xs text-white/50 mb-6">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    Descreva sua situação abaixo
                </div>
            )}
            {optimizerState === 'loading' && (
                <div className="flex items-center gap-2 text-xs text-orange-400 mb-6">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                    ULTRA está processando sua entrada...
                </div>
            )}
            {optimizerState === 'done' && (
                <div className="flex items-center gap-2 text-xs text-orange-400 mb-6">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    ✓ Prompt pronto — copie e leve para sua IA
                </div>
            )}

            {/* Header */}
            <div className="optimizer-header">
                <h3 className="optimizer-title">
                    <Zap size={20} />
                    Otimizar Agora
                </h3>
                <p className="optimizer-subtitle">
                    Seu prompt turbinado — extraindo o máximo do seu Ultra Advisor
                </p>
            </div>

            {/* Input + Button */}
            {!finalPrompt && (
                <>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 mb-4">
                        <span className="text-[#3B82F6] text-lg mt-0.5">ℹ️</span>
                        <p className="text-xs text-blue-100/80 leading-relaxed m-0">
                            <strong>O que fazer aqui?</strong> Descreva sua ideia ou rascunho de forma simples. Nossa IA não responderá à sua dúvida aqui, mas vai transformar seu rascunho em um <strong>Prompt de Alta Performance</strong>, pronto para ser copiado e colado no ChatGPT ou Claude.
                        </p>
                    </div>

                    <div className="optimizer-input-row">
                        <div className="optimizer-textarea-wrapper">
                            <textarea
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Descreva seu cenário, problema ou ideia que deseja analisar com este framework..."
                                rows={4}
                                disabled={isLoading}
                                className="optimizer-textarea"
                            />
                        </div>
                        <button
                            onClick={handleOptimize}
                            disabled={isLoading || !userInput.trim()}
                            className={`optimizer-btn ${isLoading ? 'loading' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="spinner" />
                                    <span className="loading-text">Analisando...</span>
                                </>
                            ) : (
                                <>
                                    <Zap size={20} />
                                    <span>Otimizar</span>
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}

            {/* Error */}
            {error && (
                <div className="optimizer-error">
                    ⚠️ {error}
                </div>
            )}

            {/* Result */}
            {finalPrompt && (
                <div className="optimizer-result">

                    {/* NOVO — label "Prompt Enriquecido" */}
                    <div className="mb-3">
                        <span className="block text-xs font-semibold uppercase tracking-widest text-amber-400">
                            ⚡ Prompt Enriquecido — Pronto para copiar
                        </span>
                        <span className="block text-xs text-white/40 mt-1">
                            • Este não é o resultado final. É o comando que você levará à sua IA.
                        </span>
                    </div>

                    {/* NOVO — banner explicativo */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-[#F59E0B]/5 border border-[#F59E0B]/20 mb-4">
                        <span className="text-[#F59E0B] text-lg">💡</span>
                        <p className="text-xs text-white/60 leading-relaxed m-0">
                            O ULTRA analisou sua entrada e construiu um prompt estratégico completo.
                            <span className="text-white/90 font-medium"> Copie o bloco abaixo e cole no ChatGPT, Claude ou outra IA de sua preferência.</span>
                            A resposta que você busca virá de lá — não desta tela.
                        </p>
                    </div>

                    {/* Final prompt block */}
                    <div className="optimizer-prompt-block">
                        <pre>{finalPrompt}</pre>
                    </div>

                    {/* Actions */}
                    <div className="optimizer-actions">
                        <button
                            onClick={handleCopy}
                            className={`optimizer-copy-btn ${copied ? 'copied' : ''}`}
                        >
                            {copied ? (
                                <><Check size={18} /> Copiado!</>
                            ) : (
                                <div className="flex items-center justify-center gap-2"><Copy size={18} /> <span>Copiar e levar para sua IA</span> <ExternalLink size={16} /></div>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setFinalPrompt(null);
                                setAnalysis(null);
                                setUserInput('');
                            }}
                            className="optimizer-reset-btn"
                        >
                            Nova consulta
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
