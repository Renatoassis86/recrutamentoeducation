import { getAdminStats, getApplications } from "./actions";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ApplicationActions from "./ApplicationActions";

export default async function AdminDashboard({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> // Next.js 15+ compatible types
}) {
    const filters = await searchParams;
    const statusFilter = typeof filters.status === 'string' ? filters.status : 'all';

    const stats = await getAdminStats();

    if (!stats) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
                <p>Você não tem permissão para acessar esta área.</p>
                <Link href="/dashboard" className="text-blue-600 hover:underline mt-4 block">Voltar ao Dashboard</Link>
            </div>
        );
    }

    const applications = await getApplications(statusFilter);

    const statusColors: any = {
        received: 'bg-yellow-100 text-yellow-800',
        under_review: 'bg-blue-100 text-blue-800',
        info_requested: 'bg-orange-100 text-orange-800',
        interview_invited: 'bg-purple-100 text-purple-800',
        closed: 'bg-gray-100 text-gray-800'
    };

    const statusLabels: any = {
        received: 'Recebido',
        under_review: 'Em Análise',
        info_requested: 'Info Solicitada',
        interview_invited: 'Entrevista',
        closed: 'Fechado'
    };

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Painel Administrativo
                    </h2>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-10">
                {[
                    { name: 'Total', value: stats.total, color: 'bg-white' },
                    { name: 'Recebidos', value: stats.received, color: 'bg-yellow-50' },
                    { name: 'Em Análise', value: stats.under_review, color: 'bg-blue-50' },
                    { name: 'Entrevistas', value: stats.interview, color: 'bg-purple-50' },
                    { name: 'Fechados', value: stats.closed, color: 'bg-gray-50' },
                ].map((stat) => (
                    <div key={stat.name} className={`${stat.color} overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6`}>
                        <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>
                    </div>
                ))}
            </div>

            <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 shadow sm:rounded-t-lg">
                <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                    <div className="ml-4 mt-2">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Candidaturas</h3>
                    </div>
                    <div className="ml-4 mt-2 flex-shrink-0 flex gap-4">
                        <Link href="/admin/documents" className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            Ver Documentos
                        </Link>
                        <div className="flex gap-2">
                            <Link href="/admin?status=all" className={`px-3 py-1 text-sm rounded-md ${statusFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}>Todos</Link>
                            <Link href="/admin?status=received" className={`px-3 py-1 text-sm rounded-md ${statusFilter === 'received' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}>Recebidos</Link>
                            <Link href="/admin?status=under_review" className={`px-3 py-1 text-sm rounded-md ${statusFilter === 'under_review' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}>Análise</Link>
                            <Link href="/admin?status=interview_invited" className={`px-3 py-1 text-sm rounded-md ${statusFilter === 'interview_invited' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}>Entrevista</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow sm:rounded-b-lg overflow-hidden">
                <ul role="list" className="divide-y divide-gray-100">
                    {applications.length === 0 ? (
                        <li className="px-6 py-10 text-center text-gray-500">Nenhuma candidatura encontrada com este filtro.</li>
                    ) : (
                        applications.map((app: any) => (
                            <li key={app.id} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
                                <div className="flex min-w-0 gap-x-4">
                                    <div className="min-w-0 flex-auto">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold leading-6 text-gray-900">
                                                <Link href={`/admin/applications/${app.id}`}>
                                                    <span className="absolute inset-x-0 -top-px bottom-0" />
                                                    {app.full_name}
                                                </Link>
                                            </p>
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10 ${statusColors[app.status] || 'bg-gray-50 text-gray-600'}`}>
                                                {statusLabels[app.status] || app.status}
                                            </span>
                                        </div>
                                        <p className="mt-1 flex text-xs leading-5 text-gray-500">
                                            <a href={`mailto:${app.email}`} className="relative truncate hover:underline">{app.email}</a>
                                        </p>
                                        <p className="mt-1 flex text-xs leading-5 text-gray-500">
                                            {app.city}, {app.state} • {app.profile_type}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-x-4 z-10 relative">
                                    <div className="hidden sm:flex sm:flex-col sm:items-end">
                                        <p className="text-xs leading-5 text-gray-500">
                                            Enviado em {format(new Date(app.created_at), "dd 'de' MMM, yy", { locale: ptBR })}
                                        </p>
                                    </div>
                                    <ApplicationActions id={app.id} currentStatus={app.status} />
                                </div>

                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
