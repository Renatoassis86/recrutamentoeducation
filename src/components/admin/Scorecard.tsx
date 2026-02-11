"use client";

import { useState } from "react";
import { saveEvaluation } from "@/app/admin/actions-evaluations";
import {
    Star, MessageSquare, Save, Loader2,
    CheckCircle2, AlertCircle, Info, Sparkles
} from "lucide-react";

export default function Scorecard({ applicationId, initialData }: { applicationId: string, initialData?: any }) {
    const [pedagogical, setPedagogical] = useState(initialData?.score_pedagogical || 0);
    const [writing, setWriting] = useState(initialData?.score_writing || 0);
    const [alignment, setAlignment] = useState(initialData?.score_alignment || 0);
    const [comments, setComments] = useState(initialData?.comments || "");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        const result = await saveEvaluation({
            application_id: applicationId,
            score_pedagogical: pedagogical,
            score_writing: writing,
            score_alignment: alignment,
            comments: comments
        });

        if (result.success) {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } else {
            setError(result.error || "Erro desconhecido");
        }
        setSaving(false);
    };

    const RatingRow = ({ label, value, onChange }: any) => (
        <div className="flex items-center justify-between py-2">
            <span className="text-sm font-bold text-slate-700">{label}</span>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => onChange(star)}
                        className={`transition-all hover:scale-125 ${star <= value ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`}
                    >
                        <Star className="h-5 w-5" />
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-3xl border-2 border-slate-100 p-8 shadow-xl relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900 font-serif">Abreut / Scorecard Técnico</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avaliação individual da comissão</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <RatingRow label="Fundamentos Pedagógicos" value={pedagogical} onChange={setPedagogical} />
                    <RatingRow label="Qualidade da Escrita Autoral" value={writing} onChange={setWriting} />
                    <RatingRow label="Alinhamento Institucional" value={alignment} onChange={setAlignment} />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Parecer e Observações</label>
                    <textarea
                        rows={4}
                        placeholder="Descreva as percepções sobre o perfil técnico e alinhamento do autor..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm leading-relaxed font-medium"
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" /> {error}
                    </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                        <Info className="h-3 w-3" /> Sua avaliação é privada para o time admin
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black transition-all active:scale-95 shadow-lg ${saved ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4 text-amber-500" />)}
                        {saving ? 'Gravando...' : (saved ? 'Salvo!' : 'Salvar Avaliação')}
                    </button>
                </div>
            </div>

            {/* Decoration */}
            <div className="absolute top-0 right-0 -tr-10 -tr-10 w-32 h-32 bg-amber-500 opacity-[0.03] rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
        </div>
    );
}
