import Link from "next/link";
import { MapPin, Clock, ArrowRight, Instagram, Globe, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0b1222] text-white py-20 font-sans border-t border-white/5">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-16">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Logo */}
                        <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16">
                                <img src="/logo-education.png" alt="Logo" className="object-contain h-full w-full brightness-0 invert" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-serif text-3xl font-bold tracking-tight leading-none">
                                    CIDADE VIVA
                                </span>
                                <span className="text-amber-500 font-serif text-sm font-bold tracking-[0.3em] leading-none mt-1.5 uppercase">
                                    EDUCATION
                                </span>
                            </div>
                        </div>

                        <p className="text-lg text-gray-400 max-w-md leading-relaxed font-light">
                            O Cidade Viva Education é o pilar educacional da Fundação Cidade Viva.
                            Nossa missão é conduzir pessoas ao deslumbramento a partir de uma educação cristã de excelência.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4 pt-2">
                            <a href="https://instagram.com/cidadeviva.education" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-amber-600 transition-all group border border-white/10 hover:border-amber-500 shadow-xl">
                                <Instagram className="h-5 w-5 text-gray-400 group-hover:text-white" />
                            </a>
                            <a href="https://cidadeviva.education/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-blue-600 transition-all group border border-white/10 hover:border-blue-500 shadow-xl">
                                <Globe className="h-5 w-5 text-gray-400 group-hover:text-white" />
                            </a>
                            <a href="https://wa.me/5583993322457" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-green-600 transition-all group border border-white/10 hover:border-green-500 shadow-xl">
                                <Phone className="h-5 w-5 text-gray-400 group-hover:text-white" />
                            </a>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-6">Localização</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 text-gray-400 group">
                                    <MapPin className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1' group-hover:scale-110 transition-transform" />
                                    <div className="text-sm leading-relaxed">
                                        <span className="font-bold block text-white mb-1">Unidade João Pessoa</span>
                                        R. Lourdes Férrer, 191 - Aeroclube<br />
                                        João Pessoa - PB, 58036-630
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 text-gray-400 group">
                                    <Clock className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                                    <div className="text-sm leading-relaxed">
                                        <span className="font-bold block text-white mb-1">Expediente</span>
                                        Segunda a sexta-feira<br />
                                        09h às 18h (Exceto feriados)
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="space-y-8">
                            <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-6">Navegue</h3>
                            <div className="flex flex-col gap-4">
                                {[
                                    { name: 'Institucional', href: '#paideia' },
                                    { name: 'Currículo Paideia', href: '#paideia' },
                                    { name: 'Currículos', href: '#curriculos' },
                                    { name: 'Livraria', href: 'https://livraria.cidadeviva.org', external: true },
                                    { name: 'Plataforma', href: 'https://plataforma.cidadeviva.com.br', external: true },
                                    { name: 'Contato', href: '#contato' },
                                ].map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        target={link.external ? "_blank" : undefined}
                                        className="text-sm text-gray-400 hover:text-white flex items-center justify-between group transition-colors"
                                    >
                                        {link.name}
                                        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-footer */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} Cidade Viva Education. Todos os direitos reservados.</p>
                    <div className="flex items-center gap-6">
                        <a href="https://cidadeviva.org/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">
                            Uma instituição Fundação Cidade Viva
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
