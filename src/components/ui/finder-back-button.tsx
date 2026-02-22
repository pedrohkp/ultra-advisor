"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function FinderBackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="prompt-detail-back mb-6 inline-flex items-center gap-1.5 border-none bg-transparent cursor-pointer p-0 hover:text-blue-400 transition-colors"
        >
            <ArrowLeft size={16} /> Voltar para Recomendações da IA
        </button>
    );
}
