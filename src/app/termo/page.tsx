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

                        <div className="p-8 md:p-12 space-y-6">
                            <div className="prose prose-lg text-gray-600 max-w-none">
                                <p>
                                    O <strong>Termo de Referência</strong> é o documento que estabelece as bases teóricas, técnicas e pedagógicas para a produção de materiais didáticos do Sistema Cidade Viva Education.
                                </p>
                                <p>
                                    Ele define a identidade visual, a estrutura dos capítulos, a abordagem de conteúdo e os critérios de qualidade que devem ser observados por todos os autores e colaboradores.
                                </p>
                                <p>
                                    A leitura completa e atenta deste documento é <strong>indispensável</strong> para garantir o alinhamento com a proposta educacional cristã clássica e a excelência editorial almejada.
                                </p>
                            </div>
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
