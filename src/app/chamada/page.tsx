import Link from "next/link";
import { Download, ArrowLeft, FileText, Calendar, CheckCircle } from "lucide-react";
import LandingNav from "@/components/layout/LandingNav";

export default function ChamadaPage() {
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
                        <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-6">
                            <FileText className="h-8 w-8 text-amber-600" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl font-serif mb-4">
                            Chamada Editorial
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Chamada oficial para seleção de autores do Currículo Paideia.
                        </p>
                    </div>

                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                            <span className="text-white font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-amber-500" /> Publicado em: Fev/2026
                            </span>
                            <span className="bg-amber-500 text-xs font-bold px-2 py-1 rounded text-white uppercase">Aberto</span>
                        </div>

                        <div className="p-8 prose prose-lg max-w-none text-gray-600 leading-relaxed font-light">
                            <p>
                                A <strong>Fundação Cidade Viva</strong> torna público o processo seletivo para autores de material didático do <strong>Sistema de Ensino Cidade Viva Education</strong> (Currículo Paideia). Esta chamada visa identificar e contratar profissionais qualificados para a elaboração de conteúdos educacionais alinhados à cosmovisão cristã e à pedagogia clássica.
                            </p>
                            <h3 className="font-serif text-slate-900 font-bold mt-8 mb-4 text-2xl">Objetivos do Processo</h3>
                            <ul className="space-y-2 list-none pl-0">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                                    <span>Selecionar autores para produção de livros didáticos da Educação Infantil e Ensino Fundamental.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                                    <span>Garantir a excelência acadêmica e a fidelidade aos princípios cristãos.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                                    <span>Formar um banco de talentos para futuras demandas editoriais.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h4 className="font-bold text-gray-900">Documento Completo</h4>
                            </div>
                            <a
                                href="https://drive.google.com/file/d/1j1Me5cD6pBPZxgLOicaIF81tdIq6mD4q/view?usp=drive_link"
                                target="_blank"
                                className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-amber-500 transition-all hover:-translate-y-1 gap-2 w-full sm:w-auto"
                            >
                                <Download className="h-5 w-5" />
                                Baixar Chamada
                            </a>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/application" className="text-amber-600 font-bold hover:underline text-lg">
                            Já leu o edital? Clique aqui para iniciar sua inscrição.
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
