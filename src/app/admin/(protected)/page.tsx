import { createClient } from "@/utils/supabase/server";
import {
    Users, BookOpen, GraduationCap, MapPin,
    ArrowUpRight, Zap, Target, BarChart3, Star, ShieldCheck,
    TrendingUp, Calendar, Clock, AlertTriangle
} from "lucide-react";
import { StatusChart, ProfilePieChart, EvolutionChart, ExperienceChart } from "@/components/admin/Charts";
import StateMap from "@/components/admin/StateMap";
import WordCloud from "@/components/admin/WordCloud";
import { format, subDays } from "date-fns";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
    const supabase = await createClient();
    const { data: applications } = await supabase
        .from("applications")
        .select("id, profile_type, state, status, created_at, licensure_area, experience_summary, experience_years, authorial_text_preview");

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
        // PRECISE STATUS MAPPING
        const status = app.status || 'draft';
        statusCounts[status] = (statusCounts[status] || 0) + 1;

        if (app.profile_type === 'licenciado' || app.profile_type === 'pedagogo') {
            profileCounts[app.profile_type]++;
        }
        if (app.licensure_area) {
            areaCounts[app.licensure_area] = (areaCounts[app.licensure_area] || 0) + 1;
        }
        if (app.state) {
            const uf = app.state.trim().toUpperCase();
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

    const experienceCounts: Record<string, number> = {};
    const experienceOrder = ["Até 2 anos", "3 a 5 anos", "6 a 10 anos", "Mais de 10 anos"];

    applications?.forEach(app => {
        if (app.experience_years) {
            experienceCounts[app.experience_years] = (experienceCounts[app.experience_years] || 0) + 1;
        }
    });

    const experienceData = experienceOrder.map(range => ({
        name: range,
        value: experienceCounts[range] || 0
    }));

    const summariesText = applications?.map(a => a.experience_summary).filter(Boolean).join(" ") || "";
    const authorialText = applications?.map(a => a.authorial_text_preview).filter(Boolean).join(" ") || "sem dados autorais";

    // CONSISTENCY LOGIC:
    // Finalized = Any status that is NOT 'draft'
    // Draft = exactly 'draft' or null
    const finalizedTotal = totalApps - (statusCounts['draft'] || 0);
    const draftTotal = statusCounts['draft'] || 0;

    const topStates = Object.entries(stateCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return {
        totalApps,
        statusCounts,
        evolutionData,
        profileData,
        stateCounts,
        topStates,
        topAreas,
        summariesText,
        authorialText,
        experienceData,
        licenciados: profileCounts['licenciado'],
        pedagogos: profileCounts['pedagogo'],
        finalizedTotal,
        draftTotal
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-700">
            {/* Header */}
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

            {/* KPI Grid - NOW CLICKABLE FOR DRILL-DOWN */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <Link href="/admin/candidates?status=finalized">
                    <KPICard
                        title="Submetidas"
                        value={stats.finalizedTotal}
                        icon={ShieldCheck}
                        color="emerald"
                        description="Inscrições concluídas com sucesso"
                    />
                </Link>
                <Link href="/admin/candidates?status=draft">
                    <KPICard
                        title="Incompletas (Rascunhos)"
                        value={stats.draftTotal}
                        icon={Clock}
                        color="amber"
                        description="Candidatos com cadastro inacabado"
                    />
                </Link>
                <Link href="/admin/candidates?profile_type=licenciado">
                    <KPICard
                        title="Base Licenciados"
                        value={stats.licenciados}
                        icon={BookOpen}
                        color="blue"
                        description="Ver apenas perfil de Licenciatura"
                    />
                </Link>
                <Link href="/admin/candidates?profile_type=pedagogo">
                    <KPICard
                        title="Base Pedagogos"
                        value={stats.pedagogos}
                        icon={GraduationCap}
                        color="slate"
                        description="Ver apenas perfil de Pedagogia"
                    />
                </Link>
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

                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 min-h-[500px]">
                        <div className="flex-1">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 px-1 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-amber-500" />
                                Mapa de Inscritos por Estado
                            </h3>
                            <div className="w-full flex items-center justify-center overflow-hidden">
                                <StateMap data={stats.stateCounts} />
                            </div>
                        </div>

                        {/* Top States Sidebar */}
                        <div className="w-full md:w-64 bg-slate-50 rounded-[2.5rem] p-6 border border-slate-100/50">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Top Estados</h4>
                            <div className="space-y-4">
                                {stats.topStates.map(([uf, count]: any) => (
                                    <div key={uf} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-950 shadow-sm group-hover:bg-amber-500 group-hover:border-amber-500 transition-colors">
                                                {uf}
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-600 uppercase">{uf}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-black text-slate-900">{count}</span>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase">Inscritos</span>
                                        </div>
                                    </div>
                                ))}
                                {stats.topStates.length === 0 && (
                                    <p className="text-[10px] text-slate-400 italic">Nenhum dado registrado.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 px-1">Nuvem de Competências</h3>
                            <WordCloud text={stats.summariesText} />
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-4 text-center">Resumo Profissional</p>
                        </div>

                        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-white">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6 px-1">Visão Autoral</h3>
                            <WordCloud text={stats.authorialText} colorMode="dark" />
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-4 text-center opacity-50">Texto Extraído (PDF/Preview)</p>
                        </div>
                    </div>
                </div>

                {/* Right Column Insights */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Experiência Docente</h3>
                        <ExperienceChart data={stats.experienceData} />
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <div className="flex flex-col mb-6">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Distribuição por Status</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Status real do funil de recrutamento</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <StatusMiniCard label="Rascunho" value={stats.statusCounts['draft'] || 0} color="bg-slate-50 text-slate-400" tooltip="Iniciaram mas não enviaram" />
                            <StatusMiniCard label="Recebido" value={stats.statusCounts['received'] || 0} color="bg-blue-50 text-blue-600" tooltip="Inscrições concluídas" />
                            <StatusMiniCard label="Em Análise" value={stats.statusCounts['under_review'] || 0} color="bg-amber-100 text-amber-600" tooltip="Avaliação em progresso" />
                            <StatusMiniCard label="Entrevista" value={stats.statusCounts['interview_invited'] || 0} color="bg-purple-50 text-purple-600" tooltip="Convocados para conversa" />
                            <StatusMiniCard label="Aprovado" value={stats.statusCounts['hired'] || 0} color="bg-green-100 text-green-600" tooltip="Candidatos selecionados" />
                        </div>
                        {/* ALERT FOR INCONSISTENCIES */}
                        {Object.entries(stats.statusCounts).some(([k, v]) => !['draft', 'received', 'under_review', 'hired', 'interview_invited'].includes(k) && v > 0) && (
                            <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                <p className="text-[8px] font-black text-red-700 uppercase">Atenção: Candidatos em estados não mapeados</p>
                            </div>
                        )}
                        <div className="mt-6 pt-6 border-t border-slate-50">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3">Entenda os Estados</h4>
                            <ul className="space-y-2">
                                <li className="text-[10px] text-slate-500 leading-tight"><strong>Rascunho (Incompleto):</strong> Candidatos que preencheram dados básicos mas ainda não enviaram a candidatura final.</li>
                                <li className="text-[10px] text-slate-500 leading-tight"><strong>Recebido (Finalizado):</strong> Inscrições concluídas com sucesso, prontas para triagem.</li>
                                <li className="text-[10px] text-slate-500 leading-tight"><strong>Processo:</strong> Qualquer status após "Recebido" indica que o candidato já está em avaliação ativa.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">Mix de Formação</h3>
                        <ProfilePieChart data={stats.profileData} />
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 px-1 flex items-center justify-between">
                            Ranking por Área
                            <span className="text-[8px] font-bold text-slate-400">Top 4 Áreas</span>
                        </h3>
                        <div className="space-y-5 mt-6">
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
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative h-full">
            <div className={`h-12 w-12 rounded-2xl ${colors[color]} flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110`}>
                <Icon className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">{title}</span>
            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">{value}</span>
                {suffix && <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{suffix}</span>}
            </div>
            <p className="mt-2 text-[10px] font-bold text-slate-500 italic opacity-60 group-hover:opacity-100 transition-opacity">
                {description}
            </p>
        </div>
    );
}

function StatusMiniCard({ label, value, color, tooltip }: any) {
    return (
        <div className={`p-4 rounded-2xl border border-transparent ${color} flex flex-col items-center justify-center text-center shadow-sm group relative`}>
            <span className="text-[10px] font-black uppercase tracking-tighter mb-1">{label}</span>
            <span className="text-xl font-black leading-none">{value}</span>
            {tooltip && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
                    {tooltip}
                </div>
            )}
        </div>
    );
}
