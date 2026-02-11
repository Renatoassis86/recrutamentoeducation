import { createClient } from "@/utils/supabase/server";
import { Users, MapPin, Navigation } from "lucide-react";
import BrazilHeatmapExtended from "@/components/admin/BrazilHeatmapExtended";

export const dynamic = "force-dynamic";

async function getStateStats() {
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

    const totalInscritos = applications?.length || 0;

    return {
        stateCounts,
        totalInscritos
    };
}

export default async function MapPage() {
    const { stateCounts, totalInscritos } = await getStateStats();

    // Sort states for the table
    const sortedStates = Object.entries(stateCounts)
        .sort(([, a], [, b]) => b - a);

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">Inscrições pelo Brasil</h1>
                <p className="text-slate-500">Distribuição geográfica dos candidatos em tempo real.</p>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                        <span className="block text-2xl font-bold text-slate-900">{totalInscritos}</span>
                        <span className="text-sm text-slate-500 font-medium whitespace-nowrap">Total de Inscritos</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <span className="block text-2xl font-bold text-slate-900">{Object.keys(stateCounts).length}</span>
                        <span className="text-sm text-slate-500 font-medium">Estados com Inscritos</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                        <Navigation className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <span className="block text-2xl font-bold text-slate-900">{sortedStates[0]?.[0] || '---'}</span>
                        <span className="text-sm text-slate-500 font-medium">Estado Líder ({sortedStates[0]?.[1] || 0})</span>
                    </div>
                </div>
            </div>

            {/* Map & Table Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Visual Map Section */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Densidade por Estado</h3>
                            <p className="text-xs text-slate-400">Pinte os estados conforme o volume de inscrições.</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400">
                                <div className="h-3 w-3 bg-amber-100 rounded"></div> Baixa
                            </div>
                            <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400">
                                <div className="h-3 w-3 bg-amber-600 rounded"></div> Alta
                            </div>
                        </div>
                    </div>

                    <div className="h-[500px] w-full relative">
                        <BrazilHeatmapExtended data={stateCounts} />
                    </div>
                </div>

                {/* Data Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="bg-slate-50 p-4 border-b border-slate-200">
                        <h3 className="font-bold text-slate-800 text-sm">Ranking por UF</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">UF</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Inscritos</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">%</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {sortedStates.map(([uf, count]) => {
                                    const percentage = totalInscritos > 0 ? (count / totalInscritos) * 100 : 0;
                                    return (
                                        <tr key={uf} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-4 whitespace-nowrap font-bold text-slate-900">{uf}</td>
                                            <td className="px-4 py-4 text-right font-mono text-sm text-amber-600 font-bold">{count}</td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="text-xs text-slate-500">{percentage.toFixed(1)}%</div>
                                                <div className="w-16 h-1 bg-slate-100 rounded-full ml-auto mt-1 overflow-hidden">
                                                    <div
                                                        className="h-full bg-amber-500"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {sortedStates.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-20 text-center text-slate-400 text-sm">Aguardando inscrições...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
