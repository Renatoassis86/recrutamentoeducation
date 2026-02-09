"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";
import { useEffect, useState } from "react";
// import confetti from 'canvas-confetti'; // We can add this if we want to be fancy, but stick to CSS/standard for now

export default function SuccessView() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        // Optional: Trigger confetti here if package installed
    }, []);

    return (
        <div className={`max-w-3xl mx-auto text-center py-12 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 md:p-16">
                <div className="flex justify-center mb-8">
                    <div className="rounded-full bg-green-100 p-6 ring-8 ring-green-50 animate-bounce-slow">
                        <CheckCircle2 className="h-20 w-20 text-green-600" />
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight font-serif">
                    Inscrição Recebida!
                </h1>

                <div className="space-y-4 max-w-xl mx-auto">
                    <p className="text-xl text-slate-600 font-medium">
                        Parabéns! Sua candidatura foi enviada com sucesso para nossa equipe.
                    </p>
                    <p className="text-base text-slate-500">

                        Agora é só aguardar as próximas etapas do processo seletivo.
                    </p>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/dashboard"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        Ir para Minha Área
                        <ArrowRight className="h-5 w-5" />
                    </Link>

                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border-2 border-slate-200 transition-colors"
                    >
                        <Home className="h-5 w-5" />
                        Voltar ao Início
                    </Link>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100">
                    <p className="text-sm text-slate-400">
                        Protocolo de envio: <span className="font-mono text-slate-500 font-bold">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                    </p>
                </div>
            </div>

        </div>
    );
}
