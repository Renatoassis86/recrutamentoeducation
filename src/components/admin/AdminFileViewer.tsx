"use client";

import { useState } from "react";
import { Eye, Loader2, X, ExternalLink, Download } from "lucide-react";
import { getAdminSignedUrl } from "@/app/admin/actions";

interface AdminFileViewerProps {
    path: string;
    name: string;
}

export default function AdminFileViewer({ path, name }: AdminFileViewerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleOpen = async () => {
        setIsOpen(true);
        setError(null);

        if (url) return; // Already loaded

        setLoading(true);
        try {
            const res = await getAdminSignedUrl(path);
            if (res.error) {
                setError(res.error);
            } else if (res.signedUrl) {
                setUrl(res.signedUrl);
            }
        } catch (err: any) {
            setError("Ocorreu um erro ao carregar o documento.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const res = await getAdminSignedUrl(path, true);
            if (res.signedUrl) {
                const link = document.createElement('a');
                link.href = res.signedUrl;
                link.setAttribute('download', name);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                alert(res.error || "Erro ao gerar link de download");
            }
        } catch (err) {
            alert("Erro ao processar download");
        }
    };

    return (
        <>
            <div className="flex items-center gap-2">
                <button
                    onClick={handleOpen}
                    className="p-3 bg-white/10 hover:bg-amber-500 hover:text-slate-950 text-amber-500 rounded-2xl transition-all shadow-lg flex items-center justify-center group"
                    title="Visualizar Documento"
                >
                    <Eye className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </button>

                <button
                    onClick={handleDownload}
                    className="p-3 bg-white/10 hover:bg-blue-500 hover:text-white text-blue-400 rounded-2xl transition-all shadow-lg flex items-center justify-center group"
                    title="Baixar Arquivo"
                >
                    <Download className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-6xl h-full bg-slate-900 rounded-[3rem] shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-900">
                                    <Eye className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-sm uppercase tracking-widest truncate max-w-[200px] sm:max-w-md">{name}</h3>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Visualização Segura Admin</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {url && (
                                    <>
                                        <button
                                            onClick={handleDownload}
                                            className="p-3 text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                                            title="Baixar Agora"
                                        >
                                            <Download className="h-5 w-5" />
                                            <span className="hidden sm:inline">Baixar PDF</span>
                                        </button>
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-3 text-slate-400 hover:text-white transition-colors"
                                            title="Abrir em nova aba"
                                        >
                                            <ExternalLink className="h-5 w-5" />
                                        </a>
                                    </>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-3 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        {/* Viewer */}
                        <div className="flex-1 bg-slate-800 relative">
                            {loading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-amber-500">
                                    <Loader2 className="h-12 w-12 animate-spin" />
                                    <p className="text-xs font-black uppercase tracking-widest animate-pulse">Autenticando Acesso...</p>
                                </div>
                            )}

                            {error && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                                    <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                                        <X className="h-10 w-10 text-red-500" />
                                    </div>
                                    <h4 className="text-white font-black text-xl mb-2">Erro de Visualização</h4>
                                    <p className="text-slate-400 text-sm max-w-md mb-8">{error}</p>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all"
                                    >
                                        Fechar Janela
                                    </button>
                                </div>
                            )}

                            {url && !loading && (
                                <iframe
                                    src={`${url}#toolbar=0`}
                                    className="w-full h-full border-0"
                                    title={name}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
