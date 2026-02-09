"use client";

import Link from "next/link";
import { useState } from "react";
import { X, User as UserIcon, LogOut, Menu as MenuIcon } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
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
                    <div className="relative h-10 w-32 md:h-12 md:w-48 transition-all">
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
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <Menu.Button className="flex items-center gap-2 rounded-full bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 p-2 pr-4 transition-colors hover:bg-slate-700">
                                    <span className="sr-only">Open user menu</span>
                                    <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold">
                                        {getUserName().charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-gray-200 font-medium hidden sm:block">
                                        {getUserName()}
                                    </span>
                                </Menu.Button>
                            </div>
                            <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <Menu.Items>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href="/dashboard"
                                                className={`${active ? 'bg-gray-100' : ''
                                                    } flex items-center gap-2 px-4 py-2 text-sm text-gray-700 w-full`}
                                            >
                                                <UserIcon className="w-4 h-4" />
                                                Minha Inscrição
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={async () => {
                                                    const { createClient } = await import("@/utils/supabase/client");
                                                    const supabase = createClient();
                                                    await supabase.auth.signOut();
                                                    window.location.href = "/login";
                                                }}
                                                className={`${active ? 'bg-gray-100' : ''
                                                    } flex items-center gap-2 px-4 py-2 text-sm text-gray-700 w-full text-left`}
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sair
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </div>
                        </Menu>
                    ) : (
                        <>
                            <Link href="/login" className="hidden sm:block">
                                <button type="button" className="text-white hover:text-amber-500 font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors">
                                    Entrar
                                </button>
                            </Link>
                            <Link href="/application" className="hidden sm:block">
                                <button type="button" className="text-slate-900 bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:outline-none focus:ring-amber-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center transition-transform hover:scale-105">
                                    Inscreva-se
                                </button>
                            </Link>
                            {/* Mobile only buttons */}
                            <Link href="/application" className="sm:hidden">
                                <button type="button" className="text-slate-900 bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:outline-none focus:ring-amber-300 font-bold rounded-lg text-xs px-3 py-2 text-center">
                                    Inscreva-se
                                </button>
                            </Link>
                        </>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
                        aria-controls="navbar-sticky"
                        aria-expanded={isOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        {isOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                    </button>
                </div>
                <div
                    className={`${isOpen ? "block" : "hidden"
                        } items-center justify-between w-full md:flex md:w-auto md:order-1 md:mx-auto transition-all duration-300 ease-in-out`}
                    id="navbar-sticky"
                >
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-800 rounded-lg bg-slate-800 md:space-x-6 lg:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
                        {navigation.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className="block py-2 px-3 text-gray-300 rounded hover:bg-slate-700 md:hover:bg-transparent md:hover:text-amber-500 md:p-0 transition-colors text-lg font-serif font-medium tracking-wide"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                        {!user && (
                            <li className="mt-4 pt-4 border-t border-gray-700 sm:hidden">
                                <Link
                                    href="/login"
                                    className="block py-2 px-3 text-gray-300 rounded hover:bg-slate-700 transition-colors text-sm uppercase tracking-wide font-semibold"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Entrar
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
