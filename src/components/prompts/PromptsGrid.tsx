'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Lock, Play, BarChart3, Target, Brain, CheckCircle, Zap, MessageSquare, Rocket } from 'lucide-react';
import { PromptFinder } from './PromptFinder';

// Purpose category icons and colors
const PURPOSE_CONFIG: Record<string, { icon: any; color: string }> = {
    'Análise de Mercado': { icon: BarChart3, color: '#3B82F6' },
    'Estratégia e Posicionamento': { icon: Target, color: '#8B5CF6' },
    'Pensamento Crítico': { icon: Brain, color: '#EC4899' },
    'Decisões Estratégicas': { icon: CheckCircle, color: '#10B981' },
    'Execução e Operação': { icon: Zap, color: '#F59E0B' },
    'Comunicação e Conteúdo': { icon: MessageSquare, color: '#06B6D4' },
    'Crescimento e Aprendizado': { icon: Rocket, color: '#EF4444' },
};



interface Prompt {
    id: number;
    title: string;
    slug: string;
    category_situation: string;
    category_niche: string;
    is_premium: boolean;
    description_short: string;
    created_at?: string;
}

type SortOption = 'popular' | 'newest' | 'alphabetical';

export default function PromptsGrid({ prompts, hasAccess, fromJourney, preserveOrder }: { prompts: Prompt[], hasAccess: boolean, fromJourney?: string, preserveOrder?: boolean }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>('popular');

    // Get unique purpose categories from data
    const purposes = useMemo(() => {
        const set = new Set(prompts.map(p => p.category_situation));
        return Array.from(set).sort();
    }, [prompts]);



    // Filter prompts
    const filteredPrompts = useMemo(() => {
        return prompts.filter(p => {
            // Search filter
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                if (!p.title.toLowerCase().includes(q) &&
                    !p.description_short?.toLowerCase().includes(q)) {
                    return false;
                }
            }
            // Purpose filter
            if (selectedPurpose && p.category_situation !== selectedPurpose) {
                return false;
            }

            return true;
        });
    }, [prompts, searchQuery, selectedPurpose]);

    // Sort prompts
    const sortedPrompts = useMemo(() => {
        if (preserveOrder) return filteredPrompts;

        const result = [...filteredPrompts];
        switch (sortBy) {
            case 'newest':
                return result.sort((a, b) => {
                    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                    if (dateA === dateB) return b.id - a.id;
                    return dateB - dateA;
                });
            case 'alphabetical':
                return result.sort((a, b) => a.title.localeCompare(b.title));
            case 'popular':
            default:
                return result.sort((a, b) => a.id - b.id);
        }
    }, [filteredPrompts, sortBy]);

    return (
        <div>
            {/* AI Prompt Finder */}
            <div className="mb-12">
                <PromptFinder />
            </div>

            {/* Controls Section */}
            <div className="prompts-controls">
                {/* Search Bar */}
                <div className="prompts-search-bar">
                    <Search size={18} color="#9CA3AF" />
                    <input
                        type="text"
                        placeholder="Buscar prompts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="prompts-search-input"
                    />
                </div>

                {/* Sort Dropdown */}
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="sort-select"
                    aria-label="Ordenar prompts"
                >
                    <option value="popular">Mais Populares</option>
                    <option value="newest">Adicionadas Recentemente</option>
                    <option value="alphabetical">Ordem Alfabética</option>
                </select>
            </div>

            {/* Purpose Filter Pills */}
            <div className="filter-section">
                <span className="filter-label">Categoria:</span>
                <div className="filter-pills">
                    <button
                        className={`filter-pill ${!selectedPurpose ? 'filter-pill-active' : ''}`}
                        onClick={() => setSelectedPurpose(null)}
                    >
                        Todos
                    </button>
                    {purposes.map(purpose => {
                        const config = PURPOSE_CONFIG[purpose];
                        const Icon = config?.icon || BarChart3;
                        const isActive = selectedPurpose === purpose;
                        return (
                            <button
                                key={purpose}
                                className={`filter-pill ${isActive ? 'filter-pill-active' : ''}`}
                                onClick={() => setSelectedPurpose(isActive ? null : purpose)}
                                style={isActive ? {
                                    backgroundColor: config?.color + '22',
                                    borderColor: config?.color,
                                    color: config?.color
                                } : {}}
                            >
                                <Icon size={14} />
                                {purpose}
                            </button>
                        );
                    })}
                </div>
            </div>



            {/* Results count */}
            <div className="prompts-results-count">
                {sortedPrompts.length} de {prompts.length} prompts
            </div>

            {/* Prompts Grid */}
            {sortedPrompts.length > 0 ? (
                <div className="prompts-grid">
                    {sortedPrompts.map((prompt) => {
                        const config = PURPOSE_CONFIG[prompt.category_situation];
                        const Icon = config?.icon || BarChart3;
                        const color = config?.color || '#3B82F6';

                        // O prompt só é considerado bloqueado na UI se for premium E o usuário não tiver acesso
                        const isLockedUI = prompt.is_premium && !hasAccess;


                        return (
                            <Link
                                key={prompt.id}
                                href={fromJourney ? `/prompts/${prompt.slug || prompt.id}?fromJourney=${fromJourney}` : `/prompts/${prompt.slug || prompt.id}`}
                                className="prompt-card h-full flex flex-col"
                            >
                                {isLockedUI && (
                                    <div className="prompt-premium-badge">
                                        <Lock size={12} /> PREMIUM
                                    </div>
                                )}

                                <div className="prompt-card-content flex-1 flex flex-col">
                                    <div className="prompt-card-header">
                                        <span className="prompt-category-tag" style={{ color: color, borderColor: color, backgroundColor: `${color}1A` }}>
                                            <Icon size={14} />
                                            {prompt.category_situation}
                                        </span>
                                        <h3 className="prompt-card-title">
                                            {prompt.title}
                                        </h3>
                                    </div>

                                    <p className="prompt-card-description text-sm text-white/60 leading-relaxed flex-1">
                                        {prompt.description_short || "Sem descrição disponível."}
                                    </p>



                                    <div className="prompt-card-footer mt-auto pt-4">
                                        Abrir Prompt <Play size={16} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="prompts-empty-state">
                    <h3>Nenhum prompt encontrado 🔍</h3>
                    <p>Tente ajustar os filtros ou a busca.</p>
                </div>
            )}
        </div>
    );
}
