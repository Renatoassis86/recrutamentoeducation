"use client";


import { CheckCircle, Lightbulb, Quote } from "lucide-react";
import { useState } from "react";

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
                            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-900/5 group cursor-pointer transition-transform duration-500 hover:shadow-amber-500/20">
                                <VideoPlayer />
                            </div>
                            <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
                            <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                        </div>

                        {/* Text Content */}
                        <div className="text-lg text-gray-700 leading-8 font-light text-justify space-y-8 animate-fade-in-right">

                            <div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-6 font-serif flex items-center gap-3">
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
                                    <h3 className="text-3xl font-bold text-slate-900 font-serif">Nossa Missão</h3>
                                </div>
                                <p className="text-slate-700 leading-relaxed text-xl font-medium font-serif border-t border-slate-100 pt-6">
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
                                    <h3 className="text-3xl font-bold text-slate-900 font-serif">Nossa Visão</h3>
                                </div>
                                <p className="text-slate-700 leading-relaxed text-xl font-medium font-serif italic border-t border-slate-100 pt-6">
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
    const [isPlaying, setIsPlaying] = useState(false);

    // Video ID: gU00NwWoG8w
    // Thumbnail preview (muted loop) -> Clicking plays with sound and controls

    if (isPlaying) {
        return (
            <iframe
                className="w-full h-full rounded-[2.5rem]"
                src="https://www.youtube.com/embed/gU00NwWoG8w?autoplay=1&start=25&end=40&rel=0"
                title="Cidade Viva Education Institucional"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        );
    }

    return (
        <div className="relative w-full h-full" onClick={() => setIsPlaying(true)}>
            <iframe
                className="w-full h-full pointer-events-none scale-[1.35]" // Zoom in to fill rounded shape nicely without black bars if aspect ratio differs
                src="https://www.youtube.com/embed/gU00NwWoG8w?autoplay=1&mute=1&loop=1&playlist=gU00NwWoG8w&controls=0&start=25&end=40&rel=0"
                title="Cidade Viva Education Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                tabIndex={-1}
            ></iframe>

            {/* Overlay to catch clicks and show play button */}
            <div className="absolute inset-0 bg-black/10 hover:bg-black/30 transition-all duration-300 flex items-center justify-center z-10 group-hover:cursor-pointer">
                <div className="w-24 h-24 bg-amber-600/90 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 animate-pulse group-hover:animate-none ring-4 ring-white/20">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white ml-1">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            {/* Text Overlay */}
            <div className="absolute bottom-8 left-8 right-8">
                <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-md rounded-full text-white text-base font-medium border border-white/20 shadow-lg hover:bg-white/20 transition-colors">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    Assista o vídeo institucional
                </div>
            </div>
        </div>
    );
}
