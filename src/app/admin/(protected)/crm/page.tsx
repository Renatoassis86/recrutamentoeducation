import { getApplications } from "../../actions";
import CRMClient from "./CRMClient";
import { MessageSquare, Zap, Megaphone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CRMPage() {
    const applications = await getApplications();

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 font-serif flex items-center gap-3">
                        <MessageSquare className="h-8 w-8 text-amber-500" /> Central de Relacionamento
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Comunicação estratégica individual e em massa via Email e WhatsApp.</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold">
                    <Zap className="h-4 w-4 text-amber-500" /> Delivery Instantâneo
                </div>
            </div>

            <CRMClient initialApplications={applications} />
        </div>
    );
}
