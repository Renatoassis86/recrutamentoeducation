"use client";

import { useState } from "react";
import {
    X, Send, Loader2, Sparkles, AlertCircle,
    CheckCircle2, Info, MessageSquare, Mail,
    AtSign, Phone
} from "lucide-react";
import { sendAdminEmail } from "@/app/admin/actions-email";

interface CommunicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipients: string[];
    names?: string[];
    type: 'email' | 'whatsapp';
}

export default function CommunicationModal({ isOpen, onClose, recipients, names, type }: CommunicationModalProps) {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSend = async () => {
        if (!message) return;
        setSending(true);
        setError(null);

        try {
            const res = await sendAdminEmail({
                recipients,
                subject: subject || (type === 'email' ? "Importante: Recrutamento Cidade Viva Education" : ""),
                message
            });

            if (res.error) {
                setError(res.error);
                return;
            }

            setSent(true);
            setTimeout(() => {
                onClose();
                setSent(false);
                setMessage("");
                setSubject("");
            }, 3000);
        } catch (err: any) {
            console.error("Communication Modal Error:", err);
            setError(err.message || "Erro ao processar o envio. Verifique sua conexão.");
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 animate-fade-in-up border border-slate-200">
                {/* Header */}
                <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-lg ${type === 'email' ? 'bg-amber-500' : 'bg-green-500'}`}>
                            {type === 'email' ? <Mail className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold font-serif">
                                {type === 'email' ? 'Nova Comunicação via E-mail' : 'Enviar Mensagem WhatsApp'}
                            </h3>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{recipients.length} {recipients.length === 1 ? 'destinatário' : 'destinatários'}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    {sent ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-scale-in">
                            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-inner">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Mensagem Enviada!</h4>
                                <p className="text-slate-500">Seus destinatários receberão o conteúdo em instantes.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Recipients List (Compact) */}
                            <div className="flex flex-wrap gap-2 mb-4 max-h-24 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                {names?.map((name, i) => (
                                    <span key={i} className="text-[10px] font-bold bg-white text-slate-600 px-2 py-1 rounded-md border border-slate-200 shadow-sm">
                                        {name}
                                    </span>
                                ))}
                                {recipients.length > (names?.length || 0) && (
                                    <span className="text-[10px] font-bold text-slate-400">+{recipients.length - (names?.length || 0)} outros</span>
                                )}
                            </div>

                            {type === 'email' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Assunto</label>
                                    <input
                                        type="text"
                                        placeholder="Digite o assunto da mensagem..."
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Conteúdo da Mensagem</label>
                                <textarea
                                    rows={6}
                                    placeholder={type === 'email' ? "Escreva sua mensagem aqui..." : "Olá! Gostaria de falar sobre sua inscrição no processo Paideia..."}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full px-5 py-4 rounded-3xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm leading-relaxed"
                                />
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase mt-2">
                                    <Sparkles className="h-3 w-3 text-amber-500" /> Use variáveis como {"{NOME}"} para personalizar (em breve)
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-700 text-xs font-bold">
                                    <AlertCircle className="h-4 w-4" /> {error}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Info className="h-4 w-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Respeite a lei geral de proteção de dados (LGPD)</span>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSend}
                                        disabled={sending || !message}
                                        className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-xl shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 active:scale-95 transition-all"
                                    >
                                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        {sending ? 'Enviando...' : 'Iniciar Envio'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
