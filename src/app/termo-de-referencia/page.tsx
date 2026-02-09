"use client";

import LandingNav from "@/components/layout/LandingNav";
import Footer from "@/components/layout/Footer";
import { Download, Calendar, Archive, FileText } from "lucide-react";
import Link from "next/link";

export default function TermoReferencia() {
    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col">
            <LandingNav />

            <main className="flex-grow pt-48 pb-24">
                <article className="mx-auto max-w-4xl px-6 lg:px-8">

                    {/* Header */}
                    <header className="mb-12 border-b border-slate-200 pb-12">

                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl font-serif mb-6 leading-tight">
                            Termo de Referência: Especificações Técnicas para Produção Didática
                        </h1>
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Fevereiro 2026
                            </span>
                            <span>•</span>
                            <span className="text-blue-600 font-medium">Especificação Técnica</span>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="prose prose-lg prose-slate text-gray-700 leading-relaxed font-light text-justify max-w-none">
                        <p className="lead text-xl text-slate-800 font-medium mb-8">
                            O Termo de Referência é o guia definitivo que estabelece o padrão de excelência e as diretrizes operacionais para a produção dos materiais didáticos do Sistema Cidade Viva Education.
                        </p>

                        <p>
                            Este documento técnico detalha minuciosamente o escopo dos serviços autorais, desde a concepção pedagógica até a entrega final dos originais. Ele serve como bússola para garantir a unidade curricular e a qualidade editorial em todas as etapas do processo de desenvolvimento.
                        </p>

                        <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4 font-serif">Estrutura e Conteúdo</h3>
                        <p>
                            O documento aborda os pilares fundamentais da produção, incluindo:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 my-6 marker:text-blue-500">
                            <li><strong>Alinhamento Conceitual:</strong> Diretrizes sobre como integrar a cosmovisão cristã e a metodologia clássica ao conteúdo disciplinar.</li>
                            <li><strong>Estrutura do Material:</strong> Especificações técnicas para o Livro do Aluno e o Manual do Professor, definindo seções, boxes e iconografia.</li>
                            <li><strong>Cronograma de Entregas:</strong> Definição clara dos marcos de entrega, prazos de revisão e etapas de validação pedagógica.</li>
                            <li><strong>Padrões de Qualidade:</strong> Indicadores de desempenho e critérios de aceitação para o material produzido.</li>
                        </ul>

                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-10 italic text-slate-700">
                            "A excelência técnica é indissociável da nossa missão educacional. Cada detalhe importa na construção de um currículo que perdura."
                        </div>
                    </div>

                    {/* Action Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-8 animate-fade-in-up">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif">Baixe o Termo de Referência</h3>
                            <p className="text-gray-600 text-sm">
                                Consulte as especificações completas para orientar sua produção autoral.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <a
                                href="https://drive.google.com/file/d/13gUkXVUiqCCikRvC263xxkm2MYXeQpxb/view?usp=sharing"
                                target="_blank"
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all hover:-translate-y-1 w-full md:w-auto min-w-[200px]"
                            >
                                <Download className="h-5 w-5" />
                                Baixar Documento
                            </a>
                        </div>
                    </div>

                </article>
            </main>

            <Footer />
        </div>
    );
}
