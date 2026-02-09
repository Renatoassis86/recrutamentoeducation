import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { Search, Filter, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CandidatesPage() {
    const supabase = createClient();

    // Fetch all applications
    const { data: applications } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">Candidatos Inscritos</h1>
                    <p className="text-slate-500">Gerencie todas as inscrições do processo seletivo.</p>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 shadow-sm">
                        <Filter className="h-4 w-4" />
                        Filtros
                    </button>
                </div>
            </div>

            {/* Filters Bar (Visual Only for now, interactive logic needs client component) */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </div>

            {/* Candidates Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Candidato</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Perfil</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Local</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {applications?.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden">
                                                {/* Assuming avatar_url might be in a joined profile, but for now initials */}
                                                {app.avatar_url ? (
                                                    <img src={app.avatar_url} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    app.full_name?.charAt(0) || "?"
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900">{app.full_name}</div>
                                                <div className="text-sm text-slate-500">{app.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-900 capitalize">{app.profile_type}</div>
                                        <div className="text-xs text-slate-500 max-w-[200px] truncate">
                                            {app.profile_type === 'licenciado' ? app.licensure_area : app.pedagogy_areas?.join(", ")}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-900">{app.city}</div>
                                        <div className="text-xs text-slate-500">{app.state}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${app.status === 'under_review' ? 'bg-amber-100 text-amber-800' :
                                                app.status === 'interview_invited' ? 'bg-blue-100 text-blue-800' :
                                                    app.status === 'hired' ? 'bg-green-100 text-green-800' :
                                                        'bg-slate-100 text-slate-800'}`}>
                                            {app.status === 'under_review' ? 'Em Análise' :
                                                app.status === 'interview_invited' ? 'Entrevista' :
                                                    app.status === 'hired' ? 'Aprovado' : 'Recebido'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {format(new Date(app.created_at), "dd MMM, yyyy", { locale: ptBR })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={`/admin/candidates/${app.id}`} className="text-amber-600 hover:text-amber-900 flex items-center justify-end gap-1">
                                            <Eye className="h-4 w-4" /> Detalhes
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {(!applications || applications.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                                        Nenhum candidato encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination - Simplified */}
                <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between sm:px-6">
                    <div className="text-xs text-slate-500">
                        Mostrando {applications?.length || 0} resultados
                    </div>
                    <div className="flex gap-2">
                        <button disabled className="px-3 py-1 border border-slate-300 rounded-md text-sm text-slate-400 cursor-not-allowed">Anterior</button>
                        <button disabled className="px-3 py-1 border border-slate-300 rounded-md text-sm text-slate-400 cursor-not-allowed">Próximo</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
