"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard, Users, Map as MapIcon, LogOut, BookOpen,
    ExternalLink, Menu, X, LayoutGrid, MessageSquare,
    ShieldCheck, BarChart3, Settings, ClipboardList, HardDrive
} from "lucide-react";
import { logoutAdmin } from "@/app/actions/auth-admin";
import Image from "next/image";

const navigation = [
    { name: "Painel de Controle", href: "/admin", icon: LayoutDashboard },
    { name: "Base de Candidatos", href: "/admin/candidates", icon: Users },
    { name: "Jornada do Candidato (Kanban)", href: "/admin/kanban", icon: LayoutGrid },
    { name: "Trilha de Auditoria", href: "/admin/audit", icon: ClipboardList },
    { name: "Gestão de Usuários", href: "/admin/users", icon: ShieldCheck },
    { name: "Configurações", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950 flex items-center justify-between px-4 z-40 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8">
                        <Image src="/logo-education.png" alt="Logo" fill className="object-contain" />
                    </div>
                </div>
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="text-white p-2 hover:bg-slate-800 rounded-md"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out
                lg:translate-x-0 lg:static lg:h-screen lg:shrink-0
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex h-16 shrink-0 items-center justify-between px-6 bg-slate-950">
                    <div className="flex items-center gap-3">
                        <div className="relative h-8 w-8">
                            <Image src="/logo-education.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <span className="text-white font-bold text-lg font-serif">Admin</span>
                    </div>
                    {/* Close Button Mobile */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex flex-1 flex-col px-6 py-8 gap-y-8 overflow-y-auto">
                    <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={`
                    group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors
                    ${isActive
                                                ? 'bg-amber-600 text-white shadow-lg'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800'}
                  `}
                                    >
                                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="mt-auto space-y-4">
                        <Link
                            href="/"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-400 hover:bg-slate-800 hover:text-white w-full transition-colors"
                        >
                            <ExternalLink className="h-6 w-6 shrink-0" aria-hidden="true" />
                            Ir para o site
                        </Link>

                        <button
                            onClick={async () => {
                                const { createClient } = await import("@/utils/supabase/client");
                                const supabase = createClient();
                                await supabase.auth.signOut();
                                window.location.href = "/admin/login";
                            }}
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-400 hover:bg-red-900/30 hover:text-red-400 w-full text-left transition-colors border border-transparent hover:border-red-900/50"
                        >
                            <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
                            Sair
                        </button>
                    </div>
                </nav>
            </div>
        </>
    );
}
