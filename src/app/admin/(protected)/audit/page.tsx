import { getAuditLogs } from "../../actions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ClipboardList, Shield, Clock, Hash, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
    const logs = await getAuditLogs();

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 font-serif flex items-center gap-3">
                        <ClipboardList className="h-8 w-8 text-amber-500" /> Trilha de Auditoria
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Registro imutável de todas as ações administrativas no sistema Paideia.</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold">
                    <Shield className="h-4 w-4 text-amber-500" /> Segurança Ativa
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data / Hora</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrador</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Módulo</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ação Realizada</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ID Relacionado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {logs.map((log: any) => (
                            <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                        <Clock className="h-3.5 w-3.5 text-slate-300" />
                                        {format(new Date(log.created_at), "dd/MM/yy 'às' HH:mm", { locale: ptBR })}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-900">{log.profiles?.full_name || "Sistema"}</span>
                                        <span className="text-[10px] text-slate-400 font-medium">{log.profiles?.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-black uppercase tracking-tighter">
                                        {log.entity}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                        <Activity className="h-3.5 w-3.5 text-amber-500" />
                                        {log.action}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {log.entity_id ? (
                                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 rounded text-[10px] font-mono font-bold text-amber-700">
                                            <Hash className="h-2.5 w-2.5 opacity-50" />
                                            {log.entity_id.split('-')[0]}...
                                        </div>
                                    ) : (
                                        <span className="text-slate-300">---</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {logs.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center">
                        <ClipboardList className="h-12 w-12 text-slate-100 mb-4" />
                        <h3 className="font-bold text-slate-900">Nenhum log registrado</h3>
                        <p className="text-sm text-slate-400">As ações começarão a aparecer aqui conforme o sistema for usado.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
