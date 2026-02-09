"use client";

import LandingNav from "@/components/layout/LandingNav";
import Link from "next/link";
import {
  ArrowRight, BookOpen, PenTool, Video, Phone, Download, FileText,
  CheckCircle2, Instagram, Globe, GraduationCap, Laptop, BookUser,
  Clock, MapPin, Palette, Music, Microscope, Code2, Anchor, Lightbulb, Library
} from "lucide-react";
import Image from "next/image";
import CurriculumAccordion from "@/components/home/CurriculumAccordion";
import HeroVideo from "@/components/home/HeroVideo";

export default function Home() {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-40 pb-20">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <HeroVideo />
          <div className="absolute inset-0 bg-slate-900/70 z-10" />
        </div>

        <div className="relative z-20 mx-auto max-w-6xl px-6 lg:px-8 text-center animate-fade-in-up flex flex-col items-center">

          <div className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold text-amber-500 bg-slate-950/80 border border-amber-500/30 uppercase tracking-widest mb-8 backdrop-blur-sm shadow-xl">
            Chamada Editorial Aberta
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-serif text-shadow-lg mb-6 max-w-4xl">
            Faça parte da construção do <br />
            <span className="text-amber-500">Currículo Paideia</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-100 max-w-2xl mx-auto font-medium text-shadow">
            Estamos selecionando autores licenciados e pedagogos para desenvolver materiais didáticos que integrarão uma educação cristã, clássica e de excelência.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/application" className="rounded-full bg-amber-600 px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-amber-500 transition-all hover:-translate-y-1 active:translate-y-0 min-w-[200px] text-center border border-amber-500">
              Quero ser um Autor
            </Link>
            <a href="#paideia" className="rounded-full bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl hover:bg-gray-100 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center group min-w-[200px] justify-center">
              Conheça o Projeto
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform text-amber-600" />
            </a>
          </div>
        </div>
      </section>



      {/* 3. CURRÍCULO PAIDEIA (INTRO) */}
      <section id="paideia" className="py-24 bg-amber-50/40 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl border-b-4 border-amber-500 inline-block pb-4 font-serif">
              O que é o Currículo Paideia?
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="prose prose-lg prose-slate text-gray-700 text-justify leading-loose font-montserrat">
              <p>
                O <strong>Paideia</strong> é uma proposta educacional coerente, desenvolvida para escolas comprometidas com a formação plena do aluno. Fundamentado na tradição cristã e no modelo clássico da educação, ele se estrutura sobre quatro eixos inegociáveis: é <strong>cristão, clássico, bilíngue e integral</strong>.
              </p>
              <p>
                Seu conteúdo é composto por livros interdisciplinares que integram Linguagem, Matemática, Humanidades, Ciências, Música, Artes, Educação Tecnológica, além de Inglês e projetos voltados para a formação do caráter.
              </p>
              <p>
                Não se trata de uma metodologia fragmentada, mas de uma <strong>integração real</strong> entre conteúdo, virtude e cultura, conduzida com clareza pedagógica e fidelidade à tradição cristã.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-100 aspect-video group pointer-events-none">
                <iframe
                  className="w-full h-full scale-[1.02]"
                  src="https://www.youtube.com/embed/SXpz1uvfn-k?autoplay=1&mute=1&controls=0&loop=1&playlist=SXpz1uvfn-k&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&fs=0"
                  title="Fundamentos do Currículo Paideia"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                {/* Overlay to prevent interactions */}
                <div className="absolute inset-0 bg-transparent z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.1 COMPONENTES DO PAIDEIA */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl flex items-center justify-center gap-3 font-serif">
              <Library className="h-8 w-8 text-amber-600" />
              O que compõe o Currículo?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-4xl mx-auto font-light">
              Uma estrutura curricular ordenada, onde cada disciplina serve à formação integral do aluno, sem fragmentações.
            </p>
          </div>

          <CurriculumAccordion />
        </div>
      </section>

      {/* 3.2 PILARES ESTRUTURAIS */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-6 hover:bg-slate-50 rounded-2xl transition-colors duration-300">
              <div className="h-16 w-16 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <BookUser className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">Conteúdos Didáticos</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Livros do aluno e do professor com <strong>clareza pedagógica</strong> e <strong>unidade curricular</strong>. Sequências didáticas estruturadas para garantir segurança e intencionalidade formativa no planejamento docente.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 hover:bg-slate-50 rounded-2xl transition-colors duration-300">
              <div className="h-16 w-16 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">Formação Continuada</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Uma formação orgânica ao currículo, essencial para o alinhamento pedagógico institucional. Trilhas profundas para professores e coordenadores, integradas à rotina escolar.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 hover:bg-slate-50 rounded-2xl transition-colors duration-300">
              <div className="h-16 w-16 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Laptop className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">Plataforma Digital</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                A tecnologia a serviço do currículo. Ambiente para organização do ensino, acompanhamento acadêmico e preservação da memória pedagógica da escola.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3.3 BOOK COVERS SHOWCASE */}
      <section className="py-24 bg-amber-50/50 border-y border-amber-100/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-end">
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl hover:-translate-y-2 transition-transform duration-500 bg-white ring-1 ring-black/5 group">
              <Image src="/paideia-2.png" alt="Paideia 2" fill className="object-cover" />
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl hover:-translate-y-2 transition-transform duration-500 bg-white ring-1 ring-black/5 group">
              <Image src="/paideia-3.png" alt="Paideia 3" fill className="object-cover" />
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl hover:-translate-y-2 transition-transform duration-500 bg-white ring-1 ring-black/5 group">
              <Image src="/paideia-4.png" alt="Paideia 4" fill className="object-cover" />
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl hover:-translate-y-2 transition-transform duration-500 bg-white ring-1 ring-black/5 group">
              <Image src="/paideia-5.png" alt="Paideia 5" fill className="object-cover" />
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl hover:-translate-y-2 transition-transform duration-500 bg-white ring-1 ring-black/5 group">
              <Image src="/paideia-1-ano.png" alt="Paideia 1 Ano" fill className="object-cover" />
            </div>
          </div>
          <p className="text-center text-amber-800/60 font-serif italic mt-12 text-sm">
            *Capas ilustrativas da coleção Paideia (Fundamental Anos Iniciais)
          </p>
        </div>
      </section>

      {/* 4. OIKOS SPOTLIGHT SECTION */}
      <section id="oikos" className="py-24 bg-slate-900 text-white overflow-hidden relative font-sans">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Visual Side */}
            <div className="w-full lg:w-4/12 relative order-2 lg:order-1 flex justify-center">
              <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-black border-4 border-slate-800 group">
                <video
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  controls
                  preload="metadata"
                  autoPlay={false}
                  muted
                  loop
                  playsInline
                  poster="/layla_ramos_portrait_1770509608754.png"
                >
                  <source src="/videos/Livro Ingles inf 2.mp4#t=3,10" type="video/mp4" />
                  Seu navegador não suporta a tag de vídeo.
                </video>
              </div>
              <div className="mt-4 md:mt-0 md:absolute md:-bottom-6 md:-right-6 bg-amber-600 text-white p-4 md:p-6 rounded-xl shadow-xl w-full max-w-[320px] md:max-w-xs z-10 text-center md:text-left">
                <p className="font-bold text-lg mb-1">Layla Ramos</p>
                <p className="text-xs text-amber-100 uppercase tracking-wider">Consultora Pedagógica</p>
              </div>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-8/12 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6 border border-amber-500/30">
                <BookOpen className="h-4 w-4" />
                Destaque Editorial
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6 font-serif">
                OIKOS – Inglês | Nível 2
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed font-light">
                Desenvolvido especialmente para famílias educadoras que desejam introduzir a língua inglesa desde a Primeira Infância. Um material estruturado, concreto e adequado à idade de 2 anos, respeitando o ritmo da criança.
              </p>

              <ul className="space-y-4 text-gray-300">
                {[
                  "Introdução à alfabetização em inglês (método fônico).",
                  "Trabalho com sons das letras e vogais.",
                  "Vocabulário concreto: cores, formas, animais.",
                  "Desenvolvimento das 4 habilidades (listening, speaking, reading, writing)."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>



    </div>
  );
}
