import { createClient } from "@/utils/supabase/server";
import { ArrowLeft, Mail, Phone, MapPin, Download, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function CandidateDetailsPage({ params }: { params: { id: string } }) {
    const supabase = createClient();

    // Fetch Application Details
    const { data: application } = await supabase
        .from("applications")
        .select("*")
        .eq("id", params.id)
        .single();

    if (!application) {
        notFound();
    }

    // Fetch Documents for this candidate (if you have a 'documents' table linked by user_id or application_id)
    // Assuming linked by user_id for now based on previous context
    const { data: documents } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", application.user_id);

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Breadcrumb / Back */}
            <div>
                <Link href="/admin/candidates" className="text-sm text-slate-500 hover:text-amber-600 flex items-center gap-1 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Voltar para lista
                </Link>
            </div>

            {/* Header Profile */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center text-2xl text-slate-400 font-bold overflow-hidden">
                        {application.avatar_url ? (
                            <img src={application.avatar_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                            application.full_name?.charAt(0)
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{application.full_name}</h1>
                        <p className="text-slate-500 flex items-center gap-2 mt-1">
                            <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-xs font-semibold text-slate-600">{application.profile_type}</span>
                            <span className="text-xs text-slate-400">• Inscrito em {format(new Date(application.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-medium transition-colors">
                        Rejeitar
                    </button>
                    <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm">
                        Convidar P/ Entrevista
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Col: Info */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Personal Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Informações Pessoais</h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                            <div>
                                <dt className="text-xs font-medium text-slate-500 uppercase">Email</dt>
                                <dd className="mt-1 text-sm text-slate-900 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <a href={`mailto:${application.email}`} className="hover:text-amber-600 underline">{application.email}</a>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-slate-500 uppercase">Telefone</dt>
                                <dd className="mt-1 text-sm text-slate-900 flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    {application.phone}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-slate-500 uppercase">Localização</dt>
                                <dd className="mt-1 text-sm text-slate-900 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    {application.city} - {application.state}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-slate-500 uppercase">CPF</dt>
                                <dd className="mt-1 text-sm text-slate-900">{application.cpf}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Academic / Profile Specifics */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Dados Acadêmicos</h3>
                        <dl className="grid grid-cols-1 gap-y-6">
                            {application.profile_type === 'licenciado' && (
                                <div>
                                    <dt className="text-xs font-medium text-slate-500 uppercase">Área de Licenciatura</dt>
                                    <dd className="mt-1 text-base font-semibold text-slate-900">{application.licensure_area}</dd>
                                </div>
                            )}
                            {application.profile_type === 'pedagogo' && (
                                <div>
                                    <dt className="text-xs font-medium text-slate-500 uppercase">Áreas de Interesse</dt>
                                    <dd className="mt-1 flex flex-wrap gap-2">
                                        {application.pedagogy_areas?.map((area: string) => (
                                            <span key={area} className="px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-sm border border-amber-100">
                                                {area}
                                            </span>
                                        ))}
                                    </dd>
                                </div>
                            )}
                            {/* Academic History Fields - Assuming they exist in Schema or are JSONB, 
                                but standard fields might be 'education_level' etc. 
                                Displaying generic placeholder if specific fields aren't known yet 
                            */}
                            {application.academic_history && (
                                <div>
                                    <dt className="text-xs font-medium text-slate-500 uppercase">Histórico Acadêmico</dt>
                                    <dd className="mt-1 text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 rounded-md border border-slate-200">
                                        {/* Assuming it's a JSON or text field */}
                                        {JSON.stringify(application.academic_history, null, 2)}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>

                </div>

                {/* Right Col: Documents */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-slate-400" />
                            Documentos
                        </h3>

                        {(!documents || documents.length === 0) ? (
                            <p className="text-sm text-slate-500 italic">Nenhum documento enviado.</p>
                        ) : (
                            <ul className="space-y-3">
                                {documents.map((doc) => (
                                    <li key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="h-8 w-8 bg-white rounded flex items-center justify-center text-red-500 border border-slate-200 shadow-sm shrink-0">
                                                PDF
                                            </div>
                                            <div className="truncate">
                                                <p className="text-sm font-medium text-slate-900 truncate">{doc.file_name || "Documento"}</p>
                                                <p className="text-xs text-slate-500">{doc.document_type}</p>
                                            </div>
                                        </div>
                                        <a
                                            href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${doc.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
                                        >
                                            <Download className="h-4 w-4" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-900 mb-2">Nota Interna</h4>
                        <textarea
                            className="w-full text-sm border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                            rows={4}
                            placeholder="Adicione observações sobre este candidato..."
                        ></textarea>
                        <button className="mt-2 w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100">
                            Salvar Nota
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
