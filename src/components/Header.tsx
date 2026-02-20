import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0A1628]/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-white">
                        ULTRA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] to-[#EA580C]">ADVISOR</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="#planos" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Planos
                    </Link>
                    <Link href="#biblioteca" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Biblioteca
                    </Link>
                    <Link href="#faq" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        FAQ
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="#planos">
                        <Button>Começar agora</Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
