"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { getUsers, createCommitteeUser, deleteUser } from "@/app/admin/(protected)/users/actions";
import { Loader2, Plus, Trash2, Mail, Shield, User } from "lucide-react";

export default function CommissionPage() {
    const router = useRouter();
    const supabase = createClient();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
        // Filter only committee (or allow seeing all, but focus on committee)
        setUsers(data.filter((u: any) => u.role === 'committee'));
        setLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const res = await createCommitteeUser(email, fullName, password) as any;
        if (res.success) {
            alert("Membro da comissão cadastrado com sucesso!");
            setFullName("");
            setEmail("");
            setPassword("");
            setIsModalOpen(false);
            loadUsers();
        } else {
            alert("Erro: " + (res.error || "Ocorreu um erro."));
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Excluir acesso da comissão para ${name}?`)) return;
        const res = await deleteUser(id) as any;
        if (res.success) {
            if (res.message) alert(res.message);
            loadUsers();
        }
        else alert(res.error || "Ocorreu um erro ao excluir.");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 font-serif">Comissão Organizadora</h1>
                    <p className="text-slate-500 mt-2 font-medium">Gerencie os membros que auxiliam na triagem e avaliação.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-amber-200"
                >
                    <Plus className="h-5 w-5" />
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
                                <button
                                    onClick={() => handleDelete(user.id, user.full_name)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 truncate">{user.full_name || "Sem nome"}</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                                <Mail className="h-4 w-4" />
                                <span className="truncate">{user.email || "Sem email"}</span>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                                    Função: Comissão
                                </span>
                                <span className="text-[10px] font-bold text-slate-300">
                                    Desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        </div>
                    ))}
                    {users.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                            <Shield className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-medium">Nenhum membro da comissão cadastrado.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Cadastro */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in duration-300">
                        <h2 className="text-2xl font-black text-slate-900 font-serif mb-6">Cadastrar Comissão</h2>
                        <form onSubmit={handleCreate} className="space-y-5">
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
                                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Concluir Cadastro"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
