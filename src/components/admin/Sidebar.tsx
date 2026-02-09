"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Map as MapIcon, LogOut, BookOpen, ExternalLink } from "lucide-react";
import { logoutAdmin } from "@/app/actions/auth-admin";
import Image from "next/image";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Candidatos", href: "/admin/candidates", icon: Users },
    { name: "Usuários", href: "/admin/users", icon: Users },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-slate-900 border-r border-slate-800">
            <div className="flex h-16 shrink-0 items-center px-6 gap-3 bg-slate-950">
                <div className="relative h-8 w-8">
                    <Image src="/logo-education.png" alt="Logo" fill className="object-contain" />
                </div>
                <span className="text-white font-bold text-lg font-serif">Admin Panel</span>
            </div>

            <nav className="flex flex-1 flex-col px-6 py-8 gap-y-8">
                <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`
                    group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                    ${isActive
                                            ? 'bg-amber-600 text-white'
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

                <div className="mt-auto space-y-2">
                    <Link
                        href="/"
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-400 hover:bg-slate-800 hover:text-white w-full"
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
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-400 hover:bg-slate-800 hover:text-white w-full text-left"
                    >
                        <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
                        Sair
                    </button>
                </div>
            </nav>
        </div>
    );
}
