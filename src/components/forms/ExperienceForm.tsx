"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema, ExperienceFormData } from "@/schemas/application";
import { FormInput, FormTextarea } from "@/components/ui/form-elements";
import { useEffect } from "react";

interface ExperienceFormProps {
    initialData?: Partial<ExperienceFormData>;
    onSave: (data: ExperienceFormData) => Promise<void>;
    onBack: () => void;
}

export default function ExperienceForm({ initialData, onSave, onBack }: ExperienceFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ExperienceFormData>({
        resolver: zodResolver(experienceSchema),
        defaultValues: initialData,
    });

    useEffect(() => {
        if (initialData) reset(initialData);
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
            <FormInput
                label="Anos de Experiência"
                {...register("experience_years")}
                error={errors.experience_years?.message}
                placeholder="Ex: 5 anos"
            />

            <FormTextarea
                label="Resumo Profissional"
                {...register("experience_summary")}
                error={errors.experience_summary?.message}
                rows={5}
                placeholder="Descreva suas principais experiências na área educacional..."
            />

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
                    {isSubmitting ? "Salvando..." : "Concluir Candidatura"}
                </button>
            </div>
        </form>
    );
}
