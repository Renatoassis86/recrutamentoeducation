"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema, EducationFormData } from "@/schemas/application";
import { FormInput } from "@/components/ui/form-elements";
import { useEffect } from "react";

interface EducationFormProps {
    initialData?: Partial<EducationFormData>;
    onSave: (data: EducationFormData) => Promise<void>;
    onBack: () => void;
}

export default function EducationForm({ initialData, onSave, onBack }: EducationFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<EducationFormData>({
        // @ts-ignore
        resolver: zodResolver(educationSchema),
        defaultValues: initialData,
    });

    useEffect(() => {
        if (initialData) reset(initialData);
    }, [initialData, reset]);

    const onSubmit = (data: EducationFormData) => {
        onSave(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                <FormInput
                    label="Curso de Graduação"
                    {...register("graduation_course")}
                    error={errors.graduation_course?.message}
                    className="sm:col-span-4"
                />

                <FormInput
                    label="Ano de Conclusão"
                    type="number"
                    {...register("graduation_year")}
                    error={errors.graduation_year?.message}
                    className="sm:col-span-2"
                />

                <FormInput
                    label="Instituição"
                    {...register("graduation_institution")}
                    error={errors.graduation_institution?.message}
                    className="sm:col-span-6"
                />
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
                    disabled={isSubmitting}
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
                >
                    {isSubmitting ? "Salvando..." : "Salvar e Continuar"}
                </button>
            </div>
        </form>
    );
}
