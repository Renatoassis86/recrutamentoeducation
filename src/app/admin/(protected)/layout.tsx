import AdminSidebar from "@/components/admin/Sidebar";
import AdminChat from "@/components/admin/AdminChat";
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
            <main className="flex-1 p-4 pt-20 lg:p-8 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
            <AdminChat />
        </div>
    );
}
