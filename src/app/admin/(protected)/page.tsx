import { createClient } from "@/utils/supabase/server";
import { Users, BookOpen, GraduationCap, MapPin, TrendingUp, Calendar } from "lucide-react";
import BrazilHeatmap from "@/components/admin/BrazilHeatmap";
import { StatusChart, ProfilePieChart } from "@/components/admin/Charts";

export const dynamic = "force-dynamic";

async function getStats() {
    const supabase = createClient();

    // 1. Fetch all applications (lightweight for counts if possible, but we need details for charts)
    const { data: applications } = await supabase
        .from("applications")
        .select("id, profile_type, state, status, created_at");

    const totalApps = applications?.length || 0;

    // 2. Process Data for Charts
    let licenciados = 0;
    let pedagogos = 0;
    const statusCounts: Record<string, number> = {};
    const stateCounts: Record<string, number> = {};

    // Last 7 days activity
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    let recentApps = 0;

    applications?.forEach(app => {
        // Profile Type
        if (app.profile_type === 'licenciado') licenciados++;
        if (app.profile_type === 'pedagogo') pedagogos++;

        // Status
        const status = app.status || 'received';
        statusCounts[status] = (statusCounts[status] || 0) + 1;

        // State (Heatmap)
        if (app.state) {
            const uf = app.state.toUpperCase();
            stateCounts[uf] = (stateCounts[uf] || 0) + 1;
        }

        // Recent Activity
        if (new Date(app.created_at) > last7Days) {
            recentApps++;
        }
    });

    // Format for Recharts
    const statusData = [
        { name: 'Recebido', value: statusCounts['received'] || 0 },
        { name: 'Em Análise', value: statusCounts['under_review'] || 0 },
        { name: 'Entrevista', value: statusCounts['interview_invited'] || 0 },
        { name: 'Aprovado', value: statusCounts['hired'] || 0 }, // Assuming 'hired' or similar final status
        { name: 'Arquivado', value: statusCounts['closed'] || 0 },
    ].filter(i => i.value > 0);

    const profileData = [
        { name: 'Licenciados', value: licenciados, fill: '#3b82f6' }, // Blue
        { name: 'Pedagogos', value: pedagogos, fill: '#10b981' }, // Green
    ];

    // Top States
    const topStates = Object.entries(stateCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return {
        totalApps,
        licenciados,
        pedagogos,
        recentApps,
        statusData,
        profileData,
        stateCounts, // For Heatmap
        topStates
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">Visão Geral</h1>
                    <p className="text-slate-500">Métricas e performance do processo seletivo em tempo real.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-2 rounded-md shadow-sm border border-slate-200">
                    <Calendar className="h-4 w-4" />
                    <span>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total de Inscritos"
                    value={stats.totalApps}
                    icon={Users}
                    trend={`+${stats.recentApps} esta semana`}
                    color="amber"
                />
                <KPICard
                    title="Licenciados"
                    value={stats.licenciados}
                    icon={BookOpen}
                    subvalue={`${stats.totalApps > 0 ? ((stats.licenciados / stats.totalApps) * 100).toFixed(0) : 0}%`}
                    color="blue"
                />
                <KPICard
                    title="Pedagogos"
                    value={stats.pedagogos}
                    icon={GraduationCap}
                    subvalue={`${stats.totalApps > 0 ? ((stats.pedagogos / stats.totalApps) * 100).toFixed(0) : 0}%`}
                    color="green"
                />
                <KPICard
                    title="Taxa de Conversão"
                    value="0%"
                    icon={TrendingUp}
                    subvalue="Em breve"
                    color="slate"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Charts */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Status Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Funil de Candidatos</h3>
                        {stats.totalApps > 0 ? (
                            <StatusChart data={stats.statusData} />
                        ) : (
                            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">Sem dados suficientes</div>
                        )}
                    </div>

                    {/* Heatmap Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-slate-400" />
                                Densidade Demográfica
                            </h3>
                            <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Mapa de Calor</div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1">
                                <BrazilHeatmap data={stats.stateCounts} />
                            </div>
                            <div className="w-full md:w-48 space-y-4">
                                <h4 className="text-sm font-semibold text-slate-700">Top Estados</h4>
                                {stats.topStates.map(([uf, count], idx) => (
                                    <div key={uf} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 font-bold text-slate-500">{idx + 1}.</span>
                                            <span className="font-medium text-slate-900">{uf}</span>
                                        </div>
                                        <span className="font-bold text-amber-600">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Profile Distribution & Activity */}
                <div className="space-y-8">

                    {/* Profile Distribution */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Perfil dos Candidatos</h3>
                        <p className="text-sm text-slate-500 mb-6">Distribuição por tipo de formação.</p>
                        {stats.totalApps > 0 ? (
                            <ProfilePieChart data={stats.profileData} />
                        ) : (
                            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">Sem dados suficientes</div>
                        )}
                    </div>

                    {/* Quick Stats / Info */}
                    <div className="bg-slate-900 p-6 rounded-xl shadow-sm text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-white mb-2">Dica do Sistema</h3>
                            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                                Você pode filtrar candidatos por estado clicando na aba "Candidatos" (em breve).
                                Acompanhe o status de cada inscrição para manter o funil atualizado.
                            </p>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-amber-500 opacity-10 rounded-full blur-2xl"></div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function KPICard({ title, value, icon: Icon, trend, subvalue, color }: any) {
    const colors: any = {
        amber: "bg-amber-50 text-amber-600",
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        slate: "bg-slate-50 text-slate-600",
    };

    return (
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colors[color]}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="text-3xl font-bold text-slate-900">{value}</p>
                    {(trend || subvalue) && (
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            {trend && <span className="text-green-600 font-medium">{trend}</span>}
                            {subvalue && <span>{subvalue}</span>}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
