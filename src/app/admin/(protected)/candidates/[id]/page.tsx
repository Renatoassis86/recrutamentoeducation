import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import {
    User, Mail, Phone, MapPin, GraduationCap, FileText,
    ArrowLeft, ExternalLink, Shield, MessageCircle, Star, History
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import StatusUpdater from "../../../../../components/admin/StatusUpdater";
import AdminFileLink from "../../../../../components/admin/AdminFileLink";
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
        .select("*, profiles:moved_by_admin_id(full_name)")
        .eq("application_id", id)
        .order("moved_at", { ascending: false });

    return { application, documents, history };
}

export default async function CandidateDossierPage({ params }: { params: { id: string } }) {
    const data = await getCandidateData(params.id);

    if (!data) notFound();

    const { application, documents, history } = data;

    const DataRow = ({ label, value, fullWidth = false }: any) => (
        <div className={`py-4 flex flex-col sm:flex-row sm:items-baseline sm:gap-4 border-b border-slate-50 last:border-0 ${fullWidth ? 'block' : ''}`}>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[140px]">{label}</span>
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
                    <StatusUpdater id={application.id} currentStatus={application.status || 'received'} />
                </div>
            </div>

            {/* Main Sheet */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
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
                            <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
                                {application.state}
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
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6 border-l-4 border-amber-500 pl-4">Dados de Identificação</h3>
                            <div className="space-y-1">
                                <DataRow label="E-mail" value={application.email} />
                                <DataRow label="Telefone" value={application.phone} />
                                <DataRow label="CPF" value={application.cpf} />
                                <DataRow label="Localização" value={`${application.city} - ${application.state}`} />
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6 border-l-4 border-amber-500 pl-4">Formação Acadêmica</h3>
                            <div className="space-y-1">
                                <DataRow label="Curso" value={application.graduation_course} />
                                <DataRow label="Instituição" value={application.graduation_institution} />
                                <DataRow label="Ano Formatura" value={application.graduation_year} />
                                {application.profile_type === 'licenciado' && (
                                    <DataRow label="Área Licenciatura" value={application.licensure_area} />
                                )}
                                {application.pedagogy_areas?.length > 0 && (
                                    <DataRow label="Áreas Pedagogia" value={application.pedagogy_areas.join(", ")} />
                                )}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6 border-l-4 border-amber-500 pl-4">Resumo da Experiência</h3>
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-slate-700 text-sm italic leading-relaxed">
                                {application.experience_summary}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Assets & History & Team Space */}
                    <div className="space-y-12">
                        {/* Team Space (Notes & Tags) */}
                        <div className="h-full">
                            <CandidateNotes
                                id={application.id}
                                initialNotes={application.internal_notes}
                                initialTags={application.tags}
                            />
                        </div>

                        <section>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6 border-l-4 border-amber-500 pl-4">Documentação</h3>
                            <div className="space-y-4">
                                {documents?.map((doc: any) => (
                                    <div key={doc.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-amber-200 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-slate-600 truncate max-w-[120px]">{doc.original_name}</span>
                                        </div>
                                        <AdminFileLink path={doc.storage_path} name={doc.original_name} />
                                    </div>
                                ))}
                                {(!documents || documents.length === 0) && (
                                    <p className="text-[10px] text-slate-400 italic p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">Nenhum documento anexado.</p>
                                )}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6 border-l-4 border-amber-500 pl-4">Jornada do Candidato</h3>
                            <div className="space-y-4">
                                {history?.slice(0, 5).map((h: any) => (
                                    <div key={h.id} className="text-[10px] p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-black text-slate-900 uppercase">Fase: {h.to_status}</span>
                                            <span className="text-slate-400 font-bold">{format(new Date(h.moved_at), "dd/MM")}</span>
                                        </div>
                                        <p className="text-slate-500 font-medium">Por: {h.profiles?.full_name || "Sistema"}</p>
                                    </div>
                                ))}
                                {(!history || history.length === 0) && (
                                    <p className="text-[10px] text-slate-400 italic">Sem movimentação registrada.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
