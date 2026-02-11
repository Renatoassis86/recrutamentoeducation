"use client";

import { cn } from "@/lib/utils";

export default function WordCloud({ text, colorMode = 'light' }: { text: string, colorMode?: 'light' | 'dark' }) {
    if (!text) return null;

    // Simple word frequency logic for visualization
    const words = text
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 3) // semi-intelligent filter for stop words
        .reduce((acc: any, word) => {
            acc[word] = (acc[word] || 0) + 1;
            return acc;
        }, {});

    const sortedWords = Object.entries(words)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 15);

    const getWordColor = (idx: number) => {
        if (colorMode === 'dark') {
            return idx % 2 === 0 ? '#f59e0b' : '#fff';
        }
        return idx % 2 === 0 ? '#1e293b' : '#f59e0b';
    };

    return (
        <div className={cn(
            "flex flex-wrap gap-2 items-center justify-center p-6 rounded-2xl min-h-[150px]",
            colorMode === 'dark' ? "bg-white/5 border border-white/10" : "bg-slate-50/50 border border-slate-100"
        )}>
            {sortedWords.map(([word, freq]: any, idx) => (
                <span
                    key={word}
                    style={{
                        fontSize: `${Math.min(1.5, 0.8 + (freq / 5))}rem`,
                        opacity: 0.6 + (idx / 20),
                        color: getWordColor(idx)
                    }}
                    className="font-black uppercase tracking-tighter transition-all hover:scale-110 cursor-default"
                >
                    {word}
                </span>
            ))}
            {sortedWords.length === 0 && <span className="text-xs text-slate-300 font-bold uppercase">Sem dados suficientes</span>}
        </div>
    );
}
