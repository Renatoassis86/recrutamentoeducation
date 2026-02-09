"use client";


import { CheckCircle, Lightbulb, Quote, Play, X } from "lucide-react";
import { useState } from "react";
import { Dialog } from "@headlessui/react";

export default function Institucional() {
    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900 flex flex-col">


            <main className="flex-grow pt-48 pb-24">
                <section className="mx-auto max-w-7xl px-6 lg:px-8">

                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">

                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl font-serif mb-6 relative inline-block">
                            Quem Somos
                            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full opacity-30"></span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed font-light mt-6">
                            Conheça a história, a missão e a visão que fundamentam o Cidade Viva Education.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                        {/* Video Section - Sticky on Desktop */}
                        <div className="w-full relative lg:sticky lg:top-40 animate-fade-in-left">
                            <VideoPlayer />
                            <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
                            <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                        </div>

                        {/* Text Content */}
                        <div className="text-lg text-gray-700 leading-8 font-light text-justify space-y-8 animate-fade-in-right">

                            <div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-amber-500 rounded-full"></span>
                                    Nossa História
                                </h3>

                                <p>
                                    Somos o <strong className="text-slate-900 font-medium">Cidade Viva Education</strong>, o pilar educacional da Fundação Cidade Viva, criado com o propósito de impactar o Brasil, promovendo entre os filhos de Deus o que há de mais excelente em educação.
                                </p>
                            </div>

                            <p>
                                Nossa história tem início em 2002, com o início da Igreja Cidade Viva, em uma pequena capela de madeira localizada na Praia do Bessa, em João Pessoa, Paraíba. Em 2004, o pastor Sérgio Queiroz assumiu a liderança daquela comunidade, iniciando, ao lado de sua esposa Samara e de seus filhos, uma nova fase marcada pelo compromisso de viver e servir integralmente ao propósito de Deus.
                            </p>

                            <blockquote className="border-l-4 border-amber-500 pl-6 italic text-slate-600 my-8 py-2 bg-white/50 rounded-r-lg">
                                "Enfrentar os desafios mais profundos da sociedade brasileira foi, desde o princípio, a nossa missão clara."
                            </blockquote>

                            <p>
                                A partir desse compromisso, surgiram os primeiros projetos sociais que, com o tempo, foram ampliados e culminaram na criação do Campus Metropolitano Cidade Viva. Em 2008, visando consolidar e expandir essas ações, especialmente no que diz respeito à captação de recursos, foi instituída a Fundação Cidade Viva, responsável por coordenar toda a ação social desenvolvida pela Cidade Viva.
                            </p>
                            <p>
                                Em 2010, a missão alcançou o campo da educação, com a fundação da <strong>Escola Internacional Cidade Viva</strong>, a primeira escola confessional, bilíngue e integral da Paraíba. Em 2018, foi criada a Faculdade Internacional Cidade Viva, que iniciou suas atividades com o curso de Teologia e, posteriormente, lançou a primeira pós-graduação do país em Educação Cristã Clássica.
                            </p>
                            <p>
                                Foi nesse contexto que, em 2021, nasceu o Cidade Viva Education, como expressão da convicção de que uma educação verdadeiramente excelente é aquela que forma o ser humano em sua totalidade.
                            </p>
                            <p className="font-medium text-slate-900 text-xl border-b-2 border-amber-500/30 pb-2 inline-block">
                                Com mais de 15 anos de experiência, seguimos servindo para transformar gerações e glorificar a Deus.
                            </p>
                        </div>
                    </div>

                    {/* Mission & Vision Cards - Uniform Design */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-32">
                        {/* Mission Card */}
                        <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden flex flex-col justify-between h-full">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-amber-600"></div>
                            <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12 bg-amber-500 rounded-full w-64 h-64 blur-3xl"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl shadow-sm border border-amber-100">
                                        <CheckCircle className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900">Nossa Missão</h3>
                                </div>
                                <p className="text-slate-700 leading-relaxed text-xl font-medium border-t border-slate-100 pt-6">
                                    Conduzir pessoas ao deslumbramento a partir de uma educação cristã de excelência.
                                </p>
                            </div>
                        </div>

                        {/* Vision Card */}
                        <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden flex flex-col justify-between h-full">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                            <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity transform -rotate-12 bg-blue-500 rounded-full w-64 h-64 blur-3xl"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-sm border border-blue-100">
                                        <Lightbulb className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900">Nossa Visão</h3>
                                </div>
                                <p className="text-slate-700 leading-relaxed text-xl font-medium italic border-t border-slate-100 pt-6">
                                    &quot;Ser uma ponte que resgata presentes do passado, educando mentes e corações para a contemplação, a virtude, o serviço e a glória de Deus.&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>


        </div>
    );
}

function VideoPlayer() {
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    return (
        <>
            <div
                className="relative aspect-video w-full rounded-t-[3rem] rounded-b-[10rem] overflow-hidden shadow-2xl bg-slate-900 group cursor-pointer border-4 border-white ring-1 ring-slate-900/5 transform transition-transform duration-500 hover:scale-[1.02] hover:shadow-amber-500/20"
                onClick={() => setIsVideoOpen(true)}
            >
                {/* Background Loop (Zoomed to hide UI) */}
                <div className="absolute inset-0 w-full h-full scale-[2.0] pointer-events-none">
                    <iframe
                        className="w-full h-full opacity-90"
                        src="https://www.youtube.com/embed/gU00NwWoG8w?autoplay=1&mute=1&controls=0&loop=1&playlist=gU00NwWoG8w&start=25&end=40&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&fs=0"
                        title="Cidade Viva Education Preview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        tabIndex={-1}
                    />
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Action Button */}
                <div className="absolute top-8 left-6 z-20">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white pl-3 pr-5 py-2.5 rounded-full flex items-center gap-2 font-bold text-sm shadow-xl transition-all group-hover:bg-blue-500 hover:scale-105 active:scale-95">
                        <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                            <Play className="w-4 h-4 fill-white text-white" />
                        </div>
                        Assista e saiba mais
                    </button>
                </div>
            </div>

            {/* Video Modal */}
            <Dialog open={isVideoOpen} onClose={() => setIsVideoOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl relative">
                        <button
                            onClick={() => setIsVideoOpen(false)}
                            className="absolute top-4 right-4 text-white hover:text-amber-500 z-10 bg-black/50 p-2 rounded-full"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div className="aspect-video w-full">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/gU00NwWoG8w?autoplay=1&rel=0&showinfo=0"
                                title="Cidade Viva Education Institucional"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    );
}
