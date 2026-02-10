"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { declarationsSchema, DeclarationsFormData } from "@/schemas/application";
import { useEffect } from "react";

interface DeclarationsFormProps {
    onSave: (data: DeclarationsFormData) => void;
    onBack: () => void;
}

export default function DeclarationsForm({ onSave, onBack }: DeclarationsFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<DeclarationsFormData>({
        resolver: zodResolver(declarationsSchema),
        mode: "onChange",
    });

    const onSubmit = (data: DeclarationsFormData) => {
        onSave(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-yellow-50 p-4 rounded-md text-sm text-yellow-800 mb-4">
                Por favor, leia atentamente e confirme as declarações abaixo para prosseguir.
            </div>

            <div className="space-y-4">
                <div className="flex items-start">
                    <div className="flex h-6 items-center">
                        <input
                            id="declaration_private_nature"
                            type="checkbox"
                            {...register("declaration_private_nature")}
                            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
                        />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                        <label htmlFor="declaration_private_nature" className="font-medium text-gray-900">
                            DECLARAÇÃO DE CIÊNCIA DA NATUREZA PRIVADA DA CHAMADA (ANEXO II)
                        </label>
                        <p className="text-gray-500">
                            Declaro que tenho ciência de que a Chamada Editorial para Prospecção de Autores do Cidade Viva Education possui natureza exclusivamente privada, não se caracterizando como edital público, chamamento público nos termos da Lei nº 13.019/2014, procedimento licitatório ou qualquer modalidade prevista em legislação administrativa. Declaro, ainda, que compreendo que minha participação não gera direito subjetivo à contratação, expectativa de convocação ou exclusividade, constituindo-se apenas como manifestação de interesse editorial.
                        </p>
                        {errors.declaration_private_nature && <p className="text-red-600 text-xs mt-1">Obrigatório</p>}
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="flex h-6 items-center">
                        <input
                            id="declaration_availability"
                            type="checkbox"
                            {...register("declaration_availability")}
                            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
                        />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                        <label htmlFor="declaration_availability" className="font-medium text-gray-900">
                            DECLARAÇÃO DE DISPONIBILIDADE (ANEXO III)
                        </label>
                        <p className="text-gray-500">
                            Declaro que possuo disponibilidade para, caso venha a ser convidado(a), participar de projetos editoriais do Cidade Viva Education, cumprindo prazos, etapas e entregas que venham a ser definidos contratualmente.
                        </p>
                        {errors.declaration_availability && <p className="text-red-600 text-xs mt-1">Obrigatório</p>}
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="flex h-6 items-center">
                        <input
                            id="declaration_copyright"
                            type="checkbox"
                            {...register("declaration_copyright")}
                            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
                        />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                        <label htmlFor="declaration_copyright" className="font-medium text-gray-900">
                            DECLARAÇÃO DE CIÊNCIA SOBRE DIREITOS AUTORAIS (ANEXO IV)
                        </label>
                        <p className="text-gray-500">
                            Declaro que estou ciente de que eventual participação em projetos editoriais do Cidade Viva Education será formalizada por meio de Contrato de Prestação de Serviços por Obra Certa, no qual constarão as disposições relativas à cessão patrimonial total dos direitos autorais, nos termos da Lei nº 9.610/1998. Declaro, ainda, que compreendo que não há cessão antecipada de direitos autorais nesta fase, constituindo-se esta declaração apenas como ciência prévia das condições editoriais que regerão eventual contratação.
                        </p>
                        {errors.declaration_copyright && <p className="text-red-600 text-xs mt-1">Obrigatório</p>}
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="flex h-6 items-center">
                        <input
                            id="declaration_institutional_alignment"
                            type="checkbox"
                            {...register("declaration_institutional_alignment")}
                            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
                        />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                        <label htmlFor="declaration_institutional_alignment" className="font-medium text-gray-900">
                            DECLARAÇÃO DE CIÊNCIA E ALINHAMENTO EDITORIAL
                        </label>
                        <div className="text-gray-500 text-sm">
                            <p>Declaro que:</p>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li>Tenho ciência de que os projetos editoriais do Cidade Viva Education integram o Currículo Paideia, fundamentado na educação cristã clássica e na formação integral da pessoa humana;</li>
                                <li>Compreendo que esta manifestação de interesse não garante contratação, nem gera direito subjetivo à participação em projetos editoriais;</li>
                                <li>Estou ciente de que eventual participação ocorrerá apenas mediante convite formal e contratação específica;</li>
                                <li>Comprometo-me, caso venha a ser contratado(a), a produzir materiais didáticos alinhados às diretrizes pedagógicas, editoriais e institucionais do Cidade Viva Education.</li>
                            </ul>
                            <p className="mt-2 font-medium text-gray-900">Declaro ciência e concordância.</p>
                        </div>
                        {errors.declaration_institutional_alignment && <p className="text-red-600 text-xs mt-1">Obrigatório</p>}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-x-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-sm font-semibold leading-6 text-gray-900"
                >
                    Voltar
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500"
                >
                    Confirmar e Continuar
                </button>
            </div>
        </form>
    );
}
