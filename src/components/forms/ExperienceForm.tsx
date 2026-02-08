"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema, ExperienceFormData } from "@/schemas/application";
import { FormInput, FormTextarea } from "@/components/ui/form-elements";
import { useEffect, useState } from "react";

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

    const [loadingInfo, setLoadingInfo] = useState(true);

    useEffect(() => {
        async function loadData() {
            if (initialData) {
                reset(sanitizeData(initialData));
                setLoadingInfo(false);
                return;
            }

            // Fetch from Supabase if no initialData
            const { createClient } = await import("@/utils/supabase/client");
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase
                    .from("applications")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (profile) {
                    reset(sanitizeData(profile));
                }
            }
            setLoadingInfo(false);
        }
        loadData();
    }, [initialData, reset]);

    function sanitizeData(data: any) {
        return {
            ...data,
            experience_years: data.experience_years || "",
            experience_summary: data.experience_summary || "",
        };
    }

    return (
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="experience_years" className="block text-sm font-medium leading-6 text-gray-900">
                    Anos de Experiência
                </label>
                <select
                    id="experience_years"
                    {...register("experience_years")}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                >
                    <option value="">Selecione uma opção</option>
                    <option value="Até 2 anos">Até 2 anos</option>
                    <option value="3 a 5 anos">3 a 5 anos</option>
                    <option value="6 a 10 anos">6 a 10 anos</option>
                    <option value="Mais de 10 anos">Mais de 10 anos</option>
                </select>
                {errors.experience_years?.message && (
                    <p className="mt-2 text-sm text-red-600">{errors.experience_years.message}</p>
                )}
            </div>

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
