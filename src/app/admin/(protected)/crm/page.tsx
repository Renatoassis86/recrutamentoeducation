"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    Users, Mail, MessageCircle, Send, Search,
    Filter, CheckSquare, Square, Download,
    History, Zap, MessageSquare, AtSign,
    Share2, UserCheck, SearchCode, Megaphone
} from "lucide-react";
import CommunicationModal from "@/components/admin/CommunicationModal";

export default function CRMPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Communication Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [commsType, setCommsType] = useState<'email' | 'whatsapp'>('email');
    const [recipients, setRecipients] = useState<string[]>([]);
    const [names, setNames] = useState<string[]>([]);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        setLoading(true);
        const supabase = createClient();
        const { data } = await supabase
            .from("applications")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setApplications(data);
        setLoading(false);
    };

    const filteredApps = applications.filter(app =>
        app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredApps.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredApps.map(app => app.id));
        }
    };

    const handleOpenComms = (type: 'email' | 'whatsapp', targetRecipients: any[]) => {
        setCommsType(type);
        setRecipients(targetRecipients.map(r => type === 'email' ? r.email : r.phone));
        setNames(targetRecipients.map(r => r.full_name));
        setModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 font-serif">Relacionamento & CRM</h1>
                    <p className="text-slate-500 font-medium">Gestão centralizada de comunicações e engajamento com candidatos.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleOpenComms('email', filteredApps.filter(a => selectedIds.includes(a.id)))}
                        disabled={selectedIds.length === 0}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all disabled:opacity-50 active:scale-95"
                    >
                        <Megaphone className="h-4 w-4 text-amber-500" /> Disparo Massivo
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Total</span>
                    <div className="flex items-baseline gap-2 mt-2 font-serif">
                        <span className="text-3xl font-black text-slate-900">{applications.length}</span>
                        <span className="text-xs text-slate-400">contatos</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aptos para WhatsApp</span>
                    <div className="flex items-baseline gap-2 mt-2 font-serif">
                        <span className="text-3xl font-black text-green-600">{applications.filter(a => !!a.phone).length}</span>
                        <span className="text-xs text-slate-400">números</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mails Válidos</span>
                    <div className="flex items-baseline gap-2 mt-2 font-serif">
                        <span className="text-3xl font-black text-amber-600">{applications.filter(a => !!a.email).length}</span>
                        <span className="text-xs text-slate-400">endereços</span>
                    </div>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl shadow-xl flex flex-col justify-between text-white">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taxa de Engajamento</span>
                    <div className="flex items-baseline gap-2 mt-2 font-serif">
                        <span className="text-3xl font-black text-amber-500">82%</span>
                        <span className="text-xs text-slate-500">estimativa</span>
                    </div>
                </div>
            </div>

            {/* Filter & Selection Bar */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar por nome, especialidade ou e-mail..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-white bg-white shadow-sm text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="h-12 px-5 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                            <Filter className="h-4 w-4" /> Filtros Avançados
                        </button>
                        <button
                            onClick={toggleSelectAll}
                            className="h-12 px-5 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
                        >
                            {selectedIds.length === filteredApps.length ? <CheckSquare className="h-4 w-4 text-amber-500" /> : <Square className="h-4 w-4" />}
                            Selecionar Todos
                        </button>
                    </div>
                </div>

                {selectedIds.length > 0 && (
                    <div className="flex items-center justify-between p-4 bg-amber-500 rounded-2xl text-white shadow-lg animate-fade-in-up">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-black uppercase tracking-widest">{selectedIds.length} Candidatos Selecionados</span>
                            <div className="h-4 w-px bg-white/20"></div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleOpenComms('email', filteredApps.filter(a => selectedIds.includes(a.id)))}
                                    className="flex items-center gap-2 text-xs font-black bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all"
                                >
                                    <Mail className="h-4 w-4" /> Enviar E-mail
                                </button>
                                <button
                                    onClick={() => handleOpenComms('whatsapp', filteredApps.filter(a => selectedIds.includes(a.id)))}
                                    className="flex items-center gap-2 text-xs font-black bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all"
                                >
                                    <MessageSquare className="h-4 w-4" /> WhatsApp em Lote
                                </button>
                            </div>
                        </div>
                        <button onClick={() => setSelectedIds([])} className="text-xs font-bold opacity-80 hover:opacity-100">Cancelar seleção</button>
                    </div>
                )}
            </div>

            {/* Contacts Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-50">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Seleção</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidato</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação Direta</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredApps.map((app) => (
                                <tr key={app.id} className={`hover:bg-slate-50/40 transition-all ${selectedIds.includes(app.id) ? 'bg-amber-50/30' : ''}`}>
                                    <td className="px-8 py-6">
                                        <button onClick={() => toggleSelect(app.id)} className="text-slate-300 hover:text-amber-500 transition-colors">
                                            {selectedIds.includes(app.id) ? <CheckSquare className="h-6 w-6 text-amber-500" /> : <Square className="h-6 w-6" />}
                                        </button>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold">
                                                {app.full_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-slate-900 leading-none">{app.full_name}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                    {app.profile_type} • {app.state}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-2 group">
                                            <div className="h-8 w-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                                                <Phone className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600">{app.phone || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                                                <AtSign className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600">{app.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-right space-x-2">
                                        <button
                                            onClick={() => handleOpenComms('whatsapp', [app])}
                                            className="h-10 px-4 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center gap-2 inline-flex"
                                        >
                                            <MessageCircle className="h-4 w-4" /> WhatsApp
                                        </button>
                                        <button
                                            onClick={() => handleOpenComms('email', [app])}
                                            className="h-10 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-all shadow-sm active:scale-95 flex items-center gap-2 inline-flex"
                                        >
                                            <Mail className="h-4 w-4" /> E-mail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredApps.length === 0 && (
                    <div className="py-20 text-center text-slate-400">
                        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <SearchCode className="h-8 w-8 text-slate-200" />
                        </div>
                        <h4 className="font-black text-slate-900">Nenhum contato encontrado</h4>
                        <p className="text-sm mt-1 font-medium">Refine sua pesquisa ou importe novos candidatos.</p>
                    </div>
                )}
            </div>

            {/* Communication Modal Integration */}
            <CommunicationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                type={commsType}
                recipients={recipients}
                names={names}
            />
        </div>
    );
}

function Phone({ className }: { className: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    )
}
