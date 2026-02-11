"use client";

import { useEffect, useState } from "react";
import { deleteUser, getUsers, updateUserRole } from "./actions";
import {
    Trash2, AlertCircle, Loader2, UserPlus, Shield,
    User, Mail, Calendar, MoreVertical, CheckCircle,
    Search, Filter, ShieldAlert, BadgeCheck, X
} from "lucide-react";
import InviteAdminModal from "@/components/admin/InviteAdminModal";

type Profile = {
    id: string;
    email: string;
    full_name: string | null;
    role: string;
    created_at: string;
};

export default function UsersPage() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
        setLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) return;

        setDeletingId(id);
        const result = await deleteUser(id);
        setDeletingId(null);

        if (result.error) {
            setError(result.error);
            setTimeout(() => setError(null), 3000);
        } else {
            setUsers(users.filter(u => u.id !== id));
        }
    }

    async function handleToggleRole(id: string, currentRole: string) {
        const newRole = currentRole === 'admin' ? 'candidate' : 'admin';
        if (!confirm(`Deseja alterar o perfil deste usuário para ${newRole === 'admin' ? 'Administrador' : 'Candidato'}?`)) return;

        setUpdatingId(id);
        const result = await updateUserRole(id, newRole);
        setUpdatingId(null);

        if (result.success) {
            setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
        } else {
            setError("Erro ao atualizar perfil.");
            setTimeout(() => setError(null), 3000);
        }
    }

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Carregando usuários...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 font-serif">Gestão de Usuários</h1>
                    <p className="text-slate-500 font-medium">Controle de acessos e perfis administrativos do sistema.</p>
                </div>
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
                >
                    <UserPlus className="h-4 w-4 text-amber-500" /> Convidar Usuário
                </button>
            </div>

            {error && (
                <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700 flex gap-3 items-center animate-fade-in-up border border-red-100">
                    <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                        <ShieldAlert className="h-5 w-5" />
                    </div>
                    <span className="font-bold">{error}</span>
                </div>
            )}

            {/* Filters */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Filtrar por nome ou e-mail..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
            </div>

            {/* Users Grid/List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                    <div key={user.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black text-lg">
                                    {user.full_name?.charAt(0) || <User className="h-5 w-5" />}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <h3 className="text-sm font-black text-slate-900 truncate">{user.full_name || "Sem Nome"}</h3>
                                    <span className="text-xs text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                                        <Mail className="h-3 w-3" /> {user.email}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                    <Shield className="h-5 w-5" />
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-tighter opacity-40">{user.role}</span>
                            </div>
                        </div>

                        <div className="absolute top-4 right-16 flex gap-2">
                            <button
                                onClick={() => alert("A edição direta será habilitada na próxima atualização de segurança.")}
                                className="h-8 w-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                title="Editar"
                            >
                                <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                            <button
                                onClick={() => handleDelete(user.id)}
                                disabled={deletingId === user.id}
                                className="h-8 w-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                title="Remover"
                            >
                                {deletingId === user.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nível de Acesso</span>
                                <button
                                    onClick={() => handleToggleRole(user.id, user.role)}
                                    disabled={updatingId === user.id}
                                    className={`mt-1 flex items-center gap-1.5 text-xs font-bold transition-all hover:scale-105 ${user.role === 'admin' ? 'text-amber-600' : 'text-slate-600'
                                        }`}
                                >
                                    {user.role === 'admin' ? <BadgeCheck className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
                                    {user.role === 'admin' ? 'Administrador' : 'Candidato'}
                                    {updatingId === user.id && <Loader2 className="h-3 w-3 animate-spin" />}
                                </button>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Desde</span>
                                <span className="mt-1 text-xs font-bold text-slate-600 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        </div>


                        {/* Background Decoration */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full opacity-50 transition-transform group-hover:scale-125"></div>
                    </div>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="h-8 w-8 text-slate-200" />
                        </div>
                        <h3 className="font-black text-slate-900">Nenhum usuário encontrado</h3>
                        <p className="text-slate-400 text-sm mt-1">Tente ajustar sua busca ou limpar os filtros.</p>
                    </div>
                )}
            </div>

            <InviteAdminModal
                isOpen={isInviteModalOpen}
                onClose={() => {
                    setIsInviteModalOpen(false);
                    loadUsers();
                }}
            />
        </div>
    );
}
