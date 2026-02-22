import { create } from 'zustand';

interface Suggestion {
    slug: string;
    title: string;
    reason: string;
}

interface PromptFinderState {
    query: string;
    suggestions: Suggestion[] | null;
    setQuery: (query: string) => void;
    setSuggestions: (suggestions: Suggestion[] | null) => void;
    reset: () => void;
}

export const usePromptFinderStore = create<PromptFinderState>((set) => ({
    query: "",
    suggestions: null,
    setQuery: (query) => set({ query }),
    setSuggestions: (suggestions) => set({ suggestions }),
    reset: () => set({ query: "", suggestions: null }),
}));
