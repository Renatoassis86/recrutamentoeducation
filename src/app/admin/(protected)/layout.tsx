import AdminSidebar from "@/components/admin/Sidebar";
import AdminChat from "@/components/admin/AdminChat";
import PresenceIndicator from "@/components/admin/PresenceIndicator";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

/**
 * LAYOUT PROTEGIDO COM VALIDAÇÃO DE SESSÃO E RBAC (ENTREPRISE SECURITY)
 */
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    // 1. Verificar Sessão no Supabase (Fonte da Verdade Única)
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/admin/login");
    }

    // 2. Verificação de Role (Segurança Enterprise via RBAC)
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin" && profile?.role !== "committee") {
        redirect("/admin/login?error=Acesso negado: Privilégios insuficientes");
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <AdminSidebar userRole={profile.role} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header Superior / Top Bar */}
                <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 relative z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        <PresenceIndicator />
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-2 rounded-xl">
                            Acesso: {profile.role === 'admin' ? 'Administrador Geral' : 'Comissão Organizadora'}
                        </span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
            <AdminChat />
        </div>
    );
}
