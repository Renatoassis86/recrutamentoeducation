"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface BrazilHeatmapExtendedProps {
    data: { [uf: string]: number };
}

// Improved TILE MAP for better geography approximation
const BR_STATES = [
    { uf: 'RR', r: 0, c: 2 }, { uf: 'AP', r: 0, c: 3 },
    { uf: 'AM', r: 1, c: 0 }, { uf: 'PA', r: 1, c: 2 }, { uf: 'MA', r: 1, c: 3 }, { uf: 'CE', r: 1, c: 4 }, { uf: 'RN', r: 1, c: 5 },
    { uf: 'AC', r: 2, c: 0 }, { uf: 'RO', r: 2, c: 1 }, { uf: 'MT', r: 2, c: 2 }, { uf: 'TO', r: 2, c: 3 }, { uf: 'PI', r: 2, c: 4 }, { uf: 'PB', r: 2, c: 5 }, { uf: 'PE', r: 2, c: 6 },
    { uf: 'MS', r: 3, c: 2 }, { uf: 'GO', r: 3, c: 3 }, { uf: 'DF', r: 3, c: 4 }, { uf: 'BA', r: 3, c: 5 }, { uf: 'AL', r: 3, c: 6 }, { uf: 'SE', r: 3, c: 7 },
    { uf: 'MG', r: 4, c: 4 }, { uf: 'ES', r: 4, c: 5 },
    { uf: 'SP', r: 5, c: 3 }, { uf: 'RJ', r: 5, c: 4 },
    { uf: 'PR', r: 6, c: 3 },
    { uf: 'SC', r: 7, c: 3 },
    { uf: 'RS', r: 8, c: 3 },
];

export default function BrazilHeatmapExtended({ data }: BrazilHeatmapExtendedProps) {
    const maxVal = Math.max(...Object.values(data), 1);

    const getIntensityColor = (count: number) => {
        if (!count) return 'bg-slate-50 border-slate-200 text-slate-300';
        const intensity = count / maxVal;

        if (intensity > 0.8) return 'bg-amber-700 border-amber-800 text-white shadow-lg z-10';
        if (intensity > 0.6) return 'bg-amber-600 border-amber-700 text-white z-10';
        if (intensity > 0.4) return 'bg-amber-500 border-amber-600 text-white';
        if (intensity > 0.2) return 'bg-amber-300 border-amber-400 text-amber-900';
        return 'bg-amber-100 border-amber-200 text-amber-800';
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="relative flex-1 p-4 grid" style={{
                gridTemplateColumns: 'repeat(9, minmax(0, 1fr))',
                gridTemplateRows: 'repeat(10, minmax(0, 1fr))',
                gap: '8px'
            }}>
                {BR_STATES.map((state) => {
                    const count = data[state.uf] || 0;
                    const colorClasses = getIntensityColor(count);

                    return (
                        <div
                            key={state.uf}
                            role="contentinfo"
                            aria-label={`${state.uf}: ${count} candidatos`}
                            style={{
                                gridColumnStart: state.c + 1,
                                gridRowStart: state.r + 1
                            }}
                            className={cn(
                                "relative group flex flex-col items-center justify-center rounded-xl border transition-all duration-300 hover:scale-110 hover:rotate-3 shadow-sm cursor-default",
                                colorClasses
                            )}
                        >
                            <span className="text-sm font-black">{state.uf}</span>
                            {count > 0 && <span className="text-[10px] font-bold opacity-80">{count}</span>}

                            {/* Detailed Tooltip */}
                            <div className="absolute opacity-0 group-hover:opacity-100 -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap z-50 pointer-events-none shadow-xl transition-all">
                                {state.uf}: {count} Inscrições
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-700"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Muito Alta</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Média-Alta</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-300"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Baixa-Média</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-100"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Mínima</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-100"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Nenhuma</span>
                </div>
            </div>
        </div>
    );
}
