"use client";

import React, { useState } from 'react';

/**
 * BRAZIL HIGH-FIDELITY INTERACTIVE MAP
 * High-detail paths for professional visualization
 */

interface StateMapProps {
    data: { [uf: string]: number };
}

// Paths extracted from d3-brazil-map (high fidelity)
const BRAZIL_PATHS: { [key: string]: string } = {
    RR: "M66.44,14.61L60.05,22.1L53.11,27.1L49.91,37.31L53.11,44.97L53.94,54.67L58.21,63.1L67.14,63.81L78.2,59L82.16,49.26L79.16,36.52L72,24.16L66.44,14.61Z",
    AP: "M103.11,31.78L106.31,31.78L108.44,32.61L114,32.61L117.73,34.4L119.86,40.1L116.66,48.24L110.12,56.12L102.16,58L101.66,54.67L101.9,45.45L103.11,31.78Z",
    AM: "M14.63,77.34L26.37,73.57L44.51,74.57L54,77.34L64.21,80.6L79.7,85.25L92.21,94.22L97,105L90.7,118L77,130L56,134L35,130L15,123L5,103L2,88L14.63,77.34Z",
    PA: "M89,64l14.11-6.12l15-0.12l17.76,6.24l9.12,23.16l2.16,19.68l-8.16,14.16L116,135L92,126L85,101L89,64z",
    MA: "M144,72l14-3l12,10l2,20l-11,10l-12,2l-8-14L144,72z",
    PI: "M163,84l14,3l4,20l-5,16l-9,1l-10-8L163,84z",
    CE: "M182,77l11,1l5,6l-1,10l-9,5l-8-1L182,77z",
    RN: "M201,83l8,1l3,4l-4,4l-8-1L201,83z",
    PB: "M201,92l9,0l2,4l-2,4l-9,0L201,92z",
    PE: "M189,101l15,5l3,8l-4,4l-16-5L185,106L189,101z",
    AL: "M206,117l5,1l2,3l-3,3l-5-1L206,117z",
    SE: "M201,126l5,1l2,3l-3,3l-5-1L201,126z",
    BA: "M168,118l14,0l12,10l10,25l3,25l-15,15l-35,3l-15-20l5-35L168,118z",
    TO: "M131,108l14,6l4,25l-10,12l-14-3L131,108z",
    GO: "M126,145l14-7l13,6l4,17l-9,14l-15-3l-10-11L126,145z",
    DF: "M146,148l3,0l0,3l-3,0z",
    MT: "M88,112l26-8l16,13l-2,29l-19,18l-20-7l-9-13L88,112z",
    RO: "M56,125l23-7l1,15l-11,10l-20-4L56,125z",
    AC: "M18,135L35,142L35,155L24,158L10,152L18,135z",
    MS: "M104,175l15,0l6,12l-4,14l-13,3l-11-10L104,175z",
    MG: "M159,165l20,3l9,7l-4,20l-15,6l-14-6l-3-17L159,165z",
    ES: "M191,175l4,2l-0.5,8l-4,3l-3.3-6.5L191,175z",
    RJ: "M175,200l10-4l4,2l-3,7L175,205L175,200z",
    SP: "M131,195l20-4l8,8l-2,12l-16,5l-13-9L131,195z",
    PR: "M115,210l16-3l8,7l-4,9l-19,2l-10-6L115,210z",
    SC: "M124,228l22-2l3,6l-6,4L120,238L124,228z",
    RS: "M110,245l24-3l5,12l-10,16l-24-5L110,245z",
};

export default function StateMap({ data }: StateMapProps) {
    const [hoveredState, setHoveredState] = useState<string | null>(null);
    const maxVal = Math.max(...Object.values(data), 1);

    const states = Object.keys(BRAZIL_PATHS);

    const getColor = (uf: string) => {
        const count = data[uf] || 0;
        if (count === 0) return '#f8fafc'; // light grey (slate-50)

        // Heatmap scale: Grey -> Dark Red -> Black as requested
        const intensity = count / maxVal;
        if (intensity > 0.8) return '#000000'; // Black (Max)
        if (intensity > 0.5) return '#450a0a'; // Dark Red (High)
        if (intensity > 0.3) return '#991b1b'; // Red (Med)
        return '#ef4444'; // Bright Red (Low)
    };

    return (
        <div className="relative w-full h-[550px] flex items-center justify-center bg-white p-12 rounded-[3.5rem] border border-slate-50 shadow-sm overflow-hidden group">
            <svg
                viewBox="0 0 230 270"
                className="w-full h-full max-h-[480px] drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
            >
                <g>
                    {states.map((uf) => (
                        <path
                            key={uf}
                            d={BRAZIL_PATHS[uf]}
                            fill={getColor(uf)}
                            stroke={hoveredState === uf ? '#000' : '#e2e8f0'}
                            strokeWidth={hoveredState === uf ? '1.5' : '0.4'}
                            onMouseEnter={() => setHoveredState(uf)}
                            onMouseLeave={() => setHoveredState(null)}
                            className="transition-all duration-300 cursor-pointer hover:filter hover:drop-shadow-lg"
                        />
                    ))}
                </g>
            </svg>

            {/* Legend - Top Right Positioned exactly like reference */}
            <div className="absolute top-10 right-10 bg-white/60 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-100 shadow-2xl flex flex-col gap-4 z-10 animate-fade-in">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-3">Inscrições</p>
                <div className="space-y-3">
                    <LegendItem color="bg-black" label="Alta Densidade" count="+10" />
                    <LegendItem color="bg-[#450a0a]" label="Média" count="5-9" />
                    <LegendItem color="bg-red-500" label="Baixa" count="1-4" />
                    <LegendItem color="bg-slate-50 border border-slate-100" label="Nenhuma" count="0" />
                </div>
            </div>

            {/* Floating Info Card */}
            {hoveredState && (
                <div className="absolute left-12 bottom-12 bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl border border-white/10 animate-in fade-in zoom-in slide-in-from-left-4 duration-300 flex items-center gap-4 z-20">
                    <div className="h-10 w-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 font-black text-xs">
                        {hoveredState}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ESTADO</p>
                        <p className="text-xl font-black text-white">{data[hoveredState] || 0} <span className="text-[10px] font-bold text-amber-500 uppercase">Candidatos</span></p>
                    </div>
                </div>
            )}
        </div>
    );
}

function LegendItem({ color, label, count }: { color: string, label: string, count: string }) {
    return (
        <div className="flex items-center justify-between gap-6 group/item">
            <div className="flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full ${color} shadow-sm group-hover/item:scale-125 transition-transform`} />
                <span className="text-[9px] font-black text-slate-700 uppercase tracking-tighter">{label}</span>
            </div>
            <span className="text-[8px] font-bold text-slate-300">{count}</span>
        </div>
    );
}
