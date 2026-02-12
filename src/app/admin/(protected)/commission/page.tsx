"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { getUsers, createCommitteeUser, deleteUser, updateUser } from "@/app/admin/(protected)/users/actions";
import { Loader2, Plus, Trash2, Mail, Shield, User, Edit2 } from "lucide-react";

export default function CommissionPage() {
    const router = useRouter();
    const supabase = createClient();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    // Form state
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [position, setPosition] = useState("");

    useEffect(() => {
        const checkRole = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
            if (profile?.role !== 'admin') {
                router.push("/admin");
                return;
            }
            loadUsers();
        };
        checkRole();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        const data = await getUsers();
        setUsers(data.filter((u: any) => u.role === 'committee'));
        setLoading(false);
    };

    const handleOpenCreate = () => {
        setEditingUser(null);
        setFullName("");
        setEmail("");
        setPassword("");
        setPosition("");
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user: any) => {
        setEditingUser(user);
        setFullName(user.full_name || "");
        setEmail(user.email || "");
        setPassword(""); // Passwords shouldn't be filled
        setPosition(user.position || "");
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (editingUser) {
            const res = await updateUser(editingUser.id, {
                full_name: fullName,
                email: email,
                position: position
            }) as any;

            if (res.success) {
                alert("Membro da comissão atualizado!");
                setIsModalOpen(false);
                loadUsers();
            } else {
                alert("Erro ao atualizar: " + res.error);
            }
        } else {
            const res = await createCommitteeUser(email, fullName, password, position) as any;
            if (res.success) {
                alert("Membro da comissão cadastrado!");
                setIsModalOpen(false);
                loadUsers();
            } else {
                alert("Erro ao cadastrar: " + res.error);
            }
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Excluir acesso da comissão para ${name}?`)) return;
        const res = await deleteUser(id) as any;
        if (res.success) {
            loadUsers();
        } else {
            alert(res.error || "Erro ao excluir.");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-0 z-30">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 font-serif">Comissão Organizadora</h1>
                    <p className="text-slate-500 mt-2 font-medium">Gerencie os membros que auxiliam na triagem e avaliação.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-amber-200 active:scale-95"
                >
                    <Plus className="h-6 w-6" />
                    Novo Membro
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-20"><Loader2 className="h-10 w-10 animate-spin text-amber-500" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-slate-900">
                    {users.map((user) => (
                        <div key={user.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <User className="h-8 w-8" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenEdit(user)}
                                        className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                        title="Editar"
                                    >
                                        <Edit2 className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id, user.full_name)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="Excluir"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 truncate">{user.full_name || "Sem nome"}</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                                <Mail className="h-4 w-4" />
                                <span className="truncate">{user.email || "Sem email"}</span>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                                    Função: {user.position || "Comissão"}
                                </span>
                                <span className="text-[10px] font-bold text-slate-300">
                                    Desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        </div>
                    ))}
                    {users.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center">
                            <Shield className="h-16 w-16 text-slate-200 mb-6" />
                            <p className="text-slate-400 font-bold text-xl mb-8">Nenhum membro da comissão cadastrado.</p>
                            <button
                                onClick={handleOpenCreate}
                                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-3xl font-black transition-all shadow-2xl active:scale-95 uppercase tracking-widest text-xs"
                            >
                                <Plus className="h-5 w-5" />
                                Cadastrar Primeiro Membro
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Cadastro/Edição */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in duration-300">
                        <h2 className="text-2xl font-black text-slate-900 font-serif mb-6">
                            {editingUser ? "Editar Membro" : "Cadastrar Comissão"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nome Completo</label>
                                <input
                                    required
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none text-slate-900"
                                    placeholder="Ex: Dr. Marcelo Ramos"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Cargo / Função</label>
                                <input
                                    required
                                    type="text"
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none text-slate-900"
                                    placeholder="Ex: Coordenador Editorial"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email de Acesso</label>
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none text-slate-900"
                                    placeholder="email@escola.com.br"
                                />
                            </div>
                            {!editingUser && (
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Senha Provisória</label>
                                    <input
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none text-slate-900"
                                        placeholder="Mínimo 6 caracteres"
                                        minLength={6}
                                    />
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-4 rounded-2xl font-bold bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-4 rounded-2xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (editingUser ? "Salvar Alterações" : "Concluir Cadastro")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
