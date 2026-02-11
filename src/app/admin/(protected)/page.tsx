import { createClient } from "@/utils/supabase/server";
import { Users, BookOpen, GraduationCap, MapPin, TrendingUp, Calendar, ArrowUpRight, Zap, Target } from "lucide-react";
import BrazilHeatmapExtended from "@/components/admin/BrazilHeatmapExtended";
import { StatusChart, ProfilePieChart } from "@/components/admin/Charts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
    const supabase = createClient();

    const { data: applications } = await supabase
        .from("applications")
        .select("id, profile_type, state, status, created_at, graduation_course");

    const totalApps = applications?.length || 0;

    // Process Data
    let licenciados = 0;
    let pedagogos = 0;
    const statusCounts: Record<string, number> = {};
    const stateCounts: Record<string, number> = {};
    const courseCounts: Record<string, number> = {};

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    let recentApps = 0;

    applications?.forEach(app => {
        if (app.profile_type === 'licenciado') licenciados++;
        if (app.profile_type === 'pedagogo') pedagogos++;

        const status = app.status || 'received';
        statusCounts[status] = (statusCounts[status] || 0) + 1;

        if (app.state) {
            const uf = app.state.toUpperCase();
            stateCounts[uf] = (stateCounts[uf] || 0) + 1;
        }

        if (app.graduation_course) {
            courseCounts[app.graduation_course] = (courseCounts[app.graduation_course] || 0) + 1;
        }

        if (new Date(app.created_at) > last7Days) {
            recentApps++;
        }
    });

    const statusData = [
        { name: 'Inscritos', value: statusCounts['received'] || 0, color: '#64748b' },
        { name: 'Em Análise', value: statusCounts['under_review'] || 0, color: '#f59e0b' },
        { name: 'Analisados', value: statusCounts['reviewed'] || 0, color: '#a855f7' },
        { name: 'Aprov. 2ª F.', value: statusCounts['approved_2nd_phase'] || 0, color: '#3b82f6' },
        { name: 'Entrevistas', value: statusCounts['interviews'] || 0, color: '#6366f1' },
        { name: 'Classificados', value: statusCounts['ranked'] || 0, color: '#10b981' },
        { name: 'Contratados', value: statusCounts['hired'] || 0, color: '#059669' },
    ].filter(i => i.value > 0);

    const profileData = [
        { name: 'Licenciatura/Bacharelado', value: licenciados, fill: '#f59e0b' },
        { name: 'Pedagogia', value: pedagogos, fill: '#1e293b' },
    ];

    const topStates = Object.entries(stateCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    const topCourses = Object.entries(courseCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return {
        totalApps,
        licenciados,
        pedagogos,
        recentApps,
        statusData,
        profileData,
        stateCounts,
        topStates,
        topCourses
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Header section with Premium feel */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
                <div>
                    <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest mb-2">
                        <Zap className="h-3 w-3 fill-amber-600" /> Executive Console
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 font-serif">Informações Gerais</h1>
                    <p className="text-slate-500 mt-2 max-w-xl">Bem-vindo ao painel de inteligência do recrutamento Paideia. Monitore KPIs, distribuição geográfica e o funil de talentos.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-tighter">Status Cloud</span>
                        <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div> Sincronizado
                        </div>
                    </div>
                    <div className="h-12 w-px bg-slate-200 hidden sm:block"></div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-slate-400" />
                        <div className="text-xs">
                            <span className="block font-bold text-slate-900">{format(new Date(), "dd 'de' MMMM", { locale: ptBR })}</span>
                            <span className="text-slate-400">Última atualização: {format(new Date(), "HH:mm")}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Volume de Inscrições"
                    value={stats.totalApps}
                    icon={Users}
                    suffix="total"
                    trend={{ value: stats.recentApps, label: "novos / 7 dias" }}
                    color="amber"
                />
                <MetricCard
                    title="Licenciatura / Bachar."
                    value={stats.licenciados}
                    icon={BookOpen}
                    suffix="autores"
                    trend={{ value: (stats.totalApps > 0 ? (stats.licenciados / stats.totalApps) * 100 : 0).toFixed(0) + "%", label: "do total" }}
                    color="slate"
                />
                <MetricCard
                    title="Pedagogos"
                    value={stats.pedagogos}
                    icon={GraduationCap}
                    suffix="especialistas"
                    trend={{ value: (stats.totalApps > 0 ? (stats.pedagogos / stats.totalApps) * 100 : 0).toFixed(0) + "%", label: "do total" }}
                    color="emerald"
                />
                <MetricCard
                    title="Estados Alcancados"
                    value={Object.keys(stats.stateCounts).length}
                    icon={MapPin}
                    suffix="UFs"
                    trend={{ value: stats.topStates[0]?.[0] || '---', label: "líder regional" }}
                    color="blue"
                />
            </div>

            {/* Main Charts Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Evolution & Funnel */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Funil de Conversão</h3>
                                <p className="text-sm text-slate-500">Acompanhamento das etapas do processo</p>
                            </div>
                            <Target className="h-6 w-6 text-slate-300" />
                        </div>
                        <div className="h-[350px]">
                            <StatusChart data={stats.statusData} />
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Distribuição Regional</h3>
                                <p className="text-sm text-slate-500">Visualização de calor por densidade</p>
                            </div>
                            <Link href="/admin/map" className="text-amber-600 text-xs font-bold hover:underline flex items-center gap-1">
                                Ver mapa completo <ArrowUpRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="h-[400px]">
                            <BrazilHeatmapExtended data={stats.stateCounts} />
                        </div>
                    </div>
                </div>

                {/* Side Insights */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="bg-slate-900 p-8 rounded-2xl shadow-xl text-white">
                        <h3 className="text-lg font-bold mb-6 border-b border-white/10 pb-4">Mix de Formação</h3>
                        <div className="h-[300px]">
                            <ProfilePieChart data={stats.profileData} />
                        </div>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-amber-500"></div> Licenciados</span>
                                <span className="font-bold">{stats.licenciados}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-slate-400"></div> Pedagogos</span>
                                <span className="font-bold">{stats.pedagogos}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Top Cursos</h3>
                        <div className="space-y-6">
                            {stats.topCourses.map(([course, count], idx) => (
                                <div key={course} className="flex items-center gap-4">
                                    <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-xs font-black text-slate-400 border border-slate-100">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="block text-sm font-bold text-slate-800 truncate">{course}</span>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                                            <div className="bg-amber-500 h-full" style={{ width: `${(count / stats.totalApps) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, suffix, trend, color }: any) {
    const colorStyles: any = {
        amber: "from-amber-500 to-amber-600 shadow-amber-200/50",
        slate: "from-slate-800 to-slate-950 shadow-slate-200/50",
        emerald: "from-emerald-500 to-emerald-600 shadow-emerald-200/50",
        blue: "from-blue-500 to-blue-600 shadow-blue-200/50",
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all group overflow-hidden relative">
            <div className="flex items-start justify-between relative z-10">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colorStyles[color]} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                </div>
                {trend && (
                    <div className="text-right">
                        <span className="block text-sm font-black text-slate-900 leading-none">{trend.value}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-tight">{trend.label}</span>
                    </div>
                )}
            </div>
            <div className="mt-8 relative z-10">
                <span className="block text-xs font-black text-slate-400 uppercase tracking-widest">{title}</span>
                <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">{value}</span>
                    <span className="text-xs font-bold text-slate-400">{suffix}</span>
                </div>
            </div>
            {/* Decals */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
        </div>
    );
}
