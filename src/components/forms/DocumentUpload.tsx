"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, UploadCloud, FileText, Link as LinkIcon, CheckCircle, AlertCircle } from "lucide-react";

interface DocumentUploadProps {
    onComplete: () => void;
    onBack: () => void;
}

export default function DocumentUpload({ onComplete, onBack }: DocumentUploadProps) {
    const [lattesUrl, setLattesUrl] = useState("");
    const [authorialText, setAuthorialText] = useState("");

    // File state
    const [combinedFile, setCombinedFile] = useState<File | null>(null);

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
        if (!authorialText || authorialText.length < 100) {
            setError("Por favor, cole o conteúdo do seu texto autoral no campo indicado (mínimo 100 caracteres).");
            return;
        }

        if (!combinedFile) {
            setError("Por favor, anexe o arquivo PDF único contendo o Currículo e o Texto Autoral.");
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

            // 2. Save Lattes & Authorial Text Preview
            const { error: urlError } = await supabase
                .from("applications")
                .update({
                    lattes_url: lattesUrl,
                    authorial_text_preview: authorialText
                })
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

            // Upload single file
            const fileData = await uploadToStorage(combinedFile, "curriculo_completo", "Documentação");

            // 4. Save Metadata to Documents Table
            // First, clear old ones to avoid duplicates/confusion
            await supabase.from("documents").delete().eq("application_id", application.id);

            const documentsToInsert = [
                {
                    application_id: application.id,
                    user_id: user.id,
                    storage_path: fileData.path,
                    original_name: fileData.name,
                    mime_type: fileData.type,
                    size_bytes: fileData.size,
                }
            ];

            const { error: dbError } = await supabase
                .from("documents")
                .insert(documentsToInsert);

            if (dbError) throw dbError;

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
        onChange
    }: {
        label: string,
        subLabel?: string,
        file: File | null,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    }) => (
        <div className="border border-gray-200 rounded-lg p-5 bg-white hover:border-amber-300 transition-colors">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-semibold text-gray-900">{label}</h4>
                    {subLabel && <p className="text-xs text-gray-500 mt-1">{subLabel}</p>}
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
                    Preencha o link do seu Lattes (opcional) e anexe o arquivo PDF único contendo seu Currículo e o Texto Autoral, conforme as instruções abaixo.
                </p>
            </div>

            {/* 1. Lattes URL */}
            <div className="space-y-2">
                <label htmlFor="lattes_url" className="block text-sm font-medium leading-6 text-gray-900">
                    Link do Currículo Lattes (Opcional)
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
                <p className="text-xs text-gray-500">Copie e cole a URL do seu currículo Lattes (se houver).</p>
            </div>

            {/* 2. Authorial Text Paste (For WordCloud analysis) */}
            <div className="space-y-2">
                <label htmlFor="authorial_text" className="block text-sm font-medium leading-6 text-gray-900">
                    Texto Autoral (Cole o conteúdo do seu texto abaixo para análise)
                </label>
                <textarea
                    id="authorial_text"
                    rows={8}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                    placeholder="Cole aqui o conteúdo do seu texto autoral..."
                    value={authorialText}
                    onChange={(e) => setAuthorialText(e.target.value)}
                />
                <p className="text-xs text-gray-500">Este conteúdo será utilizado para análise de perfil e geração de insights estatísticos.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Informações sobre o Texto Autoral</h4>
                    <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                        <p className="italic font-medium text-slate-800 bg-slate-50 p-4 rounded-lg border-l-4 border-amber-500">
                            &quot;O que você entende por educação cristã, clássica e integral, na área do conhecimento escolhida? Em sua perspectiva, o que o material didático dessa área precisa contemplar para ser excelente?&quot;
                        </p>

                        <p>O objetivo desta atividade é avaliar sua habilidade e domínio da escrita. O texto deverá atender aos seguintes critérios:</p>

                        <ul className="list-none space-y-2 pl-2">
                            <li><strong>I.</strong> Ter extensão mínima de 20 (vinte) linhas e máxima de 40 (quarenta) linhas;</li>
                            <li><strong>II.</strong> Apresentar estrutura dissertativa, contemplando introdução, desenvolvimento e conclusão;</li>
                            <li><strong>III.</strong> Demonstrar clareza, coesão, coerência textual e domínio da norma culta da língua portuguesa, bem como alinhamento ao tema proposto;</li>
                            <li><strong>IV.</strong> Ser produzido de forma integralmente autoral, sendo vedado o uso de ferramentas de inteligência artificial, em qualquer etapa da elaboração do texto. O material submetido será analisado por meio de ferramentas de detecção de IA, e a constatação de uso desses recursos implicará na desclassificação do candidato.</li>
                        </ul>

                        <p className="font-semibold text-amber-700 mt-4">
                            Importante: O currículo e o texto autoral devem ser entregues em um único documento PDF com o nome: <code className="bg-amber-100 px-2 py-1 rounded">curriculo_(nome do autor).pdf</code>
                        </p>
                    </div>
                </div>

                <FileInput
                    label="Anexo Único (Currículo + Texto Autoral)"
                    subLabel="Formato PDF (Máx. 10MB). Nomeie o arquivo como curriculo_(seu nome).pdf"
                    file={combinedFile}
                    onChange={(e) => handleFileChange(e, setCombinedFile)}
                />
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
