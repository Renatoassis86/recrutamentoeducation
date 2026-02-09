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
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <HeroVideo />
          <div className="absolute inset-0 bg-slate-900/70 z-10" />
        </div>

        <div className="relative z-20 mx-auto max-w-6xl px-6 lg:px-8 text-center animate-fade-in-up flex flex-col items-center">

          <div className="w-full max-w-4xl mx-auto mb-10 animate-fade-in-down">
            <div className="bg-amber-600/90 backdrop-blur-md border border-amber-400/50 rounded-xl p-4 md:p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-4 text-left">
                  <div className="bg-white p-3 rounded-full shadow-lg animate-pulse">
                    <PenTool className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg md:text-xl leading-tight font-serif">Chamada Editorial Aberta</h3>
                    <p className="text-amber-100/90 text-sm md:text-base font-light">Estamos selecionando autores para nosso material didático.</p>
                  </div>
                </div>

                <Link href="/application" className="w-full md:w-auto px-6 py-3 bg-white text-amber-700 font-bold rounded-lg shadow-lg hover:bg-amber-50 active:scale-95 transition-all text-center whitespace-nowrap flex items-center justify-center gap-2">
                  Participar <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold text-amber-500 bg-slate-950/80 border border-amber-500/30 uppercase tracking-widest mb-8 backdrop-blur-sm shadow-xl">
            Sistema Cidade Viva Education
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-serif text-shadow-lg mb-6">
            Transforme a educação <br />
            na sua escola com o <br />
            <span className="text-amber-500">Currículo Paideia</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-100 max-w-2xl mx-auto font-medium text-shadow">
            Cristão, clássico, bilíngue e integral para a formação de alunos com sabedoria e eloquência.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#paideia" className="rounded-full bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl hover:bg-gray-100 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center group min-w-[200px] justify-center">
              Conheça o Paideia
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform text-amber-600" />
            </a>
            <Link href="/application" className="rounded-full bg-amber-600 px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-amber-500 transition-all hover:-translate-y-1 active:translate-y-0 min-w-[200px] text-center border border-amber-500">
              Seja um Autor
            </Link>
          </div>
        </div>
      </section>

      {/* 2. QUEM SOMOS */}
      <section id="quem-somos" className="py-24 bg-white scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-serif">
              Quem Somos
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="flow-root">
            {/* Institutional Video - Floated Right */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-100 aspect-video group mb-8 lg:mb-4 lg:ml-10 lg:w-[500px] float-none lg:float-right">
              <iframe
                className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                src="https://www.youtube.com/embed/gU00NwWoG8w?start=25&end=40"
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

          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            <div className="bg-amber-50 p-10 rounded-2xl border border-amber-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col justify-center h-full group relative overflow-hidden">
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
                <p className="text-amber-900/80 leading-relaxed text-2xl font-serif font-medium">
                  Conduzir pessoas ao deslumbramento a partir de uma educação cristã de excelência.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-10 rounded-2xl border border-slate-200 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col justify-center h-full group relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12">
                <Lightbulb className="w-32 h-32 text-slate-900" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200">
                    <Lightbulb className="h-8 w-8 text-slate-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 font-serif">Nossa Visão</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-2xl font-serif font-medium">
                  &quot;Ser uma ponte que resgata presentes do passado, educando mentes e corações para a contemplação, a virtude, o serviço e a glória de Deus.&quot;
                </p>
              </div>
            </div>
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
            <div className="prose prose-lg prose-slate text-gray-700 text-justify leading-loose">
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-100 aspect-video group">
                <iframe
                  className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                  src="https://www.youtube.com/embed/SXpz1uvfn-k"
                  title="Fundamentos do Currículo Paideia"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-center text-sm font-medium text-slate-500 uppercase tracking-widest mt-4">
                Conheça os fundamentos do Currículo Paideia
              </p>
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

      {/* 5. CHAMADA EDITORIAL & TERMO */}
      <section id="chamada" className="py-24 bg-amber-50/30 border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold mb-6 animate-pulse uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            Em Andamento
          </div>

          <div className="flex flex-col gap-6 mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl leading-tight font-serif">
              Chamada Editorial para Prospecção de Autores
            </h2>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-sm uppercase tracking-wide mb-1">
                    <FileText className="h-4 w-4" />
                    Documento Oficial
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif">Chamada Editorial</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Este documento apresenta as diretrizes para a prospecção e seleção de autores para o desenvolvimento de material didático do Sistema Cidade Viva Education. A leitura deste documento é obrigatória para a candidatura.
                  </p>
                </div>

                <a
                  href="https://drive.google.com/file/d/1j1Me5cD6pBPZxgLOicaIF81tdIq6mD4q/view?usp=drive_link"
                  target="_blank"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-amber-600 text-white rounded-lg font-bold shadow-md hover:bg-amber-700 transition-all hover:-translate-y-1 whitespace-nowrap group w-full md:w-auto justify-center"
                >
                  <Download className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  BAIXAR CHAMADA
                </a>
              </div>
            </div>

            <div id="termo" className="bg-blue-50 border border-blue-100 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300 scroll-mt-24">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-sm uppercase tracking-wide mb-1">
                    <FileText className="h-4 w-4" />
                    Documento Técnico
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif">Termo de Referência</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Acesse o detalhamento técnico do projeto, incluindo escopo dos serviços, especificações dos materiais e cronograma de entregas. Documento essencial para a compreensão do trabalho autoral.
                  </p>
                </div>

                <a
                  href="https://drive.google.com/file/d/13gUkXVUiqCCikRvC263xxkm2MYXeQpxb/view?usp=sharing"
                  target="_blank"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all hover:-translate-y-1 whitespace-nowrap group w-full md:w-auto justify-center"
                >
                  <Download className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  BAIXAR TERMO
                </a>
              </div>
            </div>
          </div>

          <p className="text-xl text-gray-600 leading-relaxed mb-8 border-l-4 border-amber-500 pl-6 font-light">
            O Sistema Cidade Viva Education torna público o processo seletivo para composição de Banco de Talentos de autoria didática. Buscamos profissionais licenciados e pedagogos alinhados à cosmovisão cristã.
          </p>

          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 mb-10 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-slate-900 font-bold mb-3 uppercase text-xs tracking-wider border-b border-slate-200 pb-2">Perfis Solicitados</h4>
                <ul className="text-gray-600 text-sm list-disc pl-5 space-y-2">
                  <li><strong>Licenciados:</strong> Língua Portuguesa, Matemática, História, Geografia, Ciências, Arte.</li>
                  <li><strong>Pedagogos:</strong> Ensino Fundamental Anos Iniciais.</li>
                </ul>
              </div>
              <div>
                <h4 className="text-slate-900 font-bold mb-3 uppercase text-xs tracking-wider border-b border-slate-200 pb-2">Etapas de Seleção</h4>
                <ul className="text-gray-600 text-sm list-disc pl-5 space-y-2">
                  <li>Inscrição online no sistema.</li>
                  <li>Análise de currículo e documentação.</li>
                  <li>Avaliação da Escrita Autoral.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <Link
              href="/application"
              className="flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-xl font-bold text-xl hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto"
            >
              <PenTool className="h-6 w-6" />
              QUERO ME INSCREVER
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
