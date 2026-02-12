"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import {
    Search, Filter, Eye, FileSpreadsheet, Mail,
    MessageCircle, CheckSquare, Square, MoreHorizontal,
    Trash2, UserCheck, ShieldCheck, X, Download
} from "lucide-react";
import CommunicationModal from "@/components/admin/CommunicationModal";
import { deleteApplication, deleteApplicationsBulk } from "@/app/admin/actions";

export default function CandidatesPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <CandidatesPageClient />
        </Suspense>
    );
}

function CandidatesPageClient() {
    const searchParams = useSearchParams();
    const initialStatus = searchParams.get('status') || "all";
    const initialProfile = searchParams.get('profile_type') || "all";

    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [filterStatus, setFilterStatus] = useState(initialStatus);
    const [filterProfile, setFilterProfile] = useState(initialProfile);

    useEffect(() => {
        const statusFromUrl = searchParams.get('status');
        if (statusFromUrl) setFilterStatus(statusFromUrl);

        const profileFromUrl = searchParams.get('profile_type');
        if (profileFromUrl) setFilterProfile(profileFromUrl);
    }, [searchParams]);

    // Modal state
    const [commsModalOpen, setCommsModalOpen] = useState(false);
    const [commsType, setCommsType] = useState<'email' | 'whatsapp'>('email');
    const [commsRecipients, setCommsRecipients] = useState<string[]>([]);
    const [commsNames, setCommsNames] = useState<string[]>([]);

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

    const filteredApps = applications.filter(app => {
        const matchesSearch = app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.cpf?.includes(searchTerm);

        let matchesStatus = true;
        if (filterStatus === "finalized") {
            matchesStatus = app.status !== "draft" && app.status !== null;
        } else if (filterStatus === "draft") {
            matchesStatus = app.status === "draft" || app.status === null;
        } else if (filterStatus !== "all") {
            matchesStatus = app.status === filterStatus;
        }

        const matchesProfile = filterProfile === "all" || app.profile_type === filterProfile;
        return matchesSearch && matchesStatus && matchesProfile;
    });

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredApps.length && filteredApps.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredApps.map(app => app.id));
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir permanentemente a conta e os dados de ${name}? Esta ação não pode ser desfeita.`)) return;

        const res = await deleteApplication(id) as any;
        if (res.success) {
            if (res.message) alert(res.message);
            loadApplications();
        } else {
            alert("Erro ao excluir: " + (res.error || "Ocorreu um erro."));
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Tem certeza que deseja excluir permanentemente estes ${selectedIds.length} candidatos? Todas as contas e dados associados serão removidos.`)) return;

        setLoading(true);
        const res = await deleteApplicationsBulk(selectedIds) as any;
        setLoading(false);

        if (res.success) {
            if (res.message) alert(res.message);
            setSelectedIds([]);
            loadApplications();
        } else {
            alert("Erro ao excluir em massa: " + (res.error || res.message || "Erro desconhecido"));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 font-serif">Inscrições Realizadas</h1>
                    <p className="text-slate-500 font-medium">Gestão integrada de dossiês e comunicação ativa.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all active:scale-95">
                        <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Exportar CSV
                    </button>
                    <button
                        onClick={() => {
                            if (selectedIds.length === 0) return;
                            const selected = filteredApps.filter(a => selectedIds.includes(a.id));
                            setCommsType('email');
                            setCommsRecipients(selected.map(a => a.email));
                            setCommsNames(selected.map(a => a.full_name));
                            setCommsModalOpen(true);
                        }}
                        disabled={selectedIds.length === 0}
                        className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg ${selectedIds.length > 0
                                ? 'bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            }`}
                        title={selectedIds.length === 0 ? "Selecione candidatos na lista abaixo primeiro" : ""}
                    >
                        <Mail className={`h-4 w-4 ${selectedIds.length > 0 ? 'text-amber-500' : 'text-slate-300'}`} />
                        Disparo em Massa {selectedIds.length > 0 && `(${selectedIds.length})`}
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, email ou CPF..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-white bg-white shadow-sm text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="py-3 px-4 rounded-xl border border-white bg-white shadow-sm text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-amber-500"
                >
                    <option value="all">Filtro: Todos os Status</option>
                    <optgroup label="Macro Status">
                        <option value="finalized">Finalizadas (Todas)</option>
                        <option value="draft">Em Aberto (Rascunhos)</option>
                    </optgroup>
                    <optgroup label="Fases Únicas">
                        <option value="received">Recebidos</option>
                        <option value="under_review">Em Análise</option>
                        <option value="interview_invited">Entrevista</option>
                        <option value="hired">Aprovados</option>
                    </optgroup>
                </select>
                <select
                    value={filterProfile}
                    onChange={(e) => setFilterProfile(e.target.value)}
                    className="py-3 px-4 rounded-xl border border-white bg-white shadow-sm text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-amber-500"
                >
                    <option value="all">Todos os Perfis</option>
                    <option value="licenciado">Licenciados</option>
                    <option value="pedagogo">Pedagogos</option>
                </select>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 px-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
                    {filteredApps.length} inscritos encontrados
                </div>
            </div>

            {/* Bulk Actions Header */}
            {selectedIds.length > 0 && (
                <div className="bg-amber-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-fade-in-up">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-black uppercase tracking-widest">{selectedIds.length} selecionados</span>
                        <div className="h-4 w-px bg-white/20"></div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    const selected = filteredApps.filter(a => selectedIds.includes(a.id));
                                    setCommsType('email');
                                    setCommsRecipients(selected.map(a => a.email));
                                    setCommsNames(selected.map(a => a.full_name));
                                    setCommsModalOpen(true);
                                }}
                                className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Mail className="h-3.5 w-3.5" /> Enviar Email
                            </button>
                            <button className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                                <ShieldCheck className="h-3.5 w-3.5" /> Mudar Status
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="flex items-center gap-2 text-xs font-bold bg-red-500 hover:bg-red-400 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Trash2 className="h-3.5 w-3.5" /> Excluir
                            </button>

                        </div>
                    </div>
                    <button onClick={() => setSelectedIds([])} className="text-xs font-bold opacity-70 hover:opacity-100">Desmarcar tudo</button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-amber-600">
                                        {selectedIds.length === filteredApps.length && filteredApps.length > 0 ? <CheckSquare className="h-5 w-5 text-amber-600" /> : <Square className="h-5 w-5" />}
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidato / UUID</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">CPF</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Perfil</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Localidade</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest px-12">Ações Rápidas</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredApps.map((app) => {
                                const isSelected = selectedIds.includes(app.id);
                                return (
                                    <tr key={app.id} className={`hover:bg-slate-50/50 transition-all ${isSelected ? 'bg-amber-50/30' : ''}`}>
                                        <td className="px-6 py-4">
                                            <button onClick={() => toggleSelect(app.id)} className="text-slate-300 hover:text-amber-600 transition-colors">
                                                {isSelected ? <CheckSquare className="h-5 w-5 text-amber-600" /> : <Square className="h-5 w-5" />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900">{app.full_name}</span>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1 rounded uppercase tracking-tighter">ID: {app.id.slice(0, 8)}</span>
                                                    <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                                                    <span className="text-[10px] text-slate-400 font-bold">{app.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-mono text-slate-600">{app.cpf || '---'}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className={`w-fit px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md border ${app.profile_type === 'licenciado' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    }`}>
                                                    {app.profile_type}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold mt-1 truncate max-w-[150px]">
                                                    {app.profile_type === 'licenciado' ? app.licensure_area : app.pedagogy_areas?.join(", ")}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-slate-700">{app.city}</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{app.state}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${app.status === 'under_review' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                                app.status === 'interview_invited' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                    app.status === 'hired' ? 'bg-green-100 text-green-800 border-green-200' :
                                                        'bg-slate-100 text-slate-500 border-slate-200'
                                                }`}>
                                                <div className={`h-1.5 w-1.5 rounded-full ${app.status === 'under_review' ? 'bg-amber-500' :
                                                    app.status === 'interview_invited' ? 'bg-blue-500' :
                                                        app.status === 'hired' ? 'bg-green-500' : 'bg-slate-400'
                                                    }`} />
                                                {app.status === 'under_review' ? 'Em Análise' :
                                                    app.status === 'interview_invited' ? 'Entrevista' :
                                                        app.status === 'hired' ? 'Aprovado' : 'Recebido'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                            <Link
                                                href={`/admin/candidates/${app.id}`}
                                                className="inline-flex items-center justify-center h-10 w-10 bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
                                                title="Ver Dossiê e PDFs"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <Link
                                                href={`/admin/candidates/${app.id}`}
                                                className="inline-flex items-center justify-center h-10 w-10 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                                                title="Baixar Anexos"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setCommsType('email');
                                                    setCommsRecipients([app.email]);
                                                    setCommsNames([app.full_name]);
                                                    setCommsModalOpen(true);
                                                }}
                                                className="inline-flex items-center justify-center h-10 w-10 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm active:scale-95"
                                                title="Enviar E-mail"
                                            >
                                                <Mail className="h-4 w-4" />
                                            </button>
                                            <a
                                                href={`https://wa.me/${app.phone?.replace(/\D/g, '')}`}
                                                target="_blank"
                                                className="inline-flex items-center justify-center h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
                                                title="WhatsApp"
                                            >
                                                <MessageCircle className="h-4 w-4" />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(app.id, app.full_name)}
                                                className="inline-flex items-center justify-center h-10 w-10 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                                                title="Excluir"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Communication Modal */}
            <CommunicationModal
                isOpen={commsModalOpen}
                onClose={() => setCommsModalOpen(false)}
                type={commsType}
                recipients={commsRecipients}
                names={commsNames}
            />
        </div>
    );
}
