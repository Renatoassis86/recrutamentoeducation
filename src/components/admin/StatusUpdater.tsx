"use client";

import { useState } from "react";
import { updateApplicationStatus } from "@/app/admin/actions";
import { CheckCircle2, Loader2, ChevronDown } from "lucide-react";

export default function StatusUpdater({ id, currentStatus }: { id: string, currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const statuses = [
        { label: 'Recebido', value: 'received', color: 'bg-slate-500' },
        { label: 'Em Análise', value: 'under_review', color: 'bg-amber-500' },
        { label: 'Entrevista', value: 'interview_invited', color: 'bg-blue-500' },
        { label: 'Aprovado', value: 'hired', color: 'bg-green-500' },
    ];

    const current = statuses.find(s => s.value === status) || statuses[0];

    async function handleUpdate(newStatus: string) {
        setLoading(true);
        setIsOpen(false);
        const res = await updateApplicationStatus(id, newStatus);
        if (res.success) {
            setStatus(newStatus);
        } else {
            alert("Erro ao atualizar status: " + res.error);
        }
        setLoading(false);
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <div className={`h-2 w-2 rounded-full ${current.color}`} />}
                {current.label}
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
                    {statuses.map((s) => (
                        <button
                            key={s.value}
                            onClick={() => handleUpdate(s.value)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold hover:bg-slate-50 transition-colors ${status === s.value ? 'bg-slate-50 text-slate-900' : 'text-slate-500'}`}
                        >
                            <div className={`h-2 w-2 rounded-full ${s.color}`} />
                            {s.label}
                            {status === s.value && <CheckCircle2 className="h-3 w-3 ml-auto text-green-500" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
