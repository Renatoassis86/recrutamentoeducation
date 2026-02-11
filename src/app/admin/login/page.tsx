"use client";

import { useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { loginAdmin } from "@/app/actions/auth-admin";
import { ShieldAlert, Fingerprint, ArrowRight, Loader2, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/**
 * COMPONENTE DE BOTÃO PREMIUM COM FEEDBACK DE CARREGAMENTO
 */
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="group relative flex w-full justify-center items-center gap-2 rounded-2xl bg-amber-500 px-6 py-4 text-sm font-black uppercase tracking-widest text-slate-900 shadow-xl shadow-amber-500/20 hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:opacity-50 transition-all active:scale-95"
        >
            {pending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <>
                    Acessar Central Paideia
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
            )}
        </button>
    );
}

/**
 * PÁGINA DE LOGIN ADMINISTRATIVO V2 (PREMIUM DESIGN)
 * @frontend-specialist
 */
export default function AdminLogin() {
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Limpar parâmetros de erro na URL se existirem
        const params = new URLSearchParams(window.location.search);
        if (params.get("error")) setError(decodeURIComponent(params.get("error")!));
    }, []);

    async function handleSubmit(formData: FormData) {
        setError(null);
        const result = await loginAdmin(formData);
        if (result?.error) {
            setError(result.error);
        }
    }

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -ml-64 -mb-64" />

            <div className="w-full max-w-xl z-10">
                <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl relative">
                    {/* Header */}
                    <div className="space-y-6 text-center mb-12">
                        <div className="relative h-20 w-full mx-auto mb-8">
                            <Image
                                src="/logo-education.png"
                                alt="Cidade Viva Education"
                                fill
                                className="object-contain filter brightness-0 invert"
                            />
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Sparkles className="h-3 w-3" />
                            Internal Command Center
                        </div>

                        <h1 className="text-4xl font-black tracking-tighter text-white font-serif">
                            Acesso Restrito
                        </h1>
                        <p className="text-slate-400 text-sm font-medium">
                            Identifique-se para gerenciar o processo de prospecção de autores.
                        </p>
                    </div>

                    {/* Form */}
                    <form action={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="animate-shake flex items-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-xs font-bold text-red-400">
                                <ShieldAlert className="h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="group">
                                <label htmlFor="username" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                                    E-mail Institucional
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        placeholder="admin@cidadeviva.org"
                                        className="block w-full rounded-2xl bg-white/5 border border-white/10 pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all font-medium text-sm"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                                    Chave de Acesso
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors">
                                        <Fingerprint className="h-4 w-4" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="block w-full rounded-2xl bg-white/5 border border-white/10 pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all font-medium text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <SubmitButton />
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-12 pt-8 border-t border-white/5 text-center">
                        <Link
                            href="/"
                            className="text-xs font-bold text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowRight className="h-3 w-3 rotate-180" />
                            Retornar ao Portal Público
                        </Link>
                    </div>
                </div>

                {/* Security Badge */}
                <p className="text-center mt-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-700">
                    &copy; 2026 PAIDEIA CRM • AES-256 ENCRYPTED SESSION
                </p>
            </div>
        </div>
    );
}
