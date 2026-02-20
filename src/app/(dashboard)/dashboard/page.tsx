import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import {
    Library,
    FileText,
    History
} from "lucide-react";
import { HowItWorks } from "@/components/dashboard/HowItWorks";
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
        },
    ];

    return (
        <div>
            {/* Welcome Header */}
            <header className="dashboard-welcome">
                <h1>
                    Olá, <span>{firstName}</span>! 👋
                </h1>
                <p>Escolha um prompt, leve para sua IA e aplique o resultado.</p>
            </header>

            {/* How It Works Section */}
            <HowItWorks />

            {/* Cards Grid */}
            <div className="dashboard-cards">
                {cards.map((card) => (
                    <Link
                        key={card.href}
                        href={card.href}
                        className="dashboard-card"
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
                ))}
            </div>
        </div>
    );
}
