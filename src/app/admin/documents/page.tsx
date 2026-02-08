import { getAllDocuments } from "../actions";
import Link from "next/link";
import { FileText, Download, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function AdminDocumentsPage() {
    const documents = await getAllDocuments();

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Diretório de Documentos
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Lista de todos os documentos enviados pelos candidatos.
                    </p>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    <Link href="/admin" className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        Voltar ao Painel
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                <ul role="list" className="divide-y divide-gray-100">
                    {documents.length === 0 ? (
                        <li className="px-6 py-10 text-center text-gray-500">Nenhum documento encontrado.</li>
                    ) : (
                        documents.map((doc: any) => (
                            <li key={doc.id} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
                                <div className="flex min-w-0 gap-x-4">
                                    <div className="h-12 w-12 flex-none rounded-full bg-amber-50 flex items-center justify-center">
                                        <FileText className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold leading-6 text-gray-900">
                                            {doc.name}
                                        </p>
                                        <p className="mt-1 flex text-xs leading-5 text-gray-500">
                                            Candidato: {doc.applications?.full_name} ({doc.applications?.email})
                                        </p>
                                        <p className="mt-1 flex text-xs leading-5 text-gray-500">
                                            Enviado em {format(new Date(doc.created_at), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-x-4">
                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Download className="h-4 w-4" />
                                        Baixar
                                    </a>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
