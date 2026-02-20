import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0A1628]">
            <SignIn appearance={{
                elements: {
                    rootBox: "mx-auto",
                    card: "bg-[#0F1F3D] border border-white/10",
                    headerTitle: "text-white",
                    headerSubtitle: "text-gray-400",
                    socialButtonsBlockButton: "bg-[#1A2B4F] border-white/10 text-white hover:bg-[#1A2B4F]/80",
                    formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
                    footerActionLink: "text-blue-400 hover:text-blue-300",
                    formFieldLabel: "text-gray-300",
                    formFieldInput: "bg-[#0A1628] border-white/10 text-white",
                    footerAction: "hidden", // Esconde a frase "Don't have an account? Sign up"
                }
            }} />
        </div>
    );
}
