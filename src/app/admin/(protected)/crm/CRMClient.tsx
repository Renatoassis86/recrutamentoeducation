"use client";

import { useState } from "react";
import {
    Search, Filter, Send, MessageCircle, Mail,
    CheckSquare, Square, Users, CheckCircle2,
    Smartphone, Globe
} from "lucide-react";
import CommunicationModal from "@/components/admin/CommunicationModal";

export default function CRMClient({ initialApplications }: { initialApplications: any[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [commsType, setCommsType] = useState<'email' | 'whatsapp'>('email');

    const filtered = initialApplications.filter(app =>
        app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.cpf?.includes(searchTerm)
    );

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        setSelectedIds(prev =>
            prev.length === filtered.length ? [] : filtered.map(app => app.id)
        );
    };

    const handleOpenMassComms = (type: 'email' | 'whatsapp') => {
        if (selectedIds.length === 0) {
            alert("Selecione pelo menos um candidato.");
            return;
        }
        setCommsType(type);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Mass Actions Bar */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${selectedIds.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
                }`}>
                <div className="bg-slate-900 text-white px-8 py-5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-10 border border-white/10">
                    <div className="flex items-center gap-4 border-r border-white/10 pr-10">
                        <div className="h-10 w-10 bg-amber-500 rounded-2xl flex items-center justify-center font-black text-slate-900">
                            {selectedIds.length}
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Selecionados</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleOpenMassComms('email')}
                            className="flex items-center gap-2 hover:text-amber-500 transition-colors font-black text-xs uppercase"
                        >
                            <Mail className="h-5 w-5" /> Enviar Email
                        </button>
                        <div className="h-4 w-px bg-white/10" />
                        <button
                            onClick={() => handleOpenMassComms('whatsapp')}
                            className="flex items-center gap-2 hover:text-green-500 transition-colors font-black text-xs uppercase"
                        >
                            <MessageCircle className="h-5 w-5" /> WhatsApp Msg
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, e-mail ou CPF..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-3xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all font-medium"
                    />
                </div>
                <button className="h-14 bg-white border border-slate-200 rounded-3xl flex items-center justify-center gap-2 font-bold text-slate-600 hover:bg-slate-50 transition-all">
                    <Filter className="h-5 w-5" /> Filtros Avançados
                </button>
                <div className="h-14 bg-slate-50 rounded-3xl flex items-center px-6 gap-3 text-slate-400">
                    <Users className="h-5 w-5" />
                    <span className="text-sm font-bold">{filtered.length} Resultados</span>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="pl-8 py-5 w-10">
                                    <button onClick={toggleAll} className="text-slate-400">
                                        {selectedIds.length === filtered.length ? <CheckSquare className="h-5 w-5 text-amber-500" /> : <Square className="h-5 w-5" />}
                                    </button>
                                </th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Candidato</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">UF / Cidade</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Perfil</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ata de Contato</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(app => (
                                <tr key={app.id} className={`hover:bg-amber-50/30 transition-colors ${selectedIds.includes(app.id) ? 'bg-amber-50/50' : ''}`}>
                                    <td className="pl-8 py-5">
                                        <button onClick={() => toggleSelect(app.id)} className="text-slate-300">
                                            {selectedIds.includes(app.id) ? <CheckSquare className="h-5 w-5 text-amber-500" /> : <Square className="h-5 w-5" />}
                                        </button>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors cursor-pointer">{app.full_name}</span>
                                            <span className="text-[10px] text-slate-400 font-medium">{app.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                            <Globe className="h-3.5 w-3.5 text-slate-300" />
                                            {app.state} • {app.city}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${app.profile_type === 'licenciado' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                            }`}>
                                            {app.profile_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-1.5 w-1.5 bg-slate-300 rounded-full" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.status || 'received'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-all active:scale-90"><Mail className="h-4 w-4" /></button>
                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-all active:scale-90"><MessageCircle className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CommunicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={commsType}
                recipients={selectedIds}
            />
        </div>
    );
}
