"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
    LayoutDashboard,
    Library,
    FileText,
    BookOpen,
    Menu,
    X
} from "lucide-react"
import Image from "next/image"
import { UserButton, useUser } from "@clerk/nextjs"

const menuItems = [
    { icon: LayoutDashboard, label: "Visão Geral", href: "/dashboard" },
    { icon: Library, label: "Biblioteca de Prompts", href: "/prompts" },
    { icon: FileText, label: "Context Builder", href: "/context-builder" },
    { icon: BookOpen, label: "Boas Práticas", href: "/boas-praticas" },
]

export function AppSidebar() {
    const pathname = usePathname()
    const { user } = useUser()
    const [mobileOpen, setMobileOpen] = useState(false)

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMobileOpen(false)
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="sidebar-hamburger"
                aria-label="Abrir menu"
            >
                <Menu size={22} />
            </button>

            {/* Overlay (mobile only) */}
            {mobileOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
                {/* Header */}
                <div className="sidebar-header">
                    <Link href="/dashboard" className="sidebar-logo">
                        <div className="sidebar-logo-icon bg-transparent">
                            <Image src="/logo.svg" alt="Ultra Advisor" width={24} height={24} className="min-w-6 min-h-6" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">
                            ULTRA ADVISOR
                        </span>
                    </Link>
                    {/* Close button (mobile only) */}
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="sidebar-close"
                        aria-label="Fechar menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all border border-transparent ${isActive
                                    ? 'border-orange-500/40 text-white bg-orange-500/10'
                                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-white/40'}`} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* User Footer */}
                <div className="sidebar-footer">
                    <div className="sidebar-user-card">
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "w-9 h-9 border border-white/10"
                                }
                            }}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {user?.fullName || "Usuário"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.primaryEmailAddress?.emailAddress}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
