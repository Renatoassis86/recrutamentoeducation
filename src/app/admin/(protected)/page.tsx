import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Users, BookOpen, GraduationCap, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
    const supabase = createClient();

    // 1. Total Applications
    const { count: totalApps } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true });

    // 2. By Profile Type
    const { data: profiles } = await supabase
        .from("applications")
        .select("profile_type");

    let licenciados = 0;
    let pedagogos = 0;

    profiles?.forEach(p => {
        if (p.profile_type === 'licenciado') licenciados++;
        if (p.profile_type === 'pedagogo') pedagogos++;
    });

    // 3. By State
    const { data: states } = await supabase
        .from("applications")
        .select("state");

    const stateCounts: Record<string, number> = {};
    states?.forEach(p => {
        const uf = p.state ? p.state.toUpperCase() : 'N/A';
        stateCounts[uf] = (stateCounts[uf] || 0) + 1;
    });

    // Sort states by count
    const sortedStates = Object.entries(stateCounts)
        .sort(([, a], [, b]) => b - a);

    return {
        totalApps: totalApps || 0,
        licenciados,
        pedagogos,
        sortedStates
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">Dashboard</h1>
                <p className="text-slate-500">Visão geral do processo seletivo.</p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                {/* Total */}
                <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total de Inscritos</p>
                            <p className="text-3xl font-bold text-slate-900">{stats.totalApps}</p>
                        </div>
                    </div>
                </div>

                {/* Licenciados */}
                <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Licenciados</p>
                            <p className="text-3xl font-bold text-slate-900">{stats.licenciados}</p>
                            <p className="text-xs text-slate-400 mt-1">
                                {stats.totalApps > 0 ? ((stats.licenciados / stats.totalApps) * 100).toFixed(1) : 0}% do total
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pedagogos */}
                <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Pedagogos</p>
                            <p className="text-3xl font-bold text-slate-900">{stats.pedagogos}</p>
                            <p className="text-xs text-slate-400 mt-1">
                                {stats.totalApps > 0 ? ((stats.pedagogos / stats.totalApps) * 100).toFixed(1) : 0}% do total
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* State Distribution */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-slate-400" />
                        Distribuição por Estado
                    </h3>

                    {stats.sortedStates.length === 0 ? (
                        <p className="text-slate-500 text-sm">Nenhum dado geográfico disponível.</p>
                    ) : (
                        <div className="space-y-4">
                            {stats.sortedStates.map(([uf, count]) => (
                                <div key={uf} className="flex items-center gap-4">
                                    <div className="w-8 font-bold text-slate-700">{uf}</div>
                                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500 rounded-full"
                                            style={{ width: `${(count / stats.totalApps) * 100}%` }}
                                        />
                                    </div>
                                    <div className="w-12 text-sm text-right text-slate-600">{count}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Placeholder for actual Map Visual if needed later */}
                    <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-xs text-slate-400">
                        Visualização de mapa completa em desenvolvimento
                    </div>
                </div>

                {/* Recent Activity (Placeholder) */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Atividade Recente</h3>
                    <p className="text-slate-500 text-sm">
                        O log de atividades recentes será exibido aqui.
                    </p>
                </div>

            </div>
        </div>
    );
}
