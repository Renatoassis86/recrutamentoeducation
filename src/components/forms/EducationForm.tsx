"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema, EducationFormData } from "@/schemas/application";
import { useState, useEffect } from "react";
import { Loader2, UploadCloud, FileText, CheckCircle, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface EducationFormProps {
    initialData?: Partial<EducationFormData>;
    onSave: (data: EducationFormData) => Promise<void>;
    onBack: () => void;
}

export default function EducationForm({ initialData, onSave, onBack }: EducationFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    // Removed diploma upload state
    const [isLoadingData, setIsLoadingData] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<EducationFormData>({
        resolver: zodResolver(educationSchema),
        defaultValues: initialData,
    });

    // Data Loading Logic (Restored)
    useEffect(() => {
        async function loadData() {
            if (initialData) {
                reset(sanitizeData(initialData));
                setIsLoadingData(false);
                return;
            }

            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: app } = await supabase
                    .from("applications")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (app) {
                    reset(sanitizeData(app));
                    // Check if diploma document exists? 
                    // We can't easily auto-populate the File object in input[type=file]
                    // But we could show "Arquivo já enviado: X" if we fetched documents.
                    // For now, simpler to just load text data. 
                }
            }
            setIsLoadingData(false);
        }
        loadData();
    }, [initialData, reset]);

    function sanitizeData(data: any) {
        return {
            ...data,
            graduation_course: data.graduation_course || "",
            graduation_institution: data.graduation_institution || "",
            graduation_year: data.graduation_year || undefined,
            postgrad_areas: data.postgrad_areas || [],
        };
    }





    const handleFormSubmit = async (data: EducationFormData) => {


        setIsSaving(true);


        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error("Usuário não autenticado");

            // Fetch app id (it should exist since Step 1 created it)
            const { data: app } = await supabase.from("applications").select("id").eq("user_id", user.id).single();
            if (!app) throw new Error("Aplicação não iniciada.");



            // Save Text Data (Server Action)
            await onSave(data);

        } catch (err: any) {
            console.error(err);
            alert(err.message || "Erro ao salvar."); // Simple alert since uploadError is removed
            setIsSaving(false);
        }
    };

    if (isLoadingData) {
        return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-amber-600" /></div>;
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">

                <div className="sm:col-span-4">
                    <label htmlFor="graduation_course" className="block text-sm font-medium leading-6 text-gray-900">
                        Curso de Graduação
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            id="graduation_course"
                            {...register("graduation_course")}
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                            placeholder="Ex: Pedagogia, Letras, Matemática..."
                        />
                        {errors.graduation_course && <p className="text-red-500 text-xs mt-1">{errors.graduation_course.message}</p>}
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="graduation_year" className="block text-sm font-medium leading-6 text-gray-900">
                        Ano de Conclusão
                    </label>
                    <div className="mt-2">
                        <input
                            type="number"
                            id="graduation_year"
                            {...register("graduation_year")}
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                            placeholder="Ex: 2015"
                        />
                        {errors.graduation_year && <p className="text-red-500 text-xs mt-1">{errors.graduation_year.message}</p>}
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="graduation_institution" className="block text-sm font-medium leading-6 text-gray-900">
                        Instituição de Ensino
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            id="graduation_institution"
                            {...register("graduation_institution")}
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                            placeholder="Ex: Universidade Federal da Paraíba"
                        />
                        {errors.graduation_institution && <p className="text-red-500 text-xs mt-1">{errors.graduation_institution.message}</p>}
                    </div>
                </div>

                <div className="sm:col-span-6 pt-4">
                    <h3 className="text-sm font-medium leading-6 text-gray-900 mb-2">Pós-graduação ou Formação Complementar</h3>
                    <div className="space-y-2">
                        {["Educação Cristã Clássica", "Psicopedagogia", "Gestão Escolar", "Outras"].map((area) => (
                            <label key={area} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value={area}
                                    {...register("postgrad_areas")}
                                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
                                />
                                <span className="text-sm text-gray-700">{area}</span>
                            </label>
                        ))}
                    </div>
                </div>

            </div>



            <div className="flex items-center justify-end gap-x-6 pt-6 border-t border-gray-100">
                <button type="button" onClick={onBack} className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700">
                    Voltar
                </button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-md bg-amber-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:opacity-50 flex items-center"
                >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSaving ? "Salvando..." : "Salvar e Continuar"}
                </button>
            </div>
        </form>
    );
}
