"use client";

import LandingNav from "@/components/layout/LandingNav";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, Factory, Lightbulb } from "lucide-react";
import { useState } from "react";

export default function Institucional() {
    return (
        <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900 flex flex-col">
            <LandingNav />

            <main className="flex-grow pt-32 pb-24">
                <section className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        {/* Video Section - Left Side */}
                        <div className="w-full lg:w-1/2">
                            <div className="relative aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-900/5 group cursor-pointer transition-transform hover:scale-[1.02]">
                                <VideoPlayer />
                            </div>
                        </div>

                        {/* Text Content - Right Side */}
                        <div className="w-full lg:w-1/2 text-lg text-gray-700 leading-relaxed font-light text-justify">
                            <div className="mb-8 relative">
                                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl font-serif mb-4">
                                    Quem Somos
                                </h1>
                                <div className="w-24 h-1.5 bg-amber-500 rounded-full"></div>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-800 mb-6 font-serif block">Nossa História</h3>

                            <div className="space-y-6 text-base md:text-lg">
                                <p>
                                    Somos o Cidade Viva Education, o pilar educacional da Fundação Cidade Viva, criado com o propósito de impactar o Brasil, promovendo entre os filhos de Deus o que há de mais excelente em educação.
                                </p>
                                <p>
                                    Nossa história tem início em 2002, com o início da Igreja Cidade Viva, em uma pequena capela de madeira localizada na Praia do Bessa, em João Pessoa, Paraíba. Em 2004, o pastor Sérgio Queiroz assumiu a liderança daquela comunidade, iniciando, ao lado de sua esposa Samara e de seus filhos, uma nova fase marcada pelo compromisso de viver e servir integralmente ao propósito de Deus.
                                </p>
                                <p>
                                    Desde o princípio, a missão foi clara: enfrentar os desafios mais profundos da sociedade brasileira. A partir desse compromisso, surgiram os primeiros projetos sociais que, com o tempo, foram ampliados e culminaram na criação do Campus Metropolitano Cidade Viva. Em 2008, visando consolidar e expandir essas ações, especialmente no que diz respeito à captação de recursos, foi instituída a Fundação Cidade Viva, responsável por coordenar toda a ação social desenvolvida pela Cidade Viva, em parceria com a igreja e com outras instituições alinhadas aos mesmos princípios.
                                </p>
                                <p>
                                    Em 2010, a missão alcançou o campo da educação, com a fundação da Escola Internacional Cidade Viva, a primeira escola confessional, bilíngue e integral da Paraíba. Em 2018, foi criada a Faculdade Internacional Cidade Viva, que iniciou suas atividades com o curso de Teologia e, posteriormente, lançou a primeira pós-graduação do país em Educação Cristã Clássica.
                                </p>
                                <p>
                                    Foi nesse contexto que, em 2021, nasceu o Cidade Viva Education, como expressão da convicção de que uma educação verdadeiramente excelente é aquela que forma o ser humano em sua totalidade.
                                </p>
                                <p className="font-medium text-slate-900">
                                    Com mais de 15 anos de experiência, seguimos servindo para transformar gerações e glorificar a Deus por meio da educação, nas escolas, nos lares e nas igrejas.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mission & Vision Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-24">
                        <div className="bg-amber-50 p-10 rounded-[2.5rem] border border-amber-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col justify-center h-full group relative overflow-hidden">
                            <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12">
                                <CheckCircle2 className="w-48 h-48 text-amber-900" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-amber-100 flex items-center justify-center">
                                        <CheckCircle2 className="h-8 w-8 text-amber-600" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-amber-900 font-serif">Nossa Missão</h3>
                                </div>
                                <p className="text-amber-900/80 leading-relaxed text-2xl font-serif font-medium">
                                    Conduzir pessoas ao deslumbramento a partir de uma educação cristã de excelência.
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col justify-center h-full group relative overflow-hidden">
                            <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12">
                                <Lightbulb className="w-48 h-48 text-slate-900" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center">
                                        <Lightbulb className="h-8 w-8 text-slate-700" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900 font-serif">Nossa Visão</h3>
                                </div>
                                <p className="text-slate-700 leading-relaxed text-2xl font-serif font-medium">
                                    &quot;Ser uma ponte que resgata presentes do passado, educando mentes e corações para a contemplação, a virtude, o serviço e a glória de Deus.&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
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
                className="w-full h-full"
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
            <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors flex items-center justify-center z-10 group-hover:cursor-pointer">
                <div className="w-20 h-20 bg-amber-600/90 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 animate-pulse group-hover:animate-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white ml-1">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            {/* Text Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    Assista o vídeo institucional
                </div>
            </div>
        </div>
    );
}
