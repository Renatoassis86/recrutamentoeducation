"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, User as UserIcon, LogOut } from "lucide-react";
import Image from "next/image";
import { User } from "@supabase/supabase-js";

interface LandingNavProps {
    user?: User | null;
}

export default function LandingNav({ user }: LandingNavProps) {
    const [isOpen, setIsOpen] = useState(false);

    const navigation = [
        { name: "Institucional", href: "/about" },
        { name: "Currículo Paideia", href: "/#paideia" },
        { name: "Chamada Editorial", href: "/chamada" },
        { name: "Termo de Referência", href: "/termo" },
        { name: "Contato", href: "/#contato" },
    ];

    // Helper to get first and last name
    const getUserName = () => {
        if (!user) return "";
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "";
        if (fullName) {
            const names = fullName.split(" ");
            if (names.length > 1) {
                return `${names[0]} ${names[names.length - 1]}`;
            }
            return names[0];
        }
        return user.email?.split("@")[0] || "";
    };

    return (
        <nav className="bg-slate-900 fixed w-full z-50 top-0 start-0 border-b border-gray-800">
            <div className="w-full flex flex-wrap items-center justify-between mx-auto px-4 md:px-8 py-4">
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="relative h-12 w-48">
                        <Image
                            src="/logo-education.png"
                            alt="Cidade Viva Education"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </Link>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-4 items-center">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-300 hidden sm:block font-medium">
                                {getUserName()}
                            </span>
                            <form action="/auth/signout" method="post">
                                <button type="submit" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                    <LogOut className="w-4 h-4" />
                                    Sair
                                </button>
                            </form>
                            <Link href="/dashboard">
                                <button type="button" className="text-slate-900 bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:outline-none focus:ring-amber-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center transition-transform hover:scale-105 flex items-center gap-2">
                                    <UserIcon className="w-4 h-4" />
                                    Minha Inscrição
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="hidden sm:block">
                                <button type="button" className="text-white hover:text-amber-500 font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors">
                                    Entrar
                                </button>
                            </Link>
                            <Link href="/application">
                                <button type="button" className="text-slate-900 bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:outline-none focus:ring-amber-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center transition-transform hover:scale-105">
                                    Inscreva-se
                                </button>
                            </Link>
                        </>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        aria-controls="navbar-sticky"
                        aria-expanded={isOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
                <div
                    className={`${isOpen ? "block" : "hidden"
                        } items-center justify-between w-full md:flex md:w-auto md:order-1 md:mx-auto`}
                    id="navbar-sticky"
                >
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-6 lg:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
                        {navigation.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className="block py-2 px-3 text-slate-700 md:text-white rounded hover:bg-gray-200 md:hover:bg-transparent md:hover:text-amber-500 md:p-0 transition-colors text-sm uppercase tracking-wide font-semibold"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
