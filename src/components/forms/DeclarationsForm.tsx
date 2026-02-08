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
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                        <label htmlFor="declaration_private_nature" className="font-medium text-gray-900">
                            Declaração de Ciência da Natureza Privada da Chamada (Anexo II)
                        </label>
                        <p className="text-gray-500 text-justify">
                            Declaro ciência de que a Chamada Editorial possui natureza exclusivamente privada, não gera direito subjetivo à contratação, expectativa de convocação ou exclusividade.
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
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                        <label htmlFor="declaration_availability" className="font-medium text-gray-900">
                            Declaração de Disponibilidade (Anexo III)
                        </label>
                        <p className="text-gray-500 text-justify">
                            Declaro que possuo disponibilidade para, caso venha a ser convidado(a), participar de projetos editoriais, cumprindo prazos, etapas e entregas definidas contratualmente.
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
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                        <label htmlFor="declaration_copyright" className="font-medium text-gray-900">
                            Declaração de Ciência sobre Direitos Autorais (Anexo IV)
                        </label>
                        <p className="text-gray-500 text-justify">
                            Declaro ciência de que eventual participação em projetos editoriais será formalizada por meio de cessão patrimonial total dos direitos autorais (Lei nº 9.610/1998).
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
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                        <label htmlFor="declaration_institutional_alignment" className="font-medium text-gray-900">
                            Declaração de Alinhamento Institucional (Anexo V)
                        </label>
                        <p className="text-gray-500 text-justify">
                            Declaro que compreendo e aceito a identidade pedagógica, editorial e institucional, comprometendo-me a produzir materiais alinhados à educação cristã clássica e ao Currículo Paideia.
                        </p>
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
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                    Confirmar e Continuar
                </button>
            </div>
        </form>
    );
}
