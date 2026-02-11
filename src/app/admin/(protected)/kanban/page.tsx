"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    Users, MoreHorizontal, MessageSquare, Star,
    ArrowRight, Clock, MapPin, Search, Plus,
    Filter, LayoutGrid, List, MessageCircle,
    UserCircle, Send, Loader2, Info
} from "lucide-react";
import Link from "next/link";
import StatusUpdater from "@/components/admin/StatusUpdater";

const PHASES = [
    { id: "received", label: "Inscritos", color: "bg-slate-500" },
    { id: "under_review", label: "Em Análise", color: "bg-amber-500" },
    { id: "reviewed", label: "Analisados", color: "bg-purple-500" },
    { id: "approved_2nd_phase", label: "Aprovados 2ª Fase", color: "bg-blue-500" },
    { id: "interviews", label: "Entrevistas", color: "bg-indigo-500" },
    { id: "ranked", label: "Classificados", color: "bg-emerald-500" },
    { id: "hired", label: "Contratados", color: "bg-green-600" },
];

export default function KanbanPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

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

    const getAppsByStatus = (status: string) => {
        return filteredApps.filter(app => (app.status || 'received') === status);
    };

    return (
        <div className="h-full flex flex-col space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 font-serif">Fluxo de Recrutamento</h1>
                    <p className="text-slate-500 font-medium italic">Visão estratégica do pipeline de autores e especialistas.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-1 rounded-xl flex items-center">
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Filtrar candidatos no pipeline..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <AdminInternalChat />
                </div>
            </div>

            {/* Kanban Board */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
                </div>
            ) : (
                <div className="flex-1 overflow-x-auto pb-10 custom-scrollbar">
                    <div className="flex gap-6 min-w-max h-full">
                        {PHASES.map((phase) => (
                            <div key={phase.id} className="w-80 flex flex-col h-full bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2.5 w-2.5 rounded-full ${phase.color}`} />
                                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{phase.label}</h3>
                                        <span className="bg-slate-200 text-slate-600 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                                            {getAppsByStatus(phase.id).length}
                                        </span>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                                    {getAppsByStatus(phase.id).map((app) => (
                                        <CandidateCard key={app.id} application={app} onUpdate={loadApplications} />
                                    ))}
                                    {getAppsByStatus(phase.id).length === 0 && (
                                        <div className="h-32 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 text-xs font-bold uppercase tracking-tighter">
                                            Vazio
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function CandidateCard({ application, onUpdate }: { application: any, onUpdate: () => void }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group group relative overflow-hidden">
            <div className="flex items-start justify-between mb-3">
                <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${application.profile_type === 'licenciado' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-green-50 text-green-600 border border-green-100'
                    }`}>
                    {application.profile_type}
                </div>
                <div className="flex gap-1">
                    <Star className="h-3 w-3 text-slate-200 fill-slate-200" />
                </div>
            </div>

            <Link href={`/admin/candidates/${application.id}`}>
                <h4 className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors leading-tight mb-1">
                    {application.full_name}
                </h4>
            </Link>

            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold mb-4">
                <MapPin className="h-3 w-3" /> {application.city}, {application.state}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <div className="flex -space-x-1.5 overflow-hidden">
                    <div className="h-6 w-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-400">
                        {application.full_name?.charAt(0)}
                    </div>
                </div>
                <StatusUpdater id={application.id} currentStatus={application.status || 'received'} />
            </div>

            {/* Drag Handle or similar effect */}
            <div className="absolute top-0 right-0 w-1 h-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
    );
}

function AdminInternalChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchMessages();
            // In a real app, subscribe to changes
        }
    }, [isOpen]);

    const fetchMessages = async () => {
        const supabase = createClient();
        const { data } = await supabase
            .from("admin_messages")
            .select("*, profiles(full_name)")
            .order("created_at", { ascending: true });

        if (data) setMessages(data);
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        setLoading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            await supabase.from("admin_messages").insert({
                sender_id: user.id,
                content: newMessage
            });
            setNewMessage("");
            fetchMessages();
        }
        setLoading(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
            >
                <MessageSquare className="h-4 w-4 text-amber-500" />
                {isOpen ? 'Fechar Chat Adm' : 'Chat Interno Adm'}
                {!isOpen && <span className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></span>}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-4 w-[400px] h-[500px] bg-white border border-slate-200 shadow-2xl rounded-3xl z-[100] flex flex-col overflow-hidden animate-scale-in">
                    <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center">
                                <MessageCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold">Admin Lounge</h4>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Apenas para administradores</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50 custom-scrollbar">
                        <div className="text-center py-2">
                            <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Hoje</span>
                        </div>

                        {messages.length === 0 && (
                            <div className="py-20 text-center space-y-3">
                                <Info className="h-8 w-8 text-slate-200 mx-auto" />
                                <p className="text-slate-400 text-xs font-bold uppercase">Nenhuma mensagem ainda.<br />Comece o diálogo com o time.</p>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`flex flex-col ${msg.sender_id === 'me' ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase">{msg.profiles?.full_name || 'Admin'}</span>
                                    <span className="text-[8px] text-slate-300">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className={`p-3 rounded-2xl text-sm max-w-[80%] shadow-sm ${msg.sender_id === 'me' ? 'bg-amber-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Sua reflexão técnica..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !newMessage.trim()}
                            className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function X({ className }: { className: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
    )
}
