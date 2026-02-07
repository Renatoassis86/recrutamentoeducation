import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import StatusUpdater from "./StatusUpdater"; // Client component
import { FileText } from "lucide-react";

export default async function ApplicationDetail({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return <div className="p-8">Acesso Negado</div>;

    const { data: app, error } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !app) return <div className="p-8">Candidatura não encontrada</div>;

    const { data: documents } = await supabase
        .from("documents")
        .select("*")
        .eq("application_id", id);

    // Generate signed URLs for documents (valid for 1 hour)
    const documentsWithUrl = await Promise.all((documents || []).map(async (doc) => {
        const { data } = await supabase.storage.from('applications').createSignedUrl(doc.storage_path, 3600);
        return {
            ...doc,
            signedUrl: data?.signedUrl
        };
    }));

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900">← Voltar</Link>
                <h1 className="text-2xl font-bold text-gray-900">{app.full_name}</h1>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Card */}
                    <div className="bg-white shadow sm:rounded-lg p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Gerenciar Status</h3>
                        <StatusUpdater id={app.id} currentStatus={app.status} />
                    </div>

                    {/* Profile Details */}
                    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Detalhes do Candidato</h3>
                        </div>
                        <div className="border-t border-gray-100">
                            <dl className="divide-y divide-gray-100">
                                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-900">Email</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{app.email}</dd>
                                </div>
                                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-900">Telefone</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{app.phone}</dd>
                                </div>
                                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-900">Localização</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{app.city}, {app.state}</dd>
                                </div>
                                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-900">Tipo de Perfil</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 uppercase">{app.profile_type}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Experiência Profissional</h3>
                        </div>
                        <div className="border-t border-gray-100 px-4 py-5 sm:px-6">
                            <div className="mb-4">
                                <span className="text-sm font-medium text-gray-900">Tempo de Experiência:</span> <span className="text-sm text-gray-700">{app.experience_years}</span>
                            </div>
                            <p className="text-sm loading-6 text-gray-700 whitespace-pre-wrap">{app.experience_summary}</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Documents & Education) */}
                <div className="space-y-6">
                    {/* Documents */}
                    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Documentos</h3>
                        </div>
                        <ul role="list" className="divide-y divide-gray-100 border-t border-gray-100">
                            {documentsWithUrl.length === 0 ? (
                                <li className="px-4 py-4 text-sm text-gray-500">Nenhum documento anexado.</li>
                            ) : (
                                documentsWithUrl.map((doc: any) => (
                                    <li key={doc.id} className="flex items-center justify-between gap-x-6 py-4 px-4 hover:bg-gray-50">
                                        <div className="flex min-w-0 gap-x-4">
                                            <FileText className="h-10 w-10 flex-none text-gray-400" />
                                            <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6 text-gray-900 truncate">{doc.original_name}</p>
                                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{(doc.size_bytes / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <a
                                            href={doc.signedUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        >
                                            Ver
                                        </a>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                    {/* Education */}
                    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Formação Acadêmica</h3>
                        </div>
                        <div className="border-t border-gray-100 px-4 py-4">
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-xs font-medium text-gray-500 uppercase">Graduação</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{app.graduation_course}</dd>
                                    <dd className="text-xs text-gray-500">{app.graduation_institution} ({app.graduation_year})</dd>
                                </div>
                                {/* Can add more details if we had arrays for postgrad */}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
