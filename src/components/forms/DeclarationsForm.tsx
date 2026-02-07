"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { declarationsSchema, DeclarationsFormData } from "@/schemas/application";
import { useEffect } from "react";

interface DeclarationsFormProps {
    onSave: () => void; // No data needed to be passed up really, just success, but we can if we want to store it (not in DB currently as columns, but implied)
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

    const onSubmit = () => {
        onSave();
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
                            Natureza Privada da Chamada
                        </label>
                        <p className="text-gray-500">
                            Declaro ciência de que esta chamada tem natureza exclusivamente privada, não gera direito à contratação ou vínculo trabalhista. (Anexo II)
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
                            Disponibilidade
                        </label>
                        <p className="text-gray-500">
                            Declaro possuir disponibilidade para participar dos projetos editoriais e cumprir prazos. (Anexo III)
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
                            Direitos Autorais (Cessão)
                        </label>
                        <p className="text-gray-500">
                            Estou ciente de que eventual contratação implicará a cessão total de direitos autorais ao Sistema Cidade Viva Education. (Anexo IV)
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
                            Alinhamento Institucional
                        </label>
                        <p className="text-gray-500">
                            Aceito a identidade pedagógica (Educação Cristã Clássica) e comprometo-me a produzir materiais alinhados a esta cosmovisão. (Anexo V)
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
