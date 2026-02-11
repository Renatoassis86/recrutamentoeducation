"use client";

export default function WordCloud({ text }: { text: string }) {
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

    return (
        <div className="flex flex-wrap gap-2 items-center justify-center p-6 bg-slate-50/50 rounded-2xl border border-slate-100 min-h-[150px]">
            {sortedWords.map(([word, freq]: any, idx) => (
                <span
                    key={word}
                    style={{
                        fontSize: `${Math.min(1.5, 0.8 + (freq / 5))}rem`,
                        opacity: 0.6 + (idx / 20),
                        color: idx % 2 === 0 ? '#1e293b' : '#f59e0b'
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
