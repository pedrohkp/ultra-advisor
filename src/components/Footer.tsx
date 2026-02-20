import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-[#0A1628] py-8 mt-20">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500">
                    © 2026 ULTRA ADVISOR. Todos os direitos reservados.
                </p>
                <div className="flex gap-6">
                    <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                        Termos de Uso
                    </Link>
                    <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                        Política de Privacidade
                    </Link>
                    <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                        Contato
                    </Link>
                </div>
            </div>
        </footer>
    )
}
