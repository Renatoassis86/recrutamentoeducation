"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema, EducationFormData } from "@/schemas/application";
import { FormInput } from "@/components/ui/form-elements";
import { useEffect, useState } from "react";

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

        resolver: zodResolver(educationSchema),
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
            graduation_course: data.graduation_course || "",
            graduation_institution: data.graduation_institution || "",
            graduation_year: data.graduation_year || undefined, // undefined for number input
            postgrad_areas: data.postgrad_areas || [],
        };
    }

    return (
        <form onSubmit={handleSubmit((data) => onSave(data as any))} className="space-y-6">
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

            <div className="border-t pt-6 mt-6">
                <h3 className="text-base font-semibold leading-7 text-gray-900 mb-4">Pós-graduação ou Formação Complementar</h3>
                <div className="space-y-3">
                    {["Educação Cristã Clássica", "Psicopedagogia", "Gestão Escolar", "Educação / Pedagogia (outras)"].map((area) => (
                        <label key={area} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                value={area}
                                {...register("postgrad_areas")}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            />
                            <span className="text-sm text-gray-700">{area}</span>
                        </label>
                    ))}
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            value="Não possuo"
                            {...register("postgrad_areas")}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                        <span className="text-sm text-gray-700">Não possuo</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            value="Outros"
                            {...register("postgrad_areas")}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                        <span className="text-sm text-gray-700">Outros</span>
                    </label>
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
                    disabled={isSubmitting}
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
                >
                    {isSubmitting ? "Salvando..." : "Salvar e Continuar"}
                </button>
            </div>
        </form>
    );
}
