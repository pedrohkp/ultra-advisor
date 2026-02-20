import { currentUser } from "@clerk/nextjs/server";
import { Zap } from "lucide-react";
import { ContextWizard } from "@/components/context-builder/ContextWizard";

export default async function ContextBuilderPage() {
    const user = await currentUser();

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-blue-400 font-medium uppercase tracking-wider">
                    <Zap size={16} />
                    <span>Ferramenta de Criação</span>
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                    Context Builder
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Preencha as informações do seu negócio e baixe um PDF estruturado para alimentar suas conversas com IA.
                </p>
            </div>

            {/* Main Wizard Area */}
            <ContextWizard />
        </div>
    );
}
