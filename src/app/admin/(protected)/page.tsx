import { createClient } from "@/utils/supabase/server";
import {
    Users, BookOpen, GraduationCap, MapPin,
    ArrowUpRight, Zap, Target, BarChart3, Star, ShieldCheck,
    TrendingUp, Calendar, Clock
} from "lucide-react";
import { StatusChart, ProfilePieChart, EvolutionChart } from "@/components/admin/Charts";
import BrazilHeatmap from "@/components/admin/BrazilHeatmap";
import WordCloud from "@/components/admin/WordCloud";
import { format, subDays } from "date-fns";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
    const supabase = createClient();
    const { data: applications } = await supabase
        .from("applications")
        .select("id, profile_type, state, status, created_at, licensure_area, experience_summary");

    const totalApps = applications?.length || 0;
    const statusCounts: Record<string, number> = {};
    const profileCounts: Record<string, number> = { 'licenciado': 0, 'pedagogo': 0 };
    const areaCounts: Record<string, number> = {};
    const stateCounts: Record<string, number> = {};

    const dailyStats: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
        dailyStats[format(subDays(new Date(), i), 'dd/MM')] = 0;
    }

    applications?.forEach(app => {
        const status = app.status || 'draft';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
        if (app.profile_type === 'licenciado' || app.profile_type === 'pedagogo') {
            profileCounts[app.profile_type]++;
        }
        if (app.licensure_area) {
            areaCounts[app.licensure_area] = (areaCounts[app.licensure_area] || 0) + 1;
        }
        if (app.state) {
            const uf = app.state.toUpperCase();
            stateCounts[uf] = (stateCounts[uf] || 0) + 1;
        }
        const dateKey = format(new Date(app.created_at), 'dd/MM');
        if (dailyStats[dateKey] !== undefined) dailyStats[dateKey]++;
    });

    const evolutionData = Object.entries(dailyStats).map(([name, value]) => ({ name, value }));
    const profileData = [
        { name: 'Licenciatura', value: profileCounts['licenciado'] },
        { name: 'Pedagogia', value: profileCounts['pedagogo'] }
    ].filter(i => i.value > 0);

    const topAreas = Object.entries(areaCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4);

    const summariesText = applications?.map(a => a.experience_summary).filter(Boolean).join(" ") || "";

    return {
        totalApps,
        statusCounts,
        evolutionData,
        profileData,
        stateCounts,
        topAreas,
        summariesText,
        licenciados: profileCounts['licenciado'],
        pedagogos: profileCounts['pedagogo']
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-700">
            {/* Minimalist Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 font-serif">
                        Central de Inteligência
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Controle de inscrições e balanço editorial Paideia.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Sincronizado</span>
                    </div>
                </div>
            </div>

            {/* KPI Grid - Optimized Diagramming */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <KPICard
                    title="Total Geral"
                    value={stats.totalApps}
                    icon={Users}
                    color="amber"
                    description="Inscrições na base"
                />
                <KPICard
                    title="Licenciatura"
                    value={stats.licenciados}
                    icon={BookOpen}
                    color="slate"
                    description="Candidatos a autores"
                />
                <KPICard
                    title="Pedagogia"
                    value={stats.pedagogos}
                    icon={GraduationCap}
                    color="emerald"
                    description="Especialistas técnicos"
                />
                <KPICard
                    title="Abrangência"
                    value={Object.keys(stats.stateCounts).length}
                    suffix="estados"
                    icon={MapPin}
                    color="blue"
                    description="Presença nacional"
                />
            </div>

            {/* Visual Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Fluxo de Novas Candidaturas</h3>
                            <BarChart3 className="h-5 w-5 text-slate-300" />
                        </div>
                        <EvolutionChart data={stats.evolutionData} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Mapa de Densidade</h3>
                            <BrazilHeatmap data={stats.stateCounts} />
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 px-1">Nuvem de Competências</h3>
                            <WordCloud text={stats.summariesText} />
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-4 text-center">Baseado nos resumos profissionais</p>
                        </div>
                    </div>
                </div>

                {/* Right Column Insights */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Distribuição por Status</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <StatusMiniCard label="Rascunho" value={stats.statusCounts['draft'] || 0} color="bg-slate-50 text-slate-400" />
                            <StatusMiniCard label="Recebido" value={stats.statusCounts['received'] || 0} color="bg-slate-100 text-slate-600" />
                            <StatusMiniCard label="Em Análise" value={stats.statusCounts['under_review'] || 0} color="bg-amber-100 text-amber-600" />
                            <StatusMiniCard label="Aprovado" value={stats.statusCounts['hired'] || 0} color="bg-green-100 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                            Mix de Formação
                        </h3>
                        <ProfilePieChart data={stats.profileData} />
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Ranking por Área</h3>
                        <div className="space-y-5">
                            {stats.topAreas.map(([area, count]) => (
                                <div key={area} className="group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black text-slate-700 truncate pr-4 uppercase">{area}</span>
                                        <span className="text-[10px] font-bold text-slate-400">{count}</span>
                                    </div>
                                    <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden border border-slate-100">
                                        <div
                                            className="h-full bg-amber-500 rounded-full"
                                            style={{ width: `${(stats.totalApps > 0 ? (count / stats.totalApps) * 100 : 0)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({ title, value, icon: Icon, suffix, color, description }: any) {
    const colors: any = {
        amber: "bg-amber-500 text-white shadow-amber-200",
        slate: "bg-slate-900 text-white shadow-slate-200",
        emerald: "bg-emerald-500 text-white shadow-emerald-200",
        blue: "bg-blue-600 text-white shadow-blue-200"
    };

    return (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className={`h-12 w-12 rounded-2xl ${colors[color]} flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110`}>
                <Icon className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">{title}</span>
            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">{value}</span>
                {suffix && <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{suffix}</span>}
            </div>
            <p className="mt-2 text-[10px] font-bold text-slate-500 italic opacity-0 group-hover:opacity-100 transition-opacity">
                {description}
            </p>
        </div>
    );
}

function StatusMiniCard({ label, value, color }: any) {
    return (
        <div className={`p-4 rounded-2xl border border-transparent ${color} flex flex-col items-center justify-center text-center shadow-sm`}>
            <span className="text-[10px] font-black uppercase tracking-tighter mb-1">{label}</span>
            <span className="text-xl font-black leading-none">{value}</span>
        </div>
    );
}
