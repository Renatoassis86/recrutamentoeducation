"use client";

import LandingNav from "@/components/layout/LandingNav";
import Link from "next/link";
import { ArrowRight, BookOpen, PenTool, Download, CheckCircle2, Library, GraduationCap, Laptop, BookUser } from "lucide-react";
import Image from "next/image";
import CurriculumAccordion from "@/components/home/CurriculumAccordion";

export default function Home() {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">

      {/* 1. HERO SECTION - Author Focused */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-24 pb-12 lg:pt-16 lg:pb-0">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <iframe
            className="w-full h-full object-cover scale-[2] sm:scale-150 pointer-events-none opacity-90"
            src="https://www.youtube.com/embed/gU00NwWoG8w?autoplay=1&mute=1&controls=0&loop=1&playlist=gU00NwWoG8w&start=25&end=50"
            title="Cidade Viva Education Background"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
          {/* Mobile Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-900/90 z-10" />
        </div>

        <div className="relative z-20 mx-auto max-w-6xl px-6 lg:px-8 text-center animate-fade-in-up flex flex-col items-center">

          <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-amber-400 bg-slate-950/80 border border-amber-500/30 uppercase tracking-widest mb-6 backdrop-blur-sm shadow-xl">
            Chamada Editorial Aberta
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white font-serif text-shadow-lg mb-6 leading-tight">
            Faça parte da construção do <br className="hidden sm:block" />
            <span className="text-amber-500 block sm:inline mt-2 sm:mt-0">Currículo Paideia</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-xl leading-7 sm:leading-8 text-gray-200 max-w-2xl mx-auto font-light text-shadow">
            Estamos selecionando autores licenciados e pedagogos para desenvolver materiais didáticos que integrarão uma educação cristã, clássica e de excelência.
          </p>

          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
            <Link href="/application" className="w-full sm:w-auto cursor-pointer rounded-full bg-amber-600 px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-amber-500 transition-all hover:-translate-y-1 active:translate-y-0 min-w-[200px] text-center border border-amber-500 flex items-center justify-center gap-2">
              <PenTool className="h-5 w-5" />
              QUERO SER UM AUTOR
            </Link>
            <a href="#paideia" className="w-full sm:w-auto rounded-full bg-white/10 backdrop-blur-md px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-white/20 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center group min-w-[200px] justify-center border border-white/20">
              Conheça o Projeto
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform text-amber-500" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. O QUE É O PAIDEIA (Brief Intro) */}
      {/* 2. O QUE É O PAIDEIA (Brief Intro) */}
      <section id="paideia" className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-2 block">Nossa Cosmovisão</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl font-serif mb-6">
              O Propósito do Currículo Paideia
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
            <p className="mt-8 text-xl text-slate-600 max-w-4xl mx-auto font-light leading-relaxed">
              O Paideia não é apenas um material didático, é uma <strong className="text-slate-900 font-medium">proposta educacional coerente</strong>, fundamentada na tradição cristã e no modelo clássico. Nosso objetivo é formar alunos com <span className="text-amber-700 italic font-medium">sabedoria e eloquência</span>, integrando fé e aprendizado em todas as áreas do conhecimento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Library className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 font-serif">Cristão & Clássico</h3>
                <p className="text-slate-600 leading-relaxed">
                  Resgatamos o legado da educação clássica antiga, harmonizando-o com uma robusta cosmovisão cristã reformada para os dias de hoje.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 font-serif">Bilíngue & Integral</h3>
                <p className="text-slate-600 leading-relaxed">
                  Uma formação completa que contempla o desenvolvimento intelectual, moral e espiritual, preparando o aluno para atuar com excelência.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <BookUser className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 font-serif">Autoria Própria</h3>
                <p className="text-slate-600 leading-relaxed">
                  Materiais desenvolvidos por educadores que vivem a nossa filosofia, garantindo profundidade teórica e aplicabilidade prática.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CHAMADA EDITORIAL (CTA Section) */}
      <section className="py-24 bg-amber-100 border-y border-amber-200">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold mb-6 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
            Inscrições Abertas
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl font-serif mb-8">
            Estamos buscando novos autores
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto font-light">
            Se você é licenciado ou pedagogo e deseja contribuir para a transformação da educação cristã no Brasil, queremos conhecer você.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/application"
              className="flex items-center justify-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1 w-full sm:w-auto"
            >
              <PenTool className="h-5 w-5" />
              INICIAR MINHA INSCRIÇÃO
            </Link>
            <a
              href="https://drive.google.com/file/d/1j1Me5cD6pBPZxgLOicaIF81tdIq6mD4q/view?usp=drive_link"
              target="_blank"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all border border-gray-200 shadow-md hover:-translate-y-1 w-full sm:w-auto"
            >
              <Download className="h-5 w-5" />
              Ler Chamada
            </a>
          </div>
        </div>
      </section>

      {/* 4. CONTATO */}
      <section id="contato" className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-serif mb-6">
              Fale Conosco
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              Dúvidas sobre o processo seletivo ou sobre o currículo? <br />Nossa equipe está pronta para atender você.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Address Card */}
            <div className="group flex flex-col items-center text-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/10">
              <div className="p-4 bg-slate-900 rounded-full mb-6 text-amber-500 group-hover:scale-110 transition-transform duration-300 border border-slate-700 group-hover:border-amber-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-serif">Endereço</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                R. Profa. Luzia Simões Bartolini, 100<br />
                Aeroclube, João Pessoa - PB<br />
                <span className="text-amber-500/80 mt-2 block">CEP: 58036-630</span>
              </p>
            </div>

            {/* WhatsApp Card */}
            <a href="https://wa.me/5583993322457" target="_blank" className="group flex flex-col items-center text-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 hover:border-green-500/50 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-900/10 cursor-pointer">
              <div className="p-4 bg-slate-900 rounded-full mb-6 text-green-500 group-hover:scale-110 transition-transform duration-300 border border-slate-700 group-hover:border-green-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-serif">WhatsApp</h3>
              <p className="text-green-400 font-semibold text-lg group-hover:text-green-300 transition-colors">
                (83) 99332-2457
              </p>
              <span className="text-gray-500 text-xs mt-2">Clique para iniciar conversa</span>
            </a>

            {/* Email Card */}
            <a href="mailto:administrativo.education@cidadeviva.org" className="group flex flex-col items-center text-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/10 cursor-pointer">
              <div className="p-4 bg-slate-900 rounded-full mb-6 text-blue-500 group-hover:scale-110 transition-transform duration-300 border border-slate-700 group-hover:border-blue-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-serif">E-mail</h3>
              <p className="text-gray-400 text-sm break-all group-hover:text-white transition-colors">
                administrativo.education@<br />cidadeviva.org
              </p>
            </a>

            {/* Instagram Card */}
            <a href="https://instagram.com/cidadeviva.education" target="_blank" className="group flex flex-col items-center text-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 hover:border-pink-500/50 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-900/10 cursor-pointer">
              <div className="p-4 bg-slate-900 rounded-full mb-6 text-pink-500 group-hover:scale-110 transition-transform duration-300 border border-slate-700 group-hover:border-pink-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-serif">Instagram</h3>
              <p className="text-pink-400 font-medium group-hover:text-pink-300 transition-colors">
                @cidadeviva.education
              </p>
              <span className="text-gray-500 text-xs mt-2">Acompanhe as novidades</span>
            </a>
          </div>
        </div>
      </section>

    </div >
  );
}
