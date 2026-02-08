"use client";

import { useState } from "react";
import { Check, FileText, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

interface EditorialTermProps {
    onNext: () => void;
}

export default function EditorialTerm({ onNext }: EditorialTermProps) {
    const [chamadaRead, setChamadaRead] = useState(false);
    const [termoRead, setTermoRead] = useState(false);

    const canProceed = chamadaRead && termoRead;

    return (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
                <div className="text-center mb-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                        <FileText className="h-6 w-6 text-amber-600" aria-hidden="true" />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 font-serif">Leitura Obrigatória</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Para prosseguir com sua inscrição, é necessário ler e concordar com os editais.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Item 1: Chamada Editorial */}
                    <div className={`p-4 rounded-lg border transition-colors ${chamadaRead ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${chamadaRead ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Chamada Editorial</h3>
                                    <p className="text-sm text-gray-500">Edital de seleção de autores</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link href="/chamada" target="_blank" className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1">
                                    Ler Documento <ExternalLink className="h-3 w-3" />
                                </Link>
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-600 cursor-pointer"
                                        checked={chamadaRead}
                                        onChange={(e) => setChamadaRead(e.target.checked)}
                                    />
                                    <span className="text-sm font-medium text-gray-700">Li e concordo</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Item 2: Termo de Referência */}
                    <div className={`p-4 rounded-lg border transition-colors ${termoRead ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${termoRead ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Termo de Referência</h3>
                                    <p className="text-sm text-gray-500">Diretrizes técnicas e pedagógicas</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link href="/termo" target="_blank" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                                    Ler Documento <ExternalLink className="h-3 w-3" />
                                </Link>
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-600 cursor-pointer"
                                        checked={termoRead}
                                        onChange={(e) => setTermoRead(e.target.checked)}
                                    />
                                    <span className="text-sm font-medium text-gray-700">Li e concordo</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-amber-50 border-l-4 border-amber-500 p-4">
                    <p className="text-amber-800 text-sm">
                        <strong>Declaração:</strong> Ao marcar as opções acima, declaro que li integralmente os documentos e estou de acordo com todas as regras estabelecidas para o processo seletivo.
                    </p>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-100 mt-6">
                    <button
                        type="button"
                        onClick={onNext}
                        disabled={!canProceed}
                        className="rounded-md bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        Confirmar e Continuar
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
