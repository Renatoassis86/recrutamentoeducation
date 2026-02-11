"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * BRAZIL INTERACTIVE MAP - HIGH FIDELITY SVG
 * @backend-specialist
 */

interface StateMapProps {
    data: { [uf: string]: number };
}

// Actual SVG paths for Brazil states (simplified but recognizable)
const STATE_PATHS: { [key: string]: string } = {
    AC: "M20,131 L24,131 L32,135 L33,138 L29,141 L27,150 L20,150 L18,145 L13,143 L12,135 Z",
    AL: "M201,114 L204,115 L206,118 L204,120 L200,121 L199,118 Z",
    AM: "M15,62 L43,59 L73,63 L82,69 L84,87 L75,108 L55,116 L29,111 L23,124 L11,123 L5,103 L1,88 L3,76 Z",
    AP: "M103,34 L114,33 L118,37 L117,44 L109,53 L102,51 L101,42 Z",
    BA: "M163,115 L175,108 L184,115 L186,132 L194,139 L192,154 L175,157 L159,152 L151,139 L153,126 Z",
    CE: "M178,73 L190,73 L195,78 L193,87 L186,92 L180,91 L175,82 Z",
    DF: "M144,142 L147,142 L147,145 L144,145 Z",
    ES: "M184,166 L188,168 L188,175 L183,178 L180,172 Z",
    GO: "M124,138 L138,131 L151,137 L155,154 L146,168 L131,165 L121,154 Z",
    MA: "M141,69 L158,66 L169,76 L168,96 L159,103 L149,101 L139,87 Z",
    MG: "M155,155 L175,158 L184,165 L180,185 L165,191 L151,185 L148,168 L155,165 Z",
    MS: "M105,166 L120,166 L126,178 L122,192 L109,195 L98,185 Z",
    MT: "M84,103 L110,95 L126,108 L124,137 L105,155 L85,148 L76,135 L76,115 Z",
    PA: "M86,60 L103,55 L116,55 L129,66 L138,87 L128,107 L110,94 L85,101 L83,78 Z",
    PB: "M195,89 L204,89 L206,93 L204,97 L194,97 L192,93 Z",
    PE: "M186,93 L203,98 L206,108 L202,112 L185,107 L182,98 Z",
    PI: "M159,81 L176,82 L174,105 L164,113 L152,102 L156,88 Z",
    PR: "M108,197 L124,194 L132,201 L128,210 L109,212 L99,206 Z",
    RJ: "M168,191 L180,186 L184,188 L181,195 L170,195 Z",
    RN: "M195,80 L204,81 L207,85 L203,89 L195,88 Z",
    RO: "M51,118 L74,111 L74,133 L62,143 L42,139 L40,128 Z",
    RR: "M55,30 L73,28 L82,37 L82,54 L65,65 L52,58 L49,42 Z",
    RS: "M102,223 L126,220 L131,232 L121,248 L97,243 L94,229 Z",
    SC: "M110,213 L132,211 L135,217 L129,221 L106,223 Z",
    SP: "M124,182 L144,178 L152,186 L150,198 L134,203 L121,194 Z",
    SE: "M192,125 L197,125 L199,129 L196,133 L191,131 Z",
    TO: "M129,103 L142,109 L142,130 L126,136 L125,115 Z",
};

export default function StateMap({ data }: StateMapProps) {
    const [hoveredState, setHoveredState] = useState<string | null>(null);
    const maxVal = Math.max(...Object.values(data), 1);

    const states = Object.keys(STATE_PATHS);

    const getColor = (uf: string) => {
        const count = data[uf] || 0;
        if (count === 0) return '#f1f5f9'; // slate-100
        const intensity = count / maxVal;

        // Custom amber scale hex values
        if (intensity > 0.8) return '#b45309'; // amber-700
        if (intensity > 0.6) return '#d97706'; // amber-600
        if (intensity > 0.4) return '#f59e0b'; // amber-500
        if (intensity > 0.2) return '#fbbf24'; // amber-400
        return '#fde68a'; // amber-200
    };

    return (
        <div className="relative w-full h-full min-h-[400px] flex items-center justify-center bg-white p-6 rounded-[2rem]">
            <svg
                viewBox="0 0 220 260"
                className="w-full h-full max-h-[500px] drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))' }}
            >
                <g>
                    {states.map((uf) => (
                        <path
                            key={uf}
                            d={STATE_PATHS[uf]}
                            fill={getColor(uf)}
                            stroke={hoveredState === uf ? '#92400e' : '#fff'}
                            strokeWidth={hoveredState === uf ? '1.5' : '0.5'}
                            onMouseEnter={() => setHoveredState(uf)}
                            onMouseLeave={() => setHoveredState(null)}
                            className="transition-all duration-300 cursor-pointer hover:brightness-95"
                        />
                    ))}
                </g>
            </svg>

            {/* Floating Info Box */}
            {hoveredState && (
                <div className="absolute top-10 right-10 bg-slate-900 text-white p-4 rounded-3xl shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-200 z-30">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">{hoveredState}</p>
                    <p className="text-xl font-black">{data[hoveredState] || 0} <span className="text-xs font-bold text-slate-400">Inscrições</span></p>
                </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-6 left-10 flex flex-col gap-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Densidade Regional</p>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-700" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Alta</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-200" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Baixa</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-200" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Nenhuma</span>
                </div>
            </div>
        </div>
    );
}
