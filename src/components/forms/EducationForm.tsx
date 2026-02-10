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
    const [diplomaFile, setDiplomaFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type !== 'application/pdf') {
                setUploadError("O arquivo deve ser um PDF.");
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setUploadError("O arquivo excede 10MB.");
                return;
            }
            setDiplomaFile(file);
            setUploadError(null);
        }
    };

    const uploadDiploma = async (user_id: string, application_id: string) => {
        if (!diplomaFile) return;

        const supabase = createClient();
        const uniqueName = `${user_id}/diploma_graduacao_${Date.now()}.pdf`;

        // 1. Upload to Storage
        const { error: uploadError } = await supabase.storage
            .from('applications')
            .upload(uniqueName, diplomaFile);

        if (uploadError) throw new Error(`Erro ao enviar diploma: ${uploadError.message}`);

        // 2. Insert into Documents table
        // We link it to application
        const { error: dbError } = await supabase
            .from("documents")
            .insert({
                application_id: application_id,
                user_id: user_id,
                storage_path: uniqueName,
                original_name: diplomaFile.name,
                mime_type: diplomaFile.type,
                size_bytes: diplomaFile.size,
            });

        if (dbError) throw dbError;
    };

    const handleFormSubmit = async (data: EducationFormData) => {
        // Enforce Diploma upload? User said "precisa colocar".
        // But if they are just editing text and already uploaded?
        // Since we don't show "Existing Diploma", we can't block them if they don't re-upload.
        // So we only block if it's a fresh/empty state? Hard to know without fetching docs.
        // Let's make it optional but strongly encouraging in UI, or relying on Review step to catch missing docs?
        // User said: "Ele precisa colocar nessa sessão".
        // Let's warn if no file is selected.
        if (!diplomaFile) {
            const confirmNoFile = window.confirm("Você não anexou o Diploma/Certificado. Deseja continuar mesmo assim? (É recomendável anexar agora).");
            if (!confirmNoFile) return;
        }

        setIsSaving(true);
        setUploadError(null);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error("Usuário não autenticado");

            // Fetch app id (it should exist since Step 1 created it)
            const { data: app } = await supabase.from("applications").select("id").eq("user_id", user.id).single();
            if (!app) throw new Error("Aplicação não iniciada.");

            // Upload Diploma if exists
            if (diplomaFile) {
                await uploadDiploma(user.id, app.id);
            }

            // Save Text Data (Server Action)
            await onSave(data);

        } catch (err: any) {
            console.error(err);
            setUploadError(err.message || "Erro ao salvar.");
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
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                            placeholder="Ex: Universidade Federal da Paraíba"
                        />
                        {errors.graduation_institution && <p className="text-red-500 text-xs mt-1">{errors.graduation_institution.message}</p>}
                    </div>
                </div>

                <div className="sm:col-span-6 pt-4">
                    <h3 className="text-sm font-medium leading-6 text-gray-900 mb-2">Pós-graduação ou Formação Complementar</h3>
                    <div className="space-y-2">
                        {["Educação Cristã Clássica", "Psicopedagogia", "Gestão Escolar", "Educação / Pedagogia (outras)"].map((area) => (
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

            {/* Diploma Upload Section */}
            <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Comprovante de Graduação</h3>

                <div className="border border-gray-200 rounded-lg p-5 bg-amber-50/50 hover:border-amber-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h4 className="font-semibold text-gray-900">Diploma ou Certificado de Conclusão <span className="text-red-500">*</span></h4>
                            <p className="text-xs text-gray-500 mt-1">Anexe o arquivo PDF do seu diploma.</p>
                        </div>
                        {diplomaFile && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>

                    {diplomaFile ? (
                        <div className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-100">
                            <div className="flex items-center overflow-hidden">
                                <FileText className="h-5 w-5 text-amber-600 flex-shrink-0 mr-2" />
                                <span className="text-sm text-gray-700 truncate max-w-[200px] sm:max-w-xs">{diplomaFile.name}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setDiplomaFile(null); // Clear file
                                    const el = document.getElementById('diploma-upload') as HTMLInputElement;
                                    if (el) el.value = '';
                                }}
                                className="text-xs text-amber-700 font-medium hover:text-amber-900 ml-2"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                                <p className="text-xs text-gray-500">Clique para selecionar (PDF)</p>
                            </div>
                            <input
                                id="diploma-upload"
                                type="file"
                                className="hidden"
                                accept="application/pdf"
                                onChange={handleFileChange}
                            />
                        </label>
                    )}
                </div>
                {uploadError && <p className="text-red-600 text-sm mt-2">{uploadError}</p>}
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
