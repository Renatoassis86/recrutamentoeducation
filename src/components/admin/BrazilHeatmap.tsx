"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils'; // Make sure you have this utility or adjust import

interface BrazilHeatmapProps {
    data: { [uf: string]: number }; // Map of UF (e.g., 'SP', 'PB') to count
}

// Simplified paths for Brazil states (SVG coordinates)
// Source: Commonly available SVG maps for Brazil. Using a simplified version for performance.
const STATE_PATHS: { [key: string]: string } = {
    AC: "M110.4 207.6l-6.1-3.2-4.1 2.3-5.2-1.2-3.8 2-1.7 4.1 1.7 4.6 6.1 2.9 8.7-2.3 4.4-9.2z",
    AL: "M553.7 206.5l-2.6 3.5 1.5 3.8 4.6 1.7 3.5-2.6-1.2-4.1-5.8-2.3z",
    AP: "M367.4 68.7l2.9 5.8 6.4-1.2 2.3-5.2-4.1-6.4-5.2 2.3-2.3 4.7z",
    AM: "M159.2 122.1l-6.4 2.9-4.1 8.7 2.3 5.2 6.4 1.7 5.2-4.1 2.9-8.1-6.3-6.3z M220 150l-10 10-10-5-5-10 10-15 15 5z", // Simplified placeholder
    BA: "M475 250l10 10 20-5 5-15-10-10-25 20z", // VERY simplified for brevity in this example. Real paths are long.
    CE: "M485 140l5 10 15-5 5-10-10-10-15 15z",
    DF: "M380 300l2 2 2-2-2-2-2 2z",
    ES: "M480 350l5 10 10-5 5-10-10-10-10 15z",
    GO: "M360 300l10 20 20-10 10-20-20-10-20 20z",
    MA: "M400 150l10 20 20 5 10-15-10-15-30 5z",
    MT: "M300 250l20 30 40-10 10-40-30-20-40 40z",
    MS: "M320 350l10 20 30-10 10-30-20-10-30 30z",
    MG: "M450 320l20 30 30-10 10-30-30-20-30 30z",
    PA: "M350 120l30 30 40-10 10-40-30-20-50 40z",
    PB: "M530 180l-5 5-10-2 2-8 8 0 5 5z", // Placeholder
    PR: "M380 400l10 10 20-5 5-10-10-10-25 15z",
    PE: "M520 190l10 5 5-10-10-5-5 10z",
    PI: "M430 180l5 15 15-5 5-10-10-10-15 10z",
    RJ: "M470 370l5 5 10-2 2-8-8-2-9 7z",
    RN: "M525 170l5 5 10-2 2-8-8-2-9 7z",
    RS: "M360 450l10 20 30-5 5-15-10-15-35 15z",
    RO: "M200 250l10 10 20-5 5-10-10-10-25 15z",
    RR: "M220 80l10 10 15-5 5-10-10-10-20 15z",
    SC: "M390 420l5 5 15-2 2-8-8-2-14 7z",
    SP: "M400 360l10 15 20-5 5-15-10-10-25 15z",
    SE: "M540 210l5 5 5-5-5-5-5 5z",
    TO: "M380 220l5 15 10-5 5-15-10-10-10 15z",
};
// NOTE: The paths above are place holders. For a real production app, 
// I would need the full SVG path data for Brazil. 
// However, since I cannot browse to download a 50kb JSON, 
// I will use a functional but geometric abstraction (grid of squares/circles) 
// representing states if real geometry is too large, OR I can use a library if available.
// BUT the user asked for a map.
// Let's use a "Tile Map" approach which is cleaner and very modern.
// It displays states as equal-sized squares arranged roughly geographically.

const TILE_MAP_LAYOUT = [
    { uf: 'RR', x: 2, y: 0 }, { uf: 'AP', x: 3, y: 0 },
    { uf: 'AM', x: 0, y: 1 }, { uf: 'PA', x: 2, y: 1 }, { uf: 'MA', x: 3, y: 1 }, { uf: 'CE', x: 4, y: 1 }, { uf: 'RN', x: 5, y: 1 },
    { uf: 'AC', x: 0, y: 2 }, { uf: 'RO', x: 1, y: 2 }, { uf: 'MT', x: 2, y: 2 }, { uf: 'TO', x: 3, y: 2 }, { uf: 'PI', x: 4, y: 2 }, { uf: 'PB', x: 5, y: 2 },
    { uf: 'MS', x: 2, y: 3 }, { uf: 'GO', x: 3, y: 3 }, { uf: 'BA', x: 4, y: 3 }, { uf: 'PE', x: 5, y: 3 }, { uf: 'AL', x: 6, y: 3 },
    { uf: 'SP', x: 3, y: 4 }, { uf: 'MG', x: 4, y: 4 }, { uf: 'SE', x: 5, y: 4 },
    { uf: 'PR', x: 3, y: 5 }, { uf: 'RJ', x: 4, y: 5 }, { uf: 'ES', x: 5, y: 5 },
    { uf: 'SC', x: 3, y: 6 },
    { uf: 'RS', x: 3, y: 7 },
    { uf: 'DF', x: 3, y: 2.5 }, // Inserted somewhat correctly
];
// Adjusting layout for better visual
const HEX_MAP = [
    { uf: 'RR', r: 0, c: 2 }, { uf: 'AP', r: 0, c: 3 },
    { uf: 'AM', r: 1, c: 0 }, { uf: 'PA', r: 1, c: 2 }, { uf: 'MA', r: 1, c: 3 }, { uf: 'CE', r: 1, c: 4 }, { uf: 'RN', r: 1, c: 5 },
    { uf: 'AC', r: 2, c: 0 }, { uf: 'RO', r: 2, c: 1 }, { uf: 'MT', r: 2, c: 2 }, { uf: 'TO', r: 2, c: 3 }, { uf: 'PI', r: 2, c: 4 }, { uf: 'PB', r: 2, c: 5 },
    { uf: 'MS', r: 3, c: 2 }, { uf: 'GO', r: 3, c: 3 }, { uf: 'DF', r: 3, c: 4 }, { uf: 'BA', r: 3, c: 5 }, { uf: 'PE', r: 2, c: 6 }, { uf: 'AL', r: 3, c: 6 }, { uf: 'SE', r: 3, c: 7 },
    { uf: 'SP', r: 4, c: 3 }, { uf: 'MG', r: 4, c: 4 }, { uf: 'ES', r: 4, c: 5 },
    { uf: 'PR', r: 5, c: 3 }, { uf: 'RJ', r: 5, c: 5 },
    { uf: 'SC', r: 6, c: 3 },
    { uf: 'RS', r: 7, c: 3 },
];
// Wait, the Tile Map is safer and looks very "Dashborady". Let's stick to squares.

const GRID_LAYOUT = [
    { uf: 'RR', row: 1, col: 3 }, { uf: 'AP', row: 1, col: 4 },
    { uf: 'AM', row: 2, col: 1 }, { uf: 'PA', row: 2, col: 3 }, { uf: 'MA', row: 2, col: 4 }, { uf: 'CE', row: 2, col: 5 }, { uf: 'RN', row: 2, col: 6 },
    { uf: 'AC', row: 3, col: 1 }, { uf: 'RO', row: 3, col: 2 }, { uf: 'MT', row: 3, col: 3 }, { uf: 'TO', row: 3, col: 4 }, { uf: 'PI', row: 3, col: 5 }, { uf: 'PB', row: 3, col: 6 },
    { uf: 'MS', row: 4, col: 3 }, { uf: 'GO', row: 4, col: 4 }, { uf: 'DF', row: 4, col: 5 }, { uf: 'BA', row: 4, col: 6 }, { uf: 'PE', row: 3, col: 7 }, { uf: 'AL', row: 4, col: 7 },
    { uf: 'MG', row: 5, col: 5 }, { uf: 'ES', row: 5, col: 6 }, { uf: 'SE', row: 4, col: 8 },
    { uf: 'SP', row: 6, col: 4 }, { uf: 'RJ', row: 6, col: 6 },
    { uf: 'PR', row: 7, col: 4 },
    { uf: 'SC', row: 8, col: 4 },
    { uf: 'RS', row: 9, col: 4 },
];

export default function BrazilHeatmap({ data }: BrazilHeatmapProps) {
    // Find absolute max for scaling color
    const maxVal = Math.max(...Object.values(data), 1);

    const getColor = (count: number) => {
        if (!count) return 'bg-slate-100 text-slate-400 border-slate-200';
        const intensity = count / maxVal;
        if (intensity > 0.8) return 'bg-amber-700 text-white border-amber-800';
        if (intensity > 0.6) return 'bg-amber-600 text-white border-amber-700';
        if (intensity > 0.4) return 'bg-amber-500 text-white border-amber-600';
        if (intensity > 0.2) return 'bg-amber-400 text-white border-amber-500';
        return 'bg-amber-200 text-amber-900 border-amber-300';
    };

    return (
        <div className="relative w-full aspect-[4/3] max-w-lg mx-auto bg-white p-4 rounded-xl shadow-inner border border-slate-100 flex items-center justify-center">
            <div className="grid gap-[2px]" style={{
                gridTemplateColumns: 'repeat(9, minmax(0, 1fr))',
                gridTemplateRows: 'repeat(10, minmax(0, 1fr))'
            }}>
                {GRID_LAYOUT.map((state) => {
                    const count = data[state.uf] || 0;
                    return (
                        <div
                            key={state.uf}
                            className={cn(
                                "aspect-square flex flex-col items-center justify-center rounded-md border text-[10px] font-bold transition-all hover:scale-110 cursor-help relative group",
                                getColor(count)
                            )}
                            style={{
                                gridColumnStart: state.col,
                                gridRowStart: state.row
                            }}
                        >
                            {state.uf}
                            {/* Tooltip */}
                            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-1 bg-slate-900 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10 transition-opacity">
                                {state.uf}: {count} inscritos
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="absolute bottom-2 right-2 flex flex-col gap-1 text-[10px] text-slate-400">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-700 rounded-sm"></div> Alta Densidade</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-400 rounded-sm"></div> Média</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-100 border border-slate-200 rounded-sm"></div> Sem inscritos</div>
            </div>
        </div>
    );
}
