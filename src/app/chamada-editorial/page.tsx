"use client";

import { Download, Calendar, ArrowRight, PenTool } from "lucide-react";
import Link from "next/link";

export default function ChamadaEditorial() {
    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900 flex flex-col">

            <main className="flex-grow pt-48 pb-24">
                <article className="mx-auto max-w-4xl px-6 lg:px-8">

                    {/* Header */}
                    <header className="mb-12 border-b border-slate-200 pb-12">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl font-serif mb-6 leading-tight">
                            Chamada Editorial para Prospecção de Autores do Sistema Cidade Viva Education
                        </h1>
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Fevereiro 2026
                            </span>
                            <span>•</span>
                            <span className="text-amber-600 font-medium">Documento Obrigatório</span>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="prose prose-lg prose-slate text-gray-700 leading-relaxed font-light text-justify max-w-none">
                        <p className="lead text-xl text-slate-800 font-medium mb-8">
                            O Sistema Cidade Viva Education torna público o processo seletivo para composição de Banco de Talentos de autoria didática, buscando profissionais comprometidos com a excelência educacional e a cosmovisão cristã.
                        </p>

                        <p>
                            Este documento estabelece as diretrizes fundamentais para a participação no processo de seleção de autores. O objetivo é selecionar educadores licenciados e pedagogos capazes de desenvolver materiais didáticos inovadores, alinhados aos princípios de uma educação cristã clássica e integral.
                        </p>

                        <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4 font-serif">O que você encontrará neste documento?</h3>
                        <p>
                            A Chamada Editorial detalha todo o percurso seletivo, desde os requisitos de candidatura até os critérios de avaliação da produção textual.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 my-6 marker:text-amber-500">
                            <li><strong>Perfis Profissionais:</strong> Licenciatura ou Bacharelado em: Língua Portuguesa, Matemática, História, Geografia, Ciências, Artes ou Música; Licenciatura em Pedagogia.</li>
                            <li><strong>Etapas do Processo:</strong> Cronograma completo, incluindo inscrição, análise curricular e avaliação prática de escrita autoral.</li>
                            <li><strong>Critérios de Seleção:</strong> Parâmetros utilizados pela banca examinadora para avaliar a competência técnica e pedagógica dos candidatos.</li>
                            <li><strong>Direitos e Deveres:</strong> Esclarecimentos sobre a natureza da colaboração e expectativas institucionais.</li>
                        </ul>

                        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-10 italic text-slate-700">
                            "Acreditamos que o material didático não é apenas um recurso pedagógico, mas um instrumento de transformação cultural e formação de caráter."
                        </div>
                    </div>

                    {/* Action Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif">Baixe a Chamada Editorial</h3>
                            <p className="text-gray-600 text-sm">
                                Leia atentamente o documento completo antes de realizar sua inscrição.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <a
                                href="https://drive.google.com/file/d/1j1Me5cD6pBPZxgLOicaIF81tdIq6mD4q/view?usp=drive_link"
                                target="_blank"
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 hover:border-slate-300 transition-all group"
                            >
                                <Download className="h-5 w-5 text-slate-500 group-hover:text-slate-700" />
                                Download PDF
                            </a>
                            <Link
                                href="/application"
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg font-bold shadow-md hover:bg-amber-500 transition-all hover:-translate-y-1"
                            >
                                <PenTool className="h-5 w-5" />
                                Inscrever-se Agora
                            </Link>
                        </div>
                    </div>

                </article>
            </main>


        </div>
    );
}
