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
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <iframe
            className="w-full h-full object-cover scale-150 pointer-events-none opacity-90"
            src="https://www.youtube.com/embed/gU00NwWoG8w?autoplay=1&mute=1&controls=0&loop=1&playlist=gU00NwWoG8w&start=20&end=50"
            title="Cidade Viva Education Background"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
          <div className="absolute inset-0 bg-slate-900/80 z-10" />
        </div>

        <div className="relative z-20 mx-auto max-w-6xl px-6 lg:px-8 text-center animate-fade-in-up flex flex-col items-center">

          <div className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold text-amber-400 bg-slate-950/80 border border-amber-500/30 uppercase tracking-widest mb-8 backdrop-blur-sm shadow-xl">
            Chamada Editorial Aberta
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-7xl font-serif text-shadow-lg mb-6 leading-tight">
            Faça parte da construção do <br />
            <span className="text-amber-500">Currículo Paideia</span>
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-200 max-w-3xl mx-auto font-light text-shadow">
            Estamos selecionando autores licenciados e pedagogos para desenvolver materiais didáticos que integrarão uma educação cristã, clássica e de excelência.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/application" className="cursor-pointer rounded-full bg-amber-600 px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-amber-500 transition-all hover:-translate-y-1 active:translate-y-0 min-w-[240px] text-center border border-amber-500 flex items-center justify-center gap-2">
              <PenTool className="h-5 w-5" />
              QUERO SER UM AUTOR
            </Link>
            <a href="#paideia" className="rounded-full bg-white/10 backdrop-blur-md px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-white/20 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center group min-w-[200px] justify-center border border-white/20">
              Conheça o Projeto
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform text-amber-500" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. O QUE É O PAIDEIA (Brief Intro) */}
      <section id="paideia" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-serif mb-4">
              O Propósito do Currículo Paideia
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
            <p className="mt-6 text-lg text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              O Paideia não é apenas um material didático, é uma proposta educacional coerente, fundamentada na tradição cristã e no modelo clássico. Nosso objetivo é formar alunos com sabedoria e eloquência, integrando fé e aprendizado em todas as áreas do conhecimento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">Cristão & Clássico</h3>
              <p className="text-gray-600 font-light">Resgatamos o legado da educação clássica sob uma cosmovisão cristã reformada.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">Bilíngue & Integral</h3>
              <p className="text-gray-600 font-light">Formação completa do indivíduo, preparando-o para atuar no mundo com excelência.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">Autoria Própria</h3>
              <p className="text-gray-600 font-light">Materiais desenvolvidos por educadores que vivem e compreendem nossa filosofia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CHAMADA EDITORIAL (CTA Section) */}
      <section className="py-24 bg-amber-50/50 border-y border-amber-100">
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
      <section id="contato" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-serif mb-4">
              Fale Conosco
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Dúvidas sobre o processo seletivo ou sobre o currículo? Entre em contato com nossa equipe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
              <div className="p-4 bg-amber-100 rounded-full mb-6 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-serif">Endereço</h3>
              <p className="text-gray-600 text-sm">
                R. Profa. Luzia Simões Bartolini, 100<br />
                Aeroclube, João Pessoa - PB<br />
                CEP: 58036-630
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
              <div className="p-4 bg-green-100 rounded-full mb-6 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-serif">WhatsApp</h3>
              <p className="text-gray-600 text-sm">
                <a href="https://wa.me/5583993322457" target="_blank" className="hover:text-amber-600 transition-colors">
                  (83) 99332-2457
                </a>
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
              <div className="p-4 bg-blue-100 rounded-full mb-6 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-serif">E-mail</h3>
              <p className="text-gray-600 text-sm">
                <a href="mailto:administrativo.education@cidadeviva.org" className="hover:text-amber-600 transition-colors break-all">
                  administrativo.education@cidadeviva.org
                </a>
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
              <div className="p-4 bg-pink-100 rounded-full mb-6 text-pink-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-serif">Instagram</h3>
              <p className="text-gray-600 text-sm">
                <a href="https://instagram.com/cidadeviva.education" target="_blank" className="hover:text-amber-600 transition-colors">
                  @cidadeviva.education
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

    </div >
  );
}
