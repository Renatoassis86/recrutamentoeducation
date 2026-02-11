"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Tag, MessageSquare, Plus, X, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CandidateNotes({ id, initialNotes, initialTags }: { id: string, initialNotes?: string, initialTags?: string[] }) {
    const [notes, setNotes] = useState(initialNotes || "");
    const [tags, setTags] = useState<string[]>(initialTags || []);
    const [newTag, setNewTag] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        setIsSaving(true);
        const supabase = createClient();

        const { error } = await supabase
            .from("applications")
            .update({
                internal_notes: notes,
                tags: tags
            })
            .eq("id", id);

        if (!error) {
            router.refresh();
        }
        setIsSaving(false);
    };

    const addTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setNewTag("");
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-8 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-amber-500 pl-4">Espaço da Comissão</h3>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                    Salvar Notas
                </button>
            </div>

            {/* Tags Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400">
                    <Tag className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase">Tags de Classificação</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold border border-amber-100">
                            {tag}
                            <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                    <div className="flex items-center gap-1">
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTag()}
                            placeholder="Nova tag..."
                            className="w-24 bg-slate-50 border-0 rounded-lg px-2 py-1 text-[10px] font-bold focus:ring-1 focus:ring-amber-500"
                        />
                        <button onClick={addTag} className="p-1 bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors">
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-slate-400">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase">Anotações Internas</span>
                </div>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Escreva aqui observações sobre o perfil, entrevista ou análise de documentos..."
                    className="flex-1 w-full bg-slate-50 border-0 rounded-2xl p-4 text-xs font-medium text-slate-700 focus:ring-1 focus:ring-amber-500 resize-none min-h-[150px]"
                />
            </div>
        </div>
    );
}
