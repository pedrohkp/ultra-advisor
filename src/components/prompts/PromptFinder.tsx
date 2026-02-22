"use client";

import { useState } from "react";
import { Search, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { usePromptFinderStore } from "@/store/prompt-finder-store";

export function PromptFinder() {
    const { query, setQuery, suggestions, setSuggestions, reset } = usePromptFinderStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        setSuggestions(null);

        try {
            const res = await fetch("/api/prompt-finder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: query.trim() }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || "Erro ao buscar recomendações.");
            }

            setSuggestions(data.prompts);

        } catch (err: any) {
            setError(err.message || "Erro desconhecido de IA.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex justify-center py-6">
            <div className="w-full max-w-2xl text-center space-y-8 animate-in fade-in duration-500">

                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-2">
                        <Sparkles size={16} />
                        Prompt Finder (IA)
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">
                        Não sabe qual framework usar?
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Descreva seu objetivo, projeto ou dor abaixo e nossa IA vai recomendar os melhores matchings da biblioteca para você.
                    </p>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-orange-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative flex flex-col sm:flex-row bg-[#0A1628] rounded-xl border border-white/10 p-2 shadow-2xl focus-within:border-blue-500/50 transition-colors">
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSearch();
                                }
                            }}
                            disabled={isLoading}
                            placeholder="Ex: Preciso de ideias para reter clientes que estão cancelando, qual prompt me ajuda a mapear o problema?"
                            className="bg-transparent text-white placeholder:text-gray-500 px-4 py-3 w-full outline-none resize-none min-h-[50px] sm:min-h-[60px]"
                            rows={2}
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isLoading || !query.trim()}
                            className={`mt-2 sm:mt-0 sm:ml-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shrink-0 ${isLoading ? 'cursor-not-allowed opacity-80' : 'transform hover:scale-[1.02] shadow-lg shadow-blue-900/30'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> Procurando
                                </>
                            ) : (
                                <>
                                    <Search size={18} /> Recomendar
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-left">
                        <AlertCircle size={20} className="shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {suggestions && (
                    <div className="text-left pt-6 border-t border-white/5 animate-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Sparkles className="text-orange-500" /> Matches Encontrados ({suggestions.length})
                        </h3>
                        <SuggestedPrompts suggestions={suggestions} />

                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={reset}
                                className="text-sm text-gray-500 hover:text-white transition-colors"
                            >
                                Fazer nova busca
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
