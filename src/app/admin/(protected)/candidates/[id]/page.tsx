import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import {
    User, Mail, Phone, MapPin, GraduationCap, Briefcase, FileText,
    Calendar, ArrowLeft, Download, Shield, Clock, ExternalLink,
    MailCheck, MessageCircle
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import StatusUpdater from "@/components/admin/StatusUpdater";
import Scorecard from "@/components/admin/Scorecard";
import { getEvaluations } from "@/app/admin/actions-evaluations";

export const dynamic = "force-dynamic";

async function getCandidateData(id: string) {
    const supabase = createClient();

    // 1. Fetch Application
    const { data: application, error } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !application) return null;

    // 2. Fetch Documents
    const { data: documents } = await supabase
        .from("documents")
        .select("*")
        .eq("application_id", id);

    // 3. Fetch Evaluations
    const { data: evaluations } = await supabase
        .from("application_evaluations")
        .select("*, profiles:admin_id(full_name)")
        .eq("application_id", id);

    return { application, documents, evaluations };
}

export default async function CandidateDossierPage({ params }: { params: { id: string } }) {
    const data = await getCandidateData(params.id);

    if (!data) {
        notFound();
    }

    const { application, documents, evaluations } = data;

    // Find current user's evaluation if exists
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const myEval = evaluations?.find((e: any) => e.admin_id === user?.id);

    const Section = ({ title, icon: Icon, children }: any) => (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                <Icon className="h-5 w-5 text-amber-600" />
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">{title}</h3>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );

    const DataItem = ({ label, value, fullWidth = false }: any) => (
        <div className={`${fullWidth ? 'col-span-full' : 'sm:col-span-1'} space-y-1 mb-4`}>
            <span className="block text-xs font-semibold text-slate-500 uppercase">{label}</span>
            <span className="block text-slate-900 font-medium">{value || "Não informado"}</span>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-fade-in">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/candidates"
                    className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="font-medium text-sm">Voltar para a Lista</span>
                </Link>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-amber-500 transition-all">
                        <MailCheck className="h-4 w-4" /> Enviar Email
                    </button>
                    <a
                        href={`https://wa.me/${application.phone?.replace(/\D/g, '')}`}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-green-500 transition-all"
                    >
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                </div>
            </div>

            {/* Header / Identity */}
            <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="h-32 w-32 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-4xl font-bold text-amber-500">
                        {application.full_name?.charAt(0)}
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <h1 className="text-3xl font-bold font-serif">{application.full_name}</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${application.profile_type === 'licenciado' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
                                }`}>
                                {application.profile_type === 'licenciado' ? 'Licenciatura ou Bacharelado' : 'Pedagogo'}
                            </span>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-400 text-sm">
                            <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {application.email}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {application.city}, {application.state}</span>
                            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Inscrito em {format(new Date(application.created_at), "dd/MM/yyyy", { locale: ptBR })}</span>
                        </div>
                    </div>
                    <div className="md:ml-auto bg-white p-4 rounded-xl border border-white/10 text-center min-w-[200px] shadow-lg">
                        <span className="block text-xs text-slate-400 uppercase font-black mb-3">Gerenciar Status</span>
                        <div className="flex justify-center">
                            <StatusUpdater id={application.id} currentStatus={application.status || 'received'} />
                        </div>
                    </div>
                </div>
                {/* Decoration */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500 opacity-10 rounded-full blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: Personal & Education */}
                <div className="lg:col-span-2 space-y-6">
                    <Section title="Informações Pessoais" icon={User}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                            <DataItem label="CPF" value={application.cpf} />
                            <DataItem label="Telefone" value={application.phone} />
                            <DataItem label="Endereço" value={`${application.city} - ${application.state}`} />
                            <DataItem label="E-mail" value={application.email} />
                        </div>
                    </Section>

                    <Section title="Formação Acadêmica" icon={GraduationCap}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                            <DataItem label="Curso" value={application.graduation_course} />
                            <DataItem label="Instituição" value={application.graduation_institution} />
                            <DataItem label="Ano de Conclusão" value={application.graduation_year} />
                            <DataItem label="Área de Atuação" value={application.licensure_area || application.pedagogy_areas?.join(", ")} />
                            <DataItem label="Pós-Graduações" value={application.postgrad_areas?.join(", ") || "Nenhuma informada"} fullWidth />
                        </div>
                    </Section>

                    <Section title="Experiência Profissional" icon={Briefcase}>
                        <div className="space-y-6">
                            <DataItem label="Tempo de Experiência" value={application.experience_years} />
                            <div>
                                <span className="block text-xs font-semibold text-slate-500 uppercase mb-2">Resumo da Trajetória</span>
                                <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 italic">
                                    "{application.experience_summary}"
                                </p>
                            </div>
                        </div>
                    </Section>

                    {/* SCORECARD SECTION */}
                    <Scorecard applicationId={application.id} initialData={myEval} />
                </div>

                {/* Column 2: Documents & Actions */}
                <div className="space-y-6">
                    <Section title="Documentos & Anexos" icon={FileText}>
                        <div className="space-y-4">
                            {/* Lattes URL */}
                            {application.lattes_url && (
                                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-center justify-between group hover:bg-amber-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-amber-600" />
                                        <div>
                                            <span className="block text-xs font-bold text-amber-800 uppercase">Currículo Lattes</span>
                                            <span className="block text-[10px] text-amber-600 truncate max-w-[150px]">{application.lattes_url}</span>
                                        </div>
                                    </div>
                                    <a href={application.lattes_url} target="_blank" className="p-2 text-amber-700 hover:bg-amber-200 rounded-md">
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </div>
                            )}

                            {/* Uploaded Files */}
                            {documents?.map((doc: any) => (
                                <div key={doc.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between group hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-slate-400" />
                                        <div>
                                            <span className="block text-xs font-bold text-slate-800 uppercase">
                                                {doc.storage_path.includes("lattes") ? "Currículo (PDF)" :
                                                    doc.storage_path.includes("curriculo_completo") ? "Dossiê Completo" : "Escrita Autoral"}
                                            </span>
                                            <span className="block text-[10px] text-slate-500">{((doc.size_bytes || 0) / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    </div>
                                    {/* Link for Supabase Storage */}
                                    <ViewDocumentButton path={doc.storage_path} name={doc.original_name} />
                                </div>
                            ))}

                            {(!documents || documents.length === 0) && (
                                <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl">
                                    <span className="text-slate-400 text-xs">Nenhum anexo encontrado.</span>
                                </div>
                            )}
                        </div>
                    </Section>

                    {/* ID Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <span className="block text-xs font-bold text-slate-400 uppercase mb-4">Metadados do Registro</span>
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">UUID Interno</span>
                                <span className="font-mono text-slate-900">{application.id.slice(0, 8)}...</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Iniciado em</span>
                                <span className="text-slate-900">{format(new Date(application.created_at), "HH:mm, dd/MM/yy")}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Última Modificação</span>
                                <span className="text-slate-900">{format(new Date(application.updated_at || application.created_at), "HH:mm, dd/MM/yy")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Client helper for signed URLs
async function ViewDocumentButton({ path, name }: { path: string, name: string }) {
    // This needs to be a client component or a server action to generate a private URL
    // For now, let's assume a pattern or just a placeholder logic.
    // Ideally, we generate a signed URL:
    // const { data } = await supabase.storage.from('applications').createSignedUrl(path, 3600);
    // return <a href={data.signedUrl} ... />

    return (
        <AdminFileLink path={path} name={name} />
    );
}

// Sub-component for clarity
import AdminFileLink from "@/components/admin/AdminFileLink";
