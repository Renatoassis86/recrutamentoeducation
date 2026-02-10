"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, UploadCloud, X, FileText, Link as LinkIcon, CheckCircle, AlertCircle } from "lucide-react";
import { sendConfirmation } from "@/app/application/actions";

interface DocumentUploadProps {
    onComplete: () => void;
    onBack: () => void;
}

export default function DocumentUpload({ onComplete, onBack }: DocumentUploadProps) {
    const [lattesUrl, setLattesUrl] = useState("");

    // File states
    const [lattesFile, setLattesFile] = useState<File | null>(null);
    // Removed atestadoFile per user request
    const [escritaFile, setEscritaFile] = useState<File | null>(null);

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File) => {
        if (file.type !== 'application/pdf') return "O arquivo deve ser um PDF.";
        if (file.size > 10 * 1024 * 1024) return "O arquivo excede o tamanho máximo de 10MB.";
        return null;
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFile: (f: File | null) => void
    ) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const validationError = validateFile(selectedFile);
            if (validationError) {
                setError(validationError);
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleUpload = async () => {
        // Validação básica
        if (!lattesUrl.trim()) {
            setError("Por favor, preencha o link do seu Currículo Lattes.");
            return;
        }
        if (!lattesFile || !escritaFile) {
            setError("Por favor, anexe o Currículo Lattes e o Texto Autoral.");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error("Usuário não autenticado");

            // 1. Get Application ID
            const { data: application } = await supabase
                .from("applications")
                .select("id")
                .eq("user_id", user.id)
                .single();

            if (!application) throw new Error("Candidatura não encontrada.");

            // 2. Save Lattes URL
            const { error: urlError } = await supabase
                .from("applications")
                .update({ lattes_url: lattesUrl })
                .eq("id", application.id);

            if (urlError) throw urlError;

            // 3. Upload Files Helper
            const uploadToStorage = async (file: File, folder: string, label: string) => {
                const uniqueName = `${user.id}/${folder}_${Date.now()}.pdf`;
                const { error: uploadError } = await supabase.storage
                    .from('applications')
                    .upload(uniqueName, file);

                if (uploadError) throw new Error(`Erro ao enviar ${label}: ${uploadError.message}`);

                return {
                    path: uniqueName,
                    name: file.name,
                    size: file.size,
                    type: file.type
                };
            };

            // Upload files in parallel
            const [lattesUploaded, escritaUploaded] = await Promise.all([
                uploadToStorage(lattesFile, "lattes_cv", "Currículo Lattes"),
                uploadToStorage(escritaFile, "escrita_autoral", "Escrita Autoral")
            ]);

            // 4. Save Metadata to Documents Table
            // First, clear old ones to avoid duplicates/confusion
            await supabase.from("documents").delete().eq("application_id", application.id);

            const documentsToInsert = [
                {
                    application_id: application.id,
                    user_id: user.id,
                    storage_path: lattesUploaded.path,
                    original_name: lattesUploaded.name,
                    mime_type: lattesUploaded.type,
                    size_bytes: lattesUploaded.size,
                },
                {
                    application_id: application.id,
                    user_id: user.id,
                    storage_path: lattesUploaded.path,
                    original_name: lattesUploaded.name,
                    mime_type: lattesUploaded.type,
                    size_bytes: lattesUploaded.size,
                },
                {
                    application_id: application.id,
                    user_id: user.id,
                    storage_path: escritaUploaded.path,
                    original_name: escritaUploaded.name,
                    mime_type: escritaUploaded.type,
                    size_bytes: escritaUploaded.size,
                }
            ];

            const { error: dbError } = await supabase
                .from("documents")
                .insert(documentsToInsert);

            if (dbError) throw dbError;

            // 5. Update Status to Received - MOVED TO REVIEW STEP
            // await supabase.from("applications").update({ status: 'received' }).eq("id", application.id);

            // 6. Send Confirmation Email - MOVED TO REVIEW STEP
            // await sendConfirmation();

            onComplete();

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Ocorreu um erro inesperado. Tente novamente.");
        } finally {
            setUploading(false);
        }
    };

    // Helper Component for File Input
    const FileInput = ({
        label,
        subLabel,
        file,
        onChange,
        downloadLink
    }: {
        label: string,
        subLabel?: string,
        file: File | null,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        downloadLink?: { url: string, text: string }
    }) => (
        <div className="border border-gray-200 rounded-lg p-5 bg-white hover:border-amber-300 transition-colors">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-semibold text-gray-900">{label}</h4>
                    {subLabel && <p className="text-xs text-gray-500 mt-1">{subLabel}</p>}
                    {downloadLink && (
                        <a href={downloadLink.url} download className="text-xs text-amber-600 hover:underline mt-1 inline-flex items-center">
                            <LinkIcon className="w-3 h-3 mr-1" /> {downloadLink.text}
                        </a>
                    )}
                </div>
                {file && <CheckCircle className="w-5 h-5 text-green-500" />}
            </div>

            {file ? (
                <div className="flex items-center justify-between bg-amber-50 p-3 rounded-md">
                    <div className="flex items-center overflow-hidden">
                        <FileText className="h-5 w-5 text-amber-500 flex-shrink-0 mr-2" />
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            // reset logic would need state passing or wrapping, simple way:
                            // Re-rendering handles it if we pass a 'clear' prop, but easiest is just let user click input to replace
                            // For this UI, we'll just show the remove button logic in parent or just allow replace
                            const inputId = `file-${label.replace(/\s/g, '')}`;
                            const el = document.getElementById(inputId) as HTMLInputElement;
                            if (el) el.click();
                        }}
                        className="text-xs text-amber-700 font-medium hover:text-amber-900 ml-2"
                    >
                        Alterar
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para enviar</span></p>
                        <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                    </div>
                    <input
                        id={`file-${label.replace(/\s/g, '')}`}
                        type="file"
                        className="hidden"
                        accept="application/pdf"
                        onChange={onChange}
                    />
                </label>
            )}
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="bg-amber-50 p-4 rounded-md">
                <h3 className="text-lg font-medium leading-6 text-amber-900 mb-2">Etapa Final da Documentação</h3>
                <p className="text-sm text-amber-700">
                    Preencha o link do seu Lattes e anexe o arquivo PDF do seu Currículo e o Texto Autoral.
                </p>
            </div>

            {/* 1. Lattes URL */}
            <div className="space-y-2">
                <label htmlFor="lattes_url" className="block text-sm font-medium leading-6 text-gray-900">
                    Link do Currículo Lattes
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <LinkIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="url"
                        name="lattes_url"
                        id="lattes_url"
                        className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                        placeholder="http://lattes.cnpq.br/..."
                        value={lattesUrl}
                        onChange={(e) => setLattesUrl(e.target.value)}
                    />
                </div>
                <p className="text-xs text-gray-500">Copie e cole a URL do seu currículo Lattes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">

                {/* 2. File Uploads */}
                <FileInput
                    label="1. Currículo Lattes (PDF)"
                    subLabel="Anexe a versão em PDF do seu currículo Lattes."
                    file={lattesFile}
                    onChange={(e) => handleFileChange(e, setLattesFile)}
                />

                <div className="border border-gray-200 rounded-lg p-5 bg-white">
                    <div className="mb-4">
                        <h4 className="font-semibold text-gray-900">2. Escrita Autoral</h4>
                        <p className="text-sm text-gray-600 italic mt-1 bg-gray-50 p-3 rounded border border-gray-100">
                            &quot;O que você entende por educação cristã, clássica e integral na área do conhecimento escolhida? Em sua perspectiva, o que um material didático dessa área precisa contemplar para ser excelente?&quot; (20 a 40 linhas, manuscrito)
                        </p>
                    </div>
                    <FileInput
                        label="Arquivo da Escrita Autoral"
                        subLabel="O texto deve ser obrigatoriamente manuscrito e digitalizado (formato PDF)."
                        file={escritaFile}
                        onChange={(e) => handleFileChange(e, setEscritaFile)}
                    />
                </div>

            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            <div className="flex items-center justify-end gap-x-4 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-sm font-semibold leading-6 text-gray-900 px-4 py-2 rounded hover:bg-gray-100"
                    disabled={uploading}
                >
                    Voltar
                </button>
                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="rounded-md bg-amber-600 px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-amber-500 disabled:opacity-50 flex items-center transition-all"
                >
                    {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {uploading ? "Salvando..." : "Salvar e Continuar"}
                </button>
            </div>
        </div>
    );
}
