import Link from "next/link";
import { CheckCircle2, Lightbulb } from "lucide-react";
import LandingNav from "@/components/layout/LandingNav";

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen font-sans text-slate-900">
            <main className="pt-32 pb-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl font-serif">
                            Quem Somos
                        </h1>
                        <div className="w-24 h-1 bg-amber-500 mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="flow-root">
                        {/* Institutional Video - Floated Right */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-100 aspect-video group mb-8 lg:mb-4 lg:ml-10 lg:w-[500px] float-none lg:float-right">
                            <iframe
                                className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                                src="https://www.youtube.com/embed/gU00NwWoG8w"
                                title="Cidade Viva Education Institucional"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Text Content */}
                        <div className="text-lg text-gray-700 leading-relaxed font-light text-justify">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6 font-serif block">Nossa História</h3>

                            <p className="mb-6">
                                Somos o Cidade Viva Education, o pilar educacional da Fundação Cidade Viva, criado com o propósito de impactar o Brasil, promovendo entre os filhos de Deus o que há de mais excelente em educação.
                            </p>
                            <p className="mb-6">
                                Nossa história tem início em 2002, com o início da Igreja Cidade Viva, em uma pequena capela de madeira localizada na Praia do Bessa, em João Pessoa, Paraíba. Em 2004, o pastor Sérgio Queiroz assumiu a liderança daquela comunidade, iniciando, ao lado de sua esposa Samara e de seus filhos, uma nova fase marcada pelo compromisso de viver e servir integralmente ao propósito de Deus.
                            </p>
                            <p className="mb-6">
                                Desde o princípio, a missão foi clara: enfrentar os desafios mais profundos da sociedade brasileira. A partir desse compromisso, surgiram os primeiros projetos sociais que, com o tempo, foram ampliados e culminaram na criação do Campus Metropolitano Cidade Viva. Em 2008, visando consolidar e expandir essas ações, especialmente no que diz respeito à captação de recursos, foi instituída a Fundação Cidade Viva, responsável por coordenar toda a ação social desenvolvida pela Cidade Viva, em parceria com a igreja e com outras instituições alinhadas aos mesmos princípios.
                            </p>
                            <p className="mb-6">
                                Em 2010, a missão alcançou o campo da educação, com a fundação da Escola Internacional Cidade Viva, a primeira escola confessional, bilíngue e integral da Paraíba. Em 2018, foi criada a Faculdade Internacional Cidade Viva, que iniciou suas atividades com o curso de Teologia e, posteriormente, lançou a primeira pós-graduação do país em Educação Cristã Clássica.
                            </p>
                            <p className="mb-6">
                                Foi nesse contexto que, em 2021, nasceu o Cidade Viva Education, como expressão da convicção de que uma educação verdadeiramente excelente é aquela que forma o ser humano em sua totalidade.
                            </p>
                            <p>
                                Com mais de 15 anos de experiência, seguimos servindo para transformar gerações e glorificar a Deus por meio da educação, nas escolas, nos lares e nas igrejas.
                            </p>
                        </div>
                    </div>

                    {/* Mission & Vision Cards - Below Text/Video */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                        {/* Missão */}
                        <div className="bg-amber-100 p-10 rounded-2xl border border-amber-200 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col justify-center h-full group relative overflow-hidden">
                            <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12">
                                <CheckCircle2 className="w-32 h-32 text-amber-900" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-white rounded-xl shadow-sm border border-amber-100">
                                        <CheckCircle2 className="h-8 w-8 text-amber-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-amber-900 font-serif">Nossa Missão</h3>
                                </div>
                                <p className="text-amber-900/90 leading-relaxed text-2xl font-serif font-medium">
                                    Conduzir pessoas ao deslumbramento a partir de uma educação cristã de excelência.
                                </p>
                            </div>
                        </div>

                        {/* Visão */}
                        <div className="bg-blue-100 p-10 rounded-2xl border border-blue-200 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col justify-center h-full group relative overflow-hidden">
                            <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12">
                                <Lightbulb className="w-32 h-32 text-slate-900" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-white rounded-xl shadow-sm border border-blue-100">
                                        <Lightbulb className="h-8 w-8 text-slate-700" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 font-serif">Nossa Visão</h3>
                                </div>
                                <p className="text-slate-800 leading-relaxed text-2xl font-serif font-medium">
                                    Ser uma ponte que resgata presentes do passado, educando mentes e corações para a contemplação, a virtude, o serviço e a glória de Deus.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Reuse Footer */}
        </div>
    );
}
