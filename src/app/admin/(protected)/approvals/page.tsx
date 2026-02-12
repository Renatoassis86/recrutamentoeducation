"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { getPendingAuthorizations, processAuthorization } from "@/app/admin/actions";
import { Loader2, Check, X, Clock, AlertCircle, FileEdit, Trash2 } from "lucide-react";

export default function ApprovalsPage() {
    const router = useRouter();
    const supabase = createClient();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        const checkRole = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
            if (profile?.role !== 'admin') {
                router.push("/admin");
                return;
            }
            loadRequests();
        };
        checkRole();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const data = await getPendingAuthorizations();
            setRequests(data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleProcess = async (id: string, status: 'approved' | 'rejected') => {
        setProcessingId(id);
        const res = await processAuthorization(id, status) as any;
        if (res.success) {
            loadRequests();
        } else {
            alert(res.error || "Erro ao processar.");
        }
        setProcessingId(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h1 className="text-3xl font-black text-slate-900 font-serif">Central de Autorizações</h1>
                <p className="text-slate-500 mt-2 font-medium">Ações solicitadas pela comissão que aguardam seu aval para serem executadas.</p>
            </div>

            {loading ? (
                <div className="flex justify-center p-20"><Loader2 className="h-10 w-10 animate-spin text-amber-500" /></div>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => (
                        <div key={req.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
                            <div className="flex items-center gap-6 flex-1">
                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${req.action_type === 'DELETE_CANDIDATE' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                    {req.action_type === 'DELETE_CANDIDATE' ? <Trash2 className="h-6 w-6" /> : <FileEdit className="h-6 w-6" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black uppercase tracking-widest text-slate-400">Solicitação de Modificação</span>
                                        <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                                            <Clock className="h-3 w-3" /> AGUARDANDO
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mt-1">{req.description}</h3>
                                    <p className="text-sm text-slate-500 mt-2">
                                        Solicitado por membro da comissão em {new Date(req.created_at).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <button
                                    onClick={() => handleProcess(req.id, 'rejected')}
                                    disabled={processingId === req.id}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                                >
                                    {processingId === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-5 w-5" />}
                                    Recusar
                                </button>
                                <button
                                    onClick={() => handleProcess(req.id, 'approved')}
                                    disabled={processingId === req.id}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                                >
                                    {processingId === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-5 w-5" />}
                                    Aprovar e Executar
                                </button>
                            </div>
                        </div>
                    ))}

                    {requests.length === 0 && (
                        <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                            <AlertCircle className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-medium font-serif italic text-lg text-slate-400">Tudo em ordem. Nenhuma solicitação pendente.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
