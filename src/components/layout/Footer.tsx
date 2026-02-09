import Link from "next/link";
import { MapPin, Clock, ArrowRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0f172a] text-white py-16 font-montserrat border-t border-white/10">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                {/* Left Column */}
                <div>
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="relative h-14 w-14">
                            <img src="/logo-education.png" alt="Logo" className="object-contain h-full w-full brightness-0 invert" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-serif text-2xl font-bold tracking-wide leading-none">
                                CIDADE VIVA
                            </span>
                            <span className="text-amber-500 font-serif text-sm font-bold tracking-[0.2em] leading-none mt-1">
                                EDUCATION
                            </span>
                        </div>
                    </div>

                    <p className="text-sm text-gray-400 mb-8 max-w-md leading-relaxed">
                        Cidade Viva Education é o pilar educacional da Fundação Cidade Viva.
                        Nossa missão é conduzir pessoas ao deslumbramento a partir de uma educação cristã de excelência.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3 text-sm text-gray-300">
                            <MapPin className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="font-bold block text-white mb-0.5">Endereço:</span>
                                R. Lourdes Férrer, 191 - Aeroclube, João Pessoa - PB, 58036-630
                            </div>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-gray-300">
                            <Clock className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="font-bold block text-white mb-0.5">Horário de funcionamento:</span>
                                De segunda a sexta-feira (exceto feriados), das 9h às 18h
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Navegue */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-8">Navegue</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                        {/* Column 1 */}
                        <div className="flex flex-col gap-5">
                            <Link href="#paideia" className="flex items-center justify-between group text-gray-400 hover:text-amber-500 transition-colors font-medium text-sm">
                                Institucional <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </Link>
                            <Link href="#curriculos" className="flex items-center justify-between group text-gray-400 hover:text-amber-500 transition-colors font-medium text-sm">
                                Currículo Biblos <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </Link>
                            <Link href="https://livraria.cidadeviva.org" target="_blank" className="flex items-center justify-between group text-gray-400 hover:text-amber-500 transition-colors font-medium text-sm">
                                Livraria <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </Link>
                            <Link href="#contato" className="flex items-center justify-between group text-gray-400 hover:text-amber-500 transition-colors font-medium text-sm">
                                Contato <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </Link>
                        </div>
                        {/* Column 2 */}
                        <div className="flex flex-col gap-5">
                            <Link href="#paideia" className="flex items-center justify-between group text-gray-400 hover:text-amber-500 transition-colors font-medium text-sm">
                                Currículo Paideia <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </Link>
                            <Link href="#curriculos" className="flex items-center justify-between group text-gray-400 hover:text-amber-500 transition-colors font-medium text-sm">
                                Currículo Oikos <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </Link>
                            <Link href="https://plataforma.cidadeviva.com.br" target="_blank" className="flex items-center justify-between group text-gray-400 hover:text-amber-500 transition-colors font-medium text-sm">
                                Plataforma <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
