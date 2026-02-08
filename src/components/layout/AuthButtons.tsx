"use client";

import { useState } from "react";
import Link from "next/link";
import LoginModal from "@/components/auth/LoginModal";
import { User } from "@supabase/supabase-js";

export default function AuthButtons({ user }: { user: User | null }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {user ? (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700 hidden sm:block">{user.email}</span>
                    <form action="/auth/signout" method="post">
                        <button type="submit" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Sair</button>
                    </form>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                    >
                        Minha Inscrição
                    </Link>
                </div>
            ) : (
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        Entrar
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                    >
                        Cadastre-se
                    </button>
                </div>
            )}

            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
