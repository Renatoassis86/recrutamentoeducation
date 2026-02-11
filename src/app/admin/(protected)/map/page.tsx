import { createClient } from "@/utils/supabase/server";
import BrazilHeatmapExtended from "@/components/admin/BrazilHeatmapExtended";
import { Map as MapIcon, Info, Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getMapData() {
    const supabase = createClient();
    const { data: applications } = await supabase
        .from("applications")
        .select("state");

    const stateCounts: Record<string, number> = {};
    applications?.forEach(app => {
        if (app.state) {
            const uf = app.state.toUpperCase();
            stateCounts[uf] = (stateCounts[uf] || 0) + 1;
        }
    });

    return stateCounts;
}

export default async function MapPage() {
    const stateCounts = await getMapData();
    const total = Object.values(stateCounts).reduce((a, b) => a + b, 0);

    const sortedStates = Object.entries(stateCounts)
        .sort(([, a], [, b]) => b - a);

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 font-serif flex items-center gap-3">
                        <MapIcon className="h-8 w-8 text-amber-500" /> Distribuição Geográfica
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Análise volumétrica por Unidade Federativa (UF).</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                    <div className="px-4 py-2 text-center border-r border-slate-50">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Total Abrangido</span>
                        <span className="text-sm font-bold text-slate-900">{total} Candidatos</span>
                    </div>
                    <div className="px-4 py-2 text-center">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Estados Ativos</span>
                        <span className="text-sm font-bold text-slate-900">{Object.keys(stateCounts).length} UFs</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Map Column */}
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 relative">
                    <div className="absolute top-10 right-10 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                            <div className="h-3 w-3 bg-amber-500 rounded-full" /> Alta Densidade
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                            <div className="h-3 w-3 bg-amber-100 rounded-full" /> Baixa Densidade
                        </div>
                    </div>
                    <div className="h-[600px] w-full">
                        <BrazilHeatmapExtended data={stateCounts} />
                    </div>
                </div>

                {/* Listing Column */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Users className="h-5 w-5 text-amber-500" /> Ranking por UF
                        </h3>
                        <div className="space-y-4">
                            {sortedStates.map(([uf, count], idx) => (
                                <div key={uf} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-black text-slate-500 w-4">{idx + 1}.</span>
                                        <span className="text-sm font-bold group-hover:text-amber-500 transition-colors uppercase">{uf}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-medium text-slate-400">{((count / total) * 100).toFixed(1)}%</span>
                                        <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-black">{count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100">
                        <h4 className="flex items-center gap-2 text-xs font-black text-amber-800 uppercase tracking-widest mb-4">
                            <Info className="h-4 w-4" /> Insight Geográfico
                        </h4>
                        <p className="text-xs text-amber-700/80 leading-relaxed font-medium">
                            A maior concentração de candidatos licenciados encontra-se na região Nordeste, seguida pelo Sudeste.
                            Use esses dados para direcionar campanhas de comunicação segmentadas por UF no módulo CRM.
                        </p>
                        <Link href="/admin/crm" className="mt-6 inline-flex items-center gap-2 text-xs font-black text-amber-900 border-b border-amber-900/20 pb-1 hover:border-amber-900 transition-all">
                            Ir para CRM <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
