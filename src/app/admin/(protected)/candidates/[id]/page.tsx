import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import {
    FileText, ArrowLeft, Shield, MapPin, Search, Hash
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import StatusUpdater from "../../../../../components/admin/StatusUpdater";
import DossierContactActions from "../../../../../components/admin/DossierContactActions";
import AdminFileViewer from "../../../../../components/admin/AdminFileViewer";
import CandidateNotes from "../../../../../components/admin/CandidateNotes";

export const dynamic = "force-dynamic";

async function getCandidateData(id: string) {
    const supabase = createClient();

    const { data: application, error } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !application) return null;

    const { data: documents } = await supabase
        .from("documents")
        .select("*")
        .eq("application_id", id);

    const { data: history } = await supabase
        .from("kanban_history")
        .select("*, admin:moved_by_admin_id(full_name)")
        .eq("application_id", id)
        .order("moved_at", { ascending: false });

    return { application, documents, history };
}

export default async function CandidateDossierPage({ params }: { params: { id: string } }) {
    const data = await getCandidateData(params.id);

    if (!data) notFound();

    const { application, documents, history } = data;

    const DataRow = ({ label, value }: any) => (
        <div className="py-3 flex flex-col sm:flex-row sm:items-baseline sm:gap-4 border-b border-slate-50 last:border-0">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest min-w-[140px]">{label}</span>
            <span className="text-sm text-slate-900 font-bold whitespace-pre-wrap">{value || "---"}</span>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-24 animate-in fade-in duration-500">
            {/* Header Navigation */}
            <div className="flex items-center justify-between">
                <Link href="/admin/candidates" className="flex items-center gap-2 text-slate-400 hover:text-amber-600 transition-all font-bold text-xs uppercase tracking-widest">
                    <ArrowLeft className="h-4 w-4" /> Voltar para Listagem
                </Link>
                <div className="flex items-center gap-4">
                    <DossierContactActions email={application.email} fullName={application.full_name} />
                    <StatusUpdater id={application.id} currentStatus={application.status || 'received'} />
                </div>
            </div>

            {/* Main Sheet */}
            <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                {/* Visual Identity Header */}
                <div className="bg-slate-900 px-10 py-12 text-white relative flex flex-col md:flex-row items-center gap-8">
                    <div className="h-24 w-24 rounded-3xl bg-amber-500 flex items-center justify-center text-4xl font-black text-slate-950 shadow-2xl">
                        {application.full_name?.charAt(0)}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-black font-serif tracking-tighter mb-2">{application.full_name}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 text-amber-500">
                                {application.profile_type}
                            </span>
                            <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-1">
                                <MapPin className="h-2.5 w-2.5" /> {application.state}
                            </span>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                        <Shield className="h-32 w-32" />
                    </div>
                </div>

                <div className="p-10 lg:p-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left Column: Data Sheet */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-6 border-l-4 border-amber-500 pl-4">Dossiê de Identificação</h3>
                            <div className="space-y-1">
                                <DataRow label="E-mail" value={application.email} />
                                <DataRow label="Telefone" value={application.phone} />
                                <DataRow label="CPF" value={application.cpf} />
                                <DataRow label="Localização" value={`${application.city} - ${application.state}`} />
                            </div>
                        </section>

                        <section>
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-6 border-l-4 border-amber-500 pl-4">Qualificação Acadêmica</h3>
                            <div className="space-y-1">
                                <DataRow label="Curso Principal" value={application.graduation_course} />
                                <DataRow label="Instituição" value={application.graduation_institution} />
                                <DataRow label="Ano de Conclusão" value={application.graduation_year} />
                                {application.profile_type === 'licenciado' && (
                                    <DataRow label="Área de Licenciatura" value={application.licensure_area} />
                                )}
                                {application.pedagogy_areas?.length > 0 && (
                                    <DataRow label="Especialidades" value={application.pedagogy_areas.join(", ")} />
                                )}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-6 border-l-4 border-amber-500 pl-4">Resumo Executivo</h3>
                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-slate-700 text-sm italic leading-relaxed shadow-inner whitespace-pre-wrap break-words">
                                {application.experience_summary || "Nenhum resumo fornecido."}
                            </div>
                        </section>

                        {application.authorial_text_preview && (
                            <section>
                                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-6 border-l-4 border-amber-500 pl-4">Texto Autoral (Preview)</h3>
                                <div className="p-8 bg-amber-50/30 rounded-[2rem] border border-amber-100 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap break-words font-serif">
                                    {application.authorial_text_preview}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Process & Notes */}
                    <div className="space-y-12">
                        <CandidateNotes
                            id={application.id}
                            initialNotes={application.internal_notes}
                            initialTags={application.tags}
                        />

                        <section>
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-6 border-l-4 border-amber-500 pl-4">Fluxo de Kandban</h3>
                            <div className="space-y-3">
                                {history?.map((h: any) => (
                                    <div key={h.id} className="text-[10px] p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-black text-slate-900 uppercase">PARA: {h.to_status}</span>
                                            <span className="text-slate-400 font-bold">{format(new Date(h.moved_at || h.created_at), "dd/MM/yy")}</span>
                                        </div>
                                        <p className="text-slate-500 font-medium opacity-70">Responsável: {h.admin?.full_name || "Sistema"}</p>
                                    </div>
                                ))}
                                {(!history || history.length === 0) && (
                                    <p className="text-[10px] text-slate-400 italic">Sem histórico registrado.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Full Width Asset Central */}
                <div className="px-10 lg:px-16 pb-16">
                    <section className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-14 w-14 bg-amber-500 rounded-3xl flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
                                <FileText className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-widest">Repositório de Documentos</h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Download seguro via Supabase Storage</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {documents?.map((doc: any) => (
                                <div key={doc.id} className="p-6 bg-white/5 rounded-[2.5rem] border border-white/10 flex flex-col gap-6 hover:bg-white/10 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-[10px] font-black uppercase truncate text-slate-200">{doc.original_name}</p>
                                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">PDF • {(doc.size_bytes / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <AdminFileViewer path={doc.storage_path} name={doc.original_name} />
                                </div>
                            ))}
                            {(!documents || documents.length === 0) && (
                                <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                                    <p className="text-sm text-slate-500 font-bold uppercase">Nenhum documento detectado no storage</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Technical Meta Data */}
                <div className="px-10 lg:px-16 pb-20">
                    <section className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100">
                        <div className="flex items-center justify-center gap-4 mb-12">
                            <Hash className="h-5 w-5 text-slate-300" />
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Ficha Técnica Estruturada</h3>
                            <Hash className="h-5 w-5 text-slate-300" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-4">
                            {Object.entries(application).map(([key, value]) => {
                                if (key === 'id' || key === 'user_id' || typeof value === 'object') return null;
                                return (
                                    <div key={key} className="flex justify-between items-center py-2 border-b border-slate-200/50">
                                        <span className="text-[9px] font-black text-slate-400 uppercase">{key.replace(/_/g, ' ')}</span>
                                        <span className="text-[11px] font-bold text-slate-900 truncate max-w-[150px]">{String(value)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
