import { getApplications } from "../../actions";
import KanbanBoard from "@/components/admin/KanbanBoard";
import { LayoutGrid, Info } from "lucide-react";

export const dynamic = "force-dynamic";

const COLUMNS = [
    { id: 'received', name: 'Inscritos' },
    { id: 'under_review', name: 'Em análise' },
    { id: 'reviewed', name: 'Analisados' },
    { id: 'approved_2nd_phase', name: 'Aprovados (2ª Fase)' },
    { id: 'interviews', name: 'Entrevistas' },
    { id: 'ranked', name: 'Ranking Final' },
    { id: 'hired', name: 'Contratados' },
];

export default async function KanbanPage() {
    const applications = await getApplications();

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between px-2">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 font-serif flex items-center gap-3">
                        <LayoutGrid className="h-8 w-8 text-amber-500" /> Pipeline Editorial
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Gerencie o fluxo de candidatos entre as fases do chamamento.</p>
                </div>
                <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 text-amber-800 text-xs font-bold">
                    <Info className="h-4 w-4" /> Arraste ou use o menu para mover candidatos
                </div>
            </div>

            {/* Kanban Container */}
            <div className="flex-1 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <KanbanBoard initialApplications={applications} columns={COLUMNS} />
            </div>
        </div>
    );
}
