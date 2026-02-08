"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, UploadCloud, X, FileText } from "lucide-react";
import { sendConfirmation } from "@/app/application/actions";

interface DocumentUploadProps {
    onComplete: () => void;
    onBack: () => void;
}

export default function DocumentUpload({ onComplete, onBack }: DocumentUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            // Validation: Type PDF
            if (selectedFile.type !== 'application/pdf') {
                setError("O arquivo deve ser um PDF.");
                return;
            }

            // Validation: Size 10MB (Increased for single file)
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError("O arquivo excede o tamanho máximo de 10MB.");
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Selecione o arquivo PDF para enviar.");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error("Usuário não autenticado");

            // Unique name
            const fileName = `${user.id}/candidatura_completa_${Date.now()}.pdf`;

            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('applications')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Save metadata
            const { data: application } = await supabase
                .from("applications")
                .select("id")
                .eq("user_id", user.id)
                .single();

            if (!application) throw new Error("Candidatura não encontrada.");

            // Clear previous docs if any (replace logic for single file)
            await supabase.from("documents").delete().eq("application_id", application.id);

            const { error: dbError } = await supabase
                .from("documents")
                .insert({
                    application_id: application.id,
                    user_id: user.id,
                    storage_path: fileName,
                    original_name: file.name,
                    mime_type: file.type,
                    size_bytes: file.size,
                });

            if (dbError) throw dbError;

            // 3. Update status
            await supabase
                .from("applications")
                .update({ status: 'received' })
                .eq("id", application.id);

            // 4. Send Email (Server Action)
            await sendConfirmation();

            onComplete();

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Erro ao enviar documento.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="text-lg font-medium leading-6 text-blue-900 mb-2">Envio da Documentação e Escrita Autoral</h3>
                <p className="text-sm text-blue-700 mb-2">
                    Conforme o edital, você deve enviar <strong>UM ÚNICO ARQUIVO PDF</strong> contendo, na seguinte ordem:
                </p>
                <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1 ml-2">
                    <li>Currículo acadêmico-profissional atualizado (preferencialmente Lattes);</li>
                    <li>Documentos comprobatórios de formação acadêmica;</li>
                    <li>Documentos comprobatórios de experiência profissional (se houver);</li>
                    <li className="flex items-center gap-2">
                        Atestado de capacidade técnica (Anexo VI);
                        <a href="/modelo_atestado_anexo_vi.txt" download="modelo_atestado_anexo_vi.txt" className="text-xs bg-blue-100 px-2 py-0.5 rounded text-blue-800 hover:bg-blue-200 underline">
                            Baixar Modelo
                        </a>
                    </li>
                    <li><strong>Escrita autoral manuscrita</strong> (ver tema abaixo).</li>
                </ol>
            </div>

            <div className="border border-gray-200 rounded-md p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Tema da Escrita Autoral</h4>
                <p className="text-sm text-gray-600 italic">
                    &quot;O que você entende por educação cristã, clássica e integral na área do conhecimento escolhida? Em sua perspectiva, o que um material didático dessa área precisa contemplar para ser excelente?&quot;
                </p>
                <ul className="mt-2 text-xs text-gray-500 list-disc list-inside">
                    <li>Mínimo 20 linhas, Máximo 40 linhas.</li>
                    <li>Manuscrito à mão e digitalizado.</li>
                    <li>Texto dissertativo.</li>
                </ul>
            </div>

            <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                    {file ? (
                        <div className="flex flex-col items-center">
                            <FileText className="h-12 w-12 text-blue-500 mb-2" />
                            <p className="text-sm text-gray-700 font-medium mb-2">{file.name}</p>
                            <p className="text-xs text-gray-500 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            <button
                                type="button"
                                onClick={() => setFile(null)}
                                className="text-red-500 hover:text-red-700 text-sm flex items-center font-semibold"
                            >
                                <X className="h-4 w-4 mr-1" /> Substituir Arquivo
                            </button>
                        </div>
                    ) : (
                        <>
                            <UploadCloud className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                            <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                                >
                                    <span>Selecione o PDF Único</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="application/pdf" />
                                </label>
                            </div>
                            <p className="text-xs leading-5 text-gray-600">PDF até 10MB</p>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="flex items-center justify-end gap-x-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-sm font-semibold leading-6 text-gray-900"
                    disabled={uploading}
                >
                    Voltar
                </button>
                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading || !file}
                    className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50 flex items-center"
                >
                    {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {uploading ? "Enviando e Finalizando..." : "Finalizar Inscrição"}
                </button>
            </div>
        </div>
    );
}
