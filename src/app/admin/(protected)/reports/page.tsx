import { getApplications } from "../../actions";
import { Download, BarChart3, PieChart, TrendingUp, Filter, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
    const apps = await getApplications();

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 font-serif flex items-center gap-3">
                        <BarChart3 className="h-8 w-8 text-amber-500" /> Relatórios & BI
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Extração de dados e análise de performance do processo seletivo.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="h-12 px-6 bg-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
                        <Filter className="h-4 w-4" /> Ver Filtros
                    </button>
                    <button className="h-12 px-6 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2">
                        <Download className="h-4 w-4 text-amber-500" /> Exportar CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ReportCard
                    title="Relatório Consolidado"
                    desc="Todos os candidatos com campos principais e status atual."
                    icon={FileText}
                    count={apps.length}
                />
                <ReportCard
                    title="Performance de Avaliação"
                    desc="Média de notas por avaliador e tempo médio de correção."
                    icon={TrendingUp}
                    count={0}
                    disabled
                />
                <ReportCard
                    title="Funil de Conversão"
                    desc="Taxa de passagem entre fases do Pipeline Kanban."
                    icon={PieChart}
                    count={7}
                />
            </div>

            {/* Placeholder for real tables */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-12 text-center">
                <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="h-10 w-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Módulo de Business Intelligence</h3>
                <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
                    Personalize seus relatórios arrastando colunas ou selecione um dos templates acima para exportação imediata.
                </p>
            </div>
        </div>
    );
}

function ReportCard({ title, desc, icon: Icon, count, disabled }: any) {
    return (
        <div className={`p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all group ${disabled ? 'opacity-50 grayscale' : 'hover:shadow-xl hover:border-amber-200'}`}>
            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-amber-50 transition-colors">
                <Icon className="h-6 w-6 text-slate-400 group-hover:text-amber-500" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">{desc}</p>
            <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{count} Registros</span>
                <button disabled={disabled} className="text-amber-600 font-black text-[10px] uppercase tracking-widest hover:underline disabled:no-underline">
                    Gerar Agora →
                </button>
            </div>
        </div>
    );
}
