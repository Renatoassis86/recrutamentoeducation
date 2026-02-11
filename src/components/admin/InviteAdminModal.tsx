"use client";

import { useState } from "react";
import { createAdminUser } from "@/app/admin/(protected)/users/actions";
import {
    X, UserPlus, Mail, User, Shield,
    Loader2, CheckCircle2, AlertCircle
} from "lucide-react";

export default function InviteAdminModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await createAdminUser(email, fullName);

        if (res.success) {
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setEmail("");
                setFullName("");
            }, 2000);
        } else {
            setError(res.error || "Erro ao criar administrador.");
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-fade-in-up border border-slate-200">
                <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-amber-500 rounded-xl flex items-center justify-center">
                            <UserPlus className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold font-serif">Convidar Administrador</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    {success ? (
                        <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-black text-slate-900 uppercase tracking-tighter">Administrador Criado!</h4>
                                <p className="text-sm text-slate-500">O acesso foi configurado com sucesso.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ex: Bia"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">E-mail de Acesso</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        required
                                        type="email"
                                        placeholder="email@cidadeviva.org"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" /> {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Shield className="h-5 w-5 text-amber-500" />}
                                {loading ? 'Processando...' : 'Confirmar Novo Administrador'}
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
