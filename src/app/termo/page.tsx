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

                        <div className="space-y-12">
                            {/* SEÇÃO 6 */}
                            <section>
                                <h3 className="font-serif text-slate-900 font-bold mb-4 text-2xl">6. DECLARAÇÃO DE CIÊNCIA E ALINHAMENTO EDITORIAL</h3>
                                <p className="mb-4">Declaro que:</p>
                                <ul className="list-disc pl-5 space-y-2 mb-4">
                                    <li>Tenho ciência de que os projetos editoriais do Sistema Cidade Viva Education integram o Currículo Paideia, fundamentado na educação cristã clássica e na formação integral da pessoa humana;</li>
                                    <li>Compreendo que esta manifestação de interesse não garante contratação, nem gera direito subjetivo à participação em projetos editoriais;</li>
                                    <li>Estou ciente de que eventual participação ocorrerá apenas mediante convite formal e contratação específica;</li>
                                    <li>Comprometo-me, caso venha a ser contratado(a), a produzir materiais didáticos alinhados às diretrizes pedagógicas, editoriais e institucionais do Sistema Cidade Viva Education.</li>
                                </ul>
                                <p className="font-semibold">( ) Declaro ciência e concordância</p>
                            </section>

                            {/* SEÇÃO 7 */}
                            <section>
                                <h3 className="font-serif text-slate-900 font-bold mb-4 text-2xl">7. ENVIO DE DOCUMENTAÇÃO (ARQUIVO ÚNICO – PDF)</h3>
                                <p className="mb-4">O participante deverá anexar <strong>UM ÚNICO ARQUIVO EM FORMATO PDF</strong>, contendo, na ordem indicada:</p>
                                <ol className="list-decimal pl-5 space-y-2 mb-4">
                                    <li>Currículo acadêmico-profissional atualizado (preferencialmente Currículo Lattes);</li>
                                    <li>Documentos comprobatórios de formação acadêmica;</li>
                                    <li>Documentos comprobatórios de experiência profissional, quando houver;</li>
                                    <li>Atestado de capacidade técnica, conforme modelo (Anexo VI);</li>
                                    <li>Escrita autoral manuscrita, conforme orientações abaixo.</li>
                                </ol>
                                <p className="mb-4 text-red-600 font-medium">
                                    O envio de documentos fora da ordem, em arquivos separados ou por meios diversos dos oficialmente indicados poderá resultar na desconsideração da manifestação de interesse.
                                </p>
                            </section>

                            {/* SEÇÃO 8 */}
                            <section>
                                <h3 className="font-serif text-slate-900 font-bold mb-4 text-2xl">8. ESCRITA AUTORAL (MANUSCRITA)</h3>

                                <div className="mb-6">
                                    <h4 className="font-bold text-lg mb-2">8.1. Tema da Escrita Autoral</h4>
                                    <p className="italic bg-gray-50 p-4 border-l-4 border-amber-500">
                                        “O que você entende por educação cristã, clássica e integral na área do conhecimento escolhida? Em sua perspectiva, o que um material didático dessa área precisa contemplar para ser excelente?”
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <h4 className="font-bold text-lg mb-2">8.2. Forma de Produção</h4>
                                    <p className="mb-2">A escrita autoral deverá:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Ser escrita integralmente à mão, pelo próprio participante;</li>
                                        <li>Ser produzida em papel, de forma legível;</li>
                                        <li>Ser digitalizada (escaneada ou fotografada com qualidade adequada);</li>
                                        <li>Integrar o arquivo PDF único enviado no formulário.</li>
                                    </ul>
                                </div>

                                <div className="mb-6">
                                    <h4 className="font-bold text-lg mb-2">8.3. Critérios Obrigatórios</h4>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Texto dissertativo;</li>
                                        <li>Extensão mínima de 20 (vinte) linhas e máxima de 40 (quarenta) linhas;</li>
                                        <li>Estrutura com introdução, desenvolvimento e conclusão;</li>
                                        <li>Clareza, coesão, coerência textual;</li>
                                        <li>Domínio da norma culta da língua portuguesa;</li>
                                        <li>Adequação didática ao Ensino Fundamental;</li>
                                        <li>Aderência à proposta pedagógica e editorial institucional.</li>
                                    </ul>
                                </div>

                                <div className="mb-6">
                                    <h4 className="font-bold text-lg mb-2">8.4. DA AUTORALIDADE E DO USO DE INTELIGÊNCIA ARTIFICIAL</h4>
                                    <p className="mb-2">
                                        A escrita autoral deverá ser produzida exclusivamente pelo participante, sendo vedada a utilização de ferramentas de inteligência artificial generativa, em qualquer etapa do processo, inclusive para redação, estruturação, reformulação ou revisão do texto.
                                    </p>
                                    <p className="mb-2">
                                        O material submetido poderá ser analisado por meio de ferramentas de verificação de originalidade e detecção de uso de IA.
                                    </p>
                                    <p>
                                        A constatação de uso indevido desses recursos poderá resultar na desconsideração da manifestação de interesse, sem prejuízo de eventuais medidas cabíveis nos termos da legislação vigente.
                                    </p>
                                </div>
                            </section>

                            {/* SEÇÃO 9 */}
                            <section>
                                <h3 className="font-serif text-slate-900 font-bold mb-4 text-2xl">9. DECLARAÇÃO FINAL</h3>
                                <p className="mb-4">
                                    Declaro que as informações prestadas neste formulário são verdadeiras e estou ciente de que informações falsas, incompletas ou inconsistentes poderão resultar na desconsideração desta manifestação de interesse, a qualquer tempo.
                                </p>
                            </section>

                            {/* ANEXOS */}
                            <section className="pt-8 border-t border-gray-200">
                                <h3 className="font-serif text-slate-900 font-bold mb-6 text-2xl text-center">ANEXOS</h3>

                                <div className="space-y-8">
                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                        <h4 className="font-bold text-lg mb-4 text-center">ANEXO II - DECLARAÇÃO DE CIÊNCIA DA NATUREZA PRIVADA DA CHAMADA</h4>
                                        <p className="mb-4">
                                            Declaro que tenho ciência de que a Chamada Editorial para Prospecção de Autores do Sistema Cidade Viva Education possui natureza exclusivamente privada, não se caracterizando como edital público, chamamento público nos termos da Lei nº 13.019/2014, procedimento licitatório ou qualquer modalidade prevista em legislação administrativa.
                                        </p>
                                        <p>
                                            Declaro, ainda, que compreendo que minha participação não gera direito subjetivo à contratação, expectativa de convocação ou exclusividade, constituindo-se apenas como manifestação de interesse editorial.
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                        <h4 className="font-bold text-lg mb-4 text-center">ANEXO III - DECLARAÇÃO DE DISPONIBILIDADE</h4>
                                        <p>
                                            Declaro que possuo disponibilidade para, caso venha a ser convidado(a), participar de projetos editoriais do Sistema Cidade Viva Education, cumprindo prazos, etapas e entregas que venham a ser definidos contratualmente.
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                        <h4 className="font-bold text-lg mb-4 text-center">ANEXO IV - DECLARAÇÃO DE CIÊNCIA SOBRE DIREITOS AUTORAIS</h4>
                                        <p className="mb-4">
                                            Declaro que estou ciente de que eventual participação em projetos editoriais do Sistema Cidade Viva Education será formalizada por meio de Contrato de Prestação de Serviços por Obra Certa, no qual constarão as disposições relativas à cessão patrimonial total dos direitos autorais, nos termos da Lei nº 9.610/1998.
                                        </p>
                                        <p>
                                            Declaro, ainda, que compreendo que não há cessão antecipada de direitos autorais nesta fase, constituindo-se esta declaração apenas como ciência prévia das condições editoriais que regerão eventual contratação.
                                        </p>
                                    </div>
                                </div>
                            </section>
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
