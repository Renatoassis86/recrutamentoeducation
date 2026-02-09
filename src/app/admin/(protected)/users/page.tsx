"use client";

import { useEffect, useState } from "react";
import { deleteUser, getUsers } from "./actions";
import { Trash2, AlertCircle, Loader2 } from "lucide-react";

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
    const [error, setError] = useState<string | null>(null);

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
            // Remove from list locally
            setUsers(users.filter(u => u.id !== id));
        }
    }

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gerenciar Usuários</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Visualize e gerencie os usuários cadastrados no sistema.
                    </p>
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 flex gap-2 items-center animate-fade-in-up">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                Nome / Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                Função
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                Data Cadastro
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Ações</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-900">{user.full_name || "Sem nome"}</span>
                                        <span className="text-slate-500">{user.email}</span>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {user.role === 'admin' ? 'Admin' : 'Candidato'}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        disabled={deletingId === user.id}
                                        className="text-red-600 hover:text-red-900 disabled:opacity-50 transition-colors"
                                        title="Excluir Usuário"
                                    >
                                        {deletingId === user.id ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-5 w-5" />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        Nenhum usuário encontrado.
                    </div>
                )}
            </div>
        </div>
    );
}
