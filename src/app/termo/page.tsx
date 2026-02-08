import Link from "next/link";
import { Download, ArrowLeft, ClipboardList, Calendar, CheckCircle } from "lucide-react";
import LandingNav from "@/components/layout/LandingNav";

export default function TermoPage() {
    return (
        <div className="bg-white min-h-screen font-sans text-slate-900">

            <main className="pt-24 pb-16">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <div className="mb-8">
                        <Link href="/" className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-500 transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para Home
                        </Link>
                    </div>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
                            <ClipboardList className="h-8 w-8 text-blue-600" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl font-serif mb-4">
                            Termo de Referência
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Diretrizes técnicas e pedagógicas para a produção do material.
                        </p>
                    </div>

                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                            <span className="text-white font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-blue-400" /> Versão 1.0
                            </span>
                            <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded text-white uppercase">Vigente</span>
                        </div>

                        <div className="p-8 prose prose-lg max-w-none text-gray-600 leading-relaxed font-light">
                            <p>
                                O <strong>Termo de Referência Pedagógico-Metodológico</strong> estabelece as diretrizes mínimas para a
                                produção editorial de materiais didáticos do Sistema Cidade Viva Education, no âmbito do Currículo
                                Paideia, destinados aos Anos Iniciais do Ensino Fundamental (2º ao 5º ano).
                            </p>

                            <h3 className="font-serif text-slate-900 font-bold mt-8 mb-4 text-2xl">Apresentação e Finalidade</h3>
                            <p>
                                Este documento tem por finalidade:
                            </p>
                            <ul className="space-y-2 list-none pl-0">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
                                    <span>Orientar tecnicamente a produção das obras didáticas;</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
                                    <span>Definir parâmetros pedagógicos, metodológicos e editoriais mínimos;</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
                                    <span>Estabelecer a organização do trabalho autoral colaborativo;</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
                                    <span>Garantir unidade pedagógica, identidade institucional e qualidade editorial.</span>
                                </li>
                            </ul>

                            <h3 className="font-serif text-slate-900 font-bold mt-8 mb-4 text-2xl">Objeto</h3>
                            <p>
                                Produção de materiais didáticos do Currículo Paideia para o Ensino Fundamental (2º ao 5º ano) nas áreas de:
                                Língua Portuguesa, Matemática, Geografia, História, Ciências e Arte.
                            </p>

                            <h3 className="font-serif text-slate-900 font-bold mt-8 mb-4 text-2xl">Identidade Pedagógica</h3>
                            <p>
                                Os materiais integram o Currículo Paideia, fundamentado na educação cristã clássica. A produção deverá respeitar a cosmovisão cristã, dialogar com a tradição clássica, promover rigor acadêmico e contribuir para a formação integral dos estudantes.
                            </p>
                        </div>

                        <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h4 className="font-bold text-gray-900">Arquivo Completo</h4>
                            </div>
                            <a
                                href="https://drive.google.com/file/d/13gUkXVUiqCCikRvC263xxkm2MYXeQpxb/view?usp=drive_link"
                                target="_blank"
                                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 transition-all hover:-translate-y-1 gap-2 w-full sm:w-auto"
                            >
                                <Download className="h-5 w-5" />
                                Baixar Termo
                            </a>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/application" className="text-blue-600 font-bold hover:underline text-lg">
                            Pronto para começar? Vá para a sua inscrição.
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
