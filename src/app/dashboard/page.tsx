import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, CheckCircle2, Clock, LogOut } from "lucide-react";
import AvatarUpload from "@/components/dashboard/AvatarUpload";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user profile for avatar
    const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url, full_name") // Assuming full_name might be here or we get it from metadata/application
        .eq("id", user.id)
        .single();

    // Fetch application status
    const { data: application } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user.id)
        .single();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'received': return 'bg-green-100 text-green-700 border-green-200';
            case 'under_review': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'draft': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'received': return 'Inscrição Recebida';
            case 'under_review': return 'Em Análise';
            case 'draft': return 'Rascunho (Não Finalizado)';
            default: return 'Não Iniciado';
        }
    };

    const userName = application?.full_name || user.user_metadata?.full_name || "Candidato";

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-10 mt-8">
                {/* Added mt-8 for spacing from top, space-y-10 for better diagramming */}

                {/* Profile Header Card */}
                <div className="relative bg-white rounded-2xl shadow-sm border border-slate-100 p-8 pt-16 sm:pt-20 sm:pl-48">
                    {/* Avatar positioned absolutely to overlap/break the box */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:translate-x-0 sm:left-12 sm:top-1/2 sm:-translate-y-1/2">
                        <AvatarUpload
                            userId={user.id}
                            initialUrl={profile?.avatar_url}
                            userName={userName}
                        />
                    </div>

                    <div className="text-center sm:text-left mt-10 sm:mt-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 font-serif">Olá, {userName}</h1>
                                <p className="text-slate-500 text-md mt-1">Bem-vindo à sua área do candidato.</p>
                            </div>

                            <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 inline-block">
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">ID</p>
                                <p className="text-xs font-mono text-slate-600 truncate max-w-[100px] sm:max-w-none">{user.id.slice(0, 8)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Application Status Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden ring-1 ring-slate-900/5 transition-shadow hover:shadow-xl">
                    <div className="bg-slate-900 px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-800">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <FileText className="h-5 w-5 text-amber-500" />
                            Minha Candidatura
                        </h2>
                        {application && (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(application.status || 'draft')}`}>
                                {getStatusText(application.status || 'draft')}
                            </span>
                        )}
                    </div>

                    <div className="p-8">
                        {!application ? (
                            <div className="text-center py-12">
                                <div className="bg-amber-50 mx-auto h-24 w-24 rounded-full flex items-center justify-center mb-6 ring-8 ring-amber-50/50">
                                    <FileText className="h-10 w-10 text-amber-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3 font-serif">Inscrição Pendente</h3>
                                <p className="text-slate-600 max-w-lg mx-auto mb-10 text-lg leading-relaxed">
                                    Participe do processo seletivo para autores do material didático da Cidade Viva Education.
                                </p>
                                <Link href="/application" className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg">
                                    Iniciar Nova Candidatura
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <Clock className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">Status do Processo</h4>
                                        <p className="text-slate-600 mt-2 leading-relaxed">
                                            Sua inscrição foi iniciada em <span className="font-semibold text-slate-900">{new Date(application.created_at).toLocaleDateString('pt-BR')}</span>.
                                            {application.status === 'draft' ? ' Continue preenchendo seus dados para finalizar o envio.' : ' Fique atento ao seu email para informações sobre as próximas etapas de seleção.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    {application.status === 'draft' || !application.status ? (
                                        <Link href="/application" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors shadow-md">
                                            Continuar Preenchimento
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-3 px-6 py-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                                            <CheckCircle2 className="h-5 w-5" />
                                            <span className="font-semibold">Sua candidatura foi enviada com sucesso!</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Info & Logout */}
                <div className="flex flex-col items-center justify-center gap-6 pt-8 pb-12 border-t border-slate-200">
                    <p className="text-sm text-slate-500">
                        Precisa de ajuda? Entre em contato via <a href="https://wa.me/5583993322457" target="_blank" className="text-amber-600 hover:underline font-bold">WhatsApp</a>.
                    </p>

                    <form action="/auth/signout" method="post">
                        <button type="submit" className="text-slate-400 hover:text-red-600 text-sm flex items-center gap-2 transition-colors px-4 py-2 rounded-full hover:bg-red-50">
                            <LogOut className="w-4 h-4" />
                            Sair da conta
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
