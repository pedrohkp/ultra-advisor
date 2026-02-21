import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import {
    Library,
    FileText,
    History
} from "lucide-react";
import { HowItWorks } from "@/components/dashboard/HowItWorks";
import { OnboardingTour } from "@/components/dashboard/OnboardingTour";
import "./dashboard.css";

export default async function DashboardPage() {
    const user = await currentUser();
    const firstName = user?.firstName || "Consultor";

    const cards = [
        {
            title: "Biblioteca de Prompts",
            description: "Acesse frameworks estratégicos prontos para uso.",
            icon: Library,
            href: "/prompts",
            color: "#3B82F6",
        },
        {
            title: "Context Builder",
            description: "Crie e gerencie contextos para personalizar suas IAs.",
            icon: FileText,
            href: "/context-builder",
            color: "#10B981",
        },
        {
            title: "Histórico",
            description: "Veja suas otimizações e prompts recentes.",
            icon: History,
            href: "/history",
            color: "#F59E0B",
            isComingSoon: true,
        },
    ];

    return (
        <div>
            <OnboardingTour />
            {/* Welcome Header */}
            <header className="dashboard-welcome">
                <h1>
                    Olá, <span>{firstName}</span>!
                </h1>
                <p>Escolha um prompt, leve para sua IA e aplique o resultado.</p>
            </header>

            {/* How It Works Section */}
            <HowItWorks />

            {/* Cards Grid */}
            <div className="dashboard-cards">
                {cards.map((card) => {
                    let cardId = undefined;
                    if (card.href === '/prompts') cardId = 'tour-prompts';
                    if (card.href === '/context-builder') cardId = 'tour-context';

                    return (
                        <div key={card.href} className="relative group">
                            <Link
                                href={card.isComingSoon ? "#" : card.href}
                                id={cardId}
                                className={`dashboard-card h-full ${card.isComingSoon ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
                                style={{ '--card-accent': card.color } as React.CSSProperties}
                            >
                                <div className="dashboard-card-header">
                                    <div
                                        className="dashboard-card-icon"
                                        style={{
                                            backgroundColor: `${card.color}20`,
                                            color: card.color
                                        }}
                                    >
                                        <card.icon size={24} />
                                    </div>
                                    <h2>{card.title}</h2>
                                </div>
                                <p>{card.description}</p>
                            </Link>

                            {card.isComingSoon && (
                                <div className="absolute inset-0 flex items-center justify-center p-4 z-10 pointer-events-none">
                                    <div className="bg-[#0F1F3D]/80 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/20 backdrop-blur-sm shadow-xl shadow-black/50">
                                        Em breve
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
