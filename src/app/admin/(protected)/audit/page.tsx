import { getAuditLogs } from "../../actions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    ClipboardList, Shield, Clock, Hash, Activity,
    User, Settings, FileText, Trash2, Edit, AlertTriangle
} from "lucide-react";

export const dynamic = "force-dynamic";

const ACTION_ICONS = {
    "create": FileText,
    "update": Edit,
    "delete": Trash2,
    "login": Shield,
    "logout": Clock,
    "update_status": Settings,
    "user_update": User,
};

export default async function AuditPage() {
    let logs: any[] = [];
    let errorMessage: string | null = null;

    try {
        logs = await getAuditLogs();
        if (!logs) logs = [];
    } catch (error: any) {
        console.error("Audit Logs Error:", error);
        errorMessage = "Não foi possível carregar os logs de auditoria no momento.";
    }

    if (errorMessage) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <AlertTriangle className="h-12 w-12 text-red-500" />
                <h2 className="text-xl font-bold text-slate-900">{errorMessage}</h2>
                <p className="text-slate-500">Tente novamente em alguns instantes ou contate o suporte técnico.</p>
            </div>
        );
    }

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
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ação / Data</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrador</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Módulo</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ID Relacionado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {logs.length > 0 ? logs.map((log: any) => {
                            const Icon = (ACTION_ICONS as any)[log.action] || Activity;

                            // Safe date formatting
                            let formattedDate = "Data inválida";
                            try {
                                if (log.created_at) {
                                    formattedDate = format(new Date(log.created_at), "dd MMM yyyy HH:mm", { locale: ptBR });
                                }
                            } catch (e) {
                                console.error("Date formatting error:", e);
                            }

                            return (
                                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">{(log.action || 'Ação desconhecida').replace(/_/g, ' ')}</span>
                                                <span className="text-[10px] text-slate-400 font-bold">{formattedDate}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-900">{log.admin?.full_name || "Sistema"}</span>
                                            <span className="text-[10px] text-slate-400 font-medium">{log.admin?.email || "---"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">
                                            {log.entity || "Outro"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {log.entity_id ? (
                                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 rounded text-[10px] font-mono font-bold text-amber-700">
                                                <Hash className="h-2.5 w-2.5 opacity-50" />
                                                {String(log.entity_id).split('-')[0]}...
                                            </div>
                                        ) : (
                                            <span className="text-slate-300">---</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-20 text-center flex flex-col items-center justify-center">
                                    <ClipboardList className="h-12 w-12 text-slate-100 mb-4" />
                                    <h3 className="font-bold text-slate-900">Nenhum registro encontrado</h3>
                                    <p className="text-sm text-slate-400">As ações de auditoria aparecerão aqui conforme o uso do sistema.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
