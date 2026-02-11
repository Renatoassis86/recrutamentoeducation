"use client";

import { useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { loginAdmin } from "@/app/actions/auth-admin";
import { ShieldAlert, Fingerprint, ArrowRight, Loader2, Lock, Mail, Sparkles } from "lucide-react";
import Link from "next/link";

/**
 * PAIDEIA CRM - V3 LOGIN SYSTEM (ULTRA PREMIUM DIAGRAMMING)
 * @frontend-specialist
 */

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="group relative flex w-full justify-center items-center gap-2 rounded-2xl bg-amber-500 px-6 py-4 text-sm font-black uppercase tracking-widest text-slate-900 shadow-xl shadow-amber-500/20 hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:opacity-50 transition-all active:scale-95 mt-4"
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

export default function AdminLogin() {
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const params = new URLSearchParams(window.location.search);
        if (params.get("error")) setError(decodeURIComponent(params.get("error")!));
    }, []);

    async function handleSubmit(formData: FormData) {
        setError(null);
        const result = await loginAdmin(formData);
        if (result?.error) setError(result.error);
    }

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Ambient Background - Dark Gradient Mesh */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.05),transparent_70%)]" />
            <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-[460px] z-10 space-y-10 animate-fade-in">
                {/* Branding / Visual Anchor */}
                <div className="flex flex-col items-center space-y-6">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-amber-500/20 blur-xl rounded-full" />
                        <div className="h-24 w-24 rounded-[2rem] bg-amber-500 flex items-center justify-center shadow-2xl relative rotate-2 transition-transform hover:rotate-0">
                            <Lock className="h-10 w-10 text-slate-950" />
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-500 text-[9px] font-black uppercase tracking-[0.3em]">
                            <Sparkles className="h-3 w-3" />
                            Internal Command
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-white font-serif">Acesso Restrito</h1>
                        <p className="text-slate-400 text-sm font-medium">Autenticação Paideia para a comissão editorial.</p>
                    </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    {/* Subtle Internal Glow */}
                    <div className="absolute -top-24 -left-24 h-48 w-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                    <form action={handleSubmit} className="space-y-6 relative z-10">
                        {error && (
                            <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-[10px] font-black uppercase tracking-tight text-red-400 animate-shake">
                                <ShieldAlert className="h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="group">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">E-mail Institucional</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <input
                                        name="username"
                                        type="email"
                                        required
                                        placeholder="admin@cidadeviva.org"
                                        autoComplete="email"
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 text-sm font-medium focus:ring-2 focus:ring-amber-500/40 focus:bg-slate-950 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Chave de Segurança</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors">
                                        <Fingerprint className="h-4 w-4" />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 text-sm font-medium focus:ring-2 focus:ring-amber-500/40 focus:bg-slate-950 transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <SubmitButton />
                    </form>
                </div>

                {/* Footer Controls */}
                <div className="flex flex-col items-center gap-6">
                    <Link
                        href="/"
                        className="text-[10px] font-black text-slate-600 hover:text-amber-500 transition-all uppercase tracking-[0.3em] flex items-center gap-3 group"
                    >
                        <ArrowRight className="h-3 w-3 rotate-180 group-hover:-translate-x-2 transition-transform" />
                        Retornar ao Portal Público
                    </Link>

                    <div className="flex flex-col items-center gap-3">
                        <div className="h-px w-12 bg-slate-900" />
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-800 flex items-center gap-2">
                            &copy; 2026 PAIDEIA <span className="h-1 w-1 bg-amber-500 rounded-full" /> CRM CORE
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
