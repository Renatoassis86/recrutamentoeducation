"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

export async function deleteUser(userId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Não autorizado" };

    // Check if the current user is an admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { error: "Acesso negado: Apenas administradores podem gerenciar usuários." };

    const adminClient = createAdminClient();
    if (!adminClient) {
        return {
            error: "Erro de Configuração: A chave mestre (Service Role) não foi configurada no servidor Vercel. Esta chave é necessária para excluir contas de usuários do sistema de autenticação. Por favor, adicione SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente."
        };
    }

    try {
        // 1. Get user info for audit before they are gone
        const { data: targetProfile } = await supabase.from("profiles").select("*").eq("id", userId).single();
        const targetEmail = targetProfile?.email || "Usuário desconhecido";

        console.log(`🗑️ Iniciando exclusão definitiva do usuário: ${targetEmail} (${userId})`);

        // 2. Delete the user from Auth - This will automatically cascade to:
        // - public.profiles (via profiles_id_fkey)
        // - public.applications (via applications_user_id_fkey)
        // - public.documents (via documents_user_id_fkey)
        // No need to delete from profiles manually first, which can cause FK issues with audit logs.
        const { error: authError } = await adminClient.auth.admin.deleteUser(userId);

        if (authError) {
            console.error("Erro ao excluir usuário Auth:", authError);
            return { error: `Erro na autenticação: ${authError.message}` };
        }

        // 3. Register in audit log (use targetEmail collected before delete)
        await logAudit({
            entity: 'admin_users',
            entity_id: userId,
            action: `EXCLUSÃO_DEFINITIVA_USUÁRIO: ${targetEmail}`,
            before: targetProfile
        });

        // 4. Force refresh of relevant panels
        revalidatePath("/admin/users");
        revalidatePath("/admin/candidates");
        revalidatePath("/admin/kanban");
        revalidatePath("/admin");

        return { success: true };
    } catch (err: any) {
        console.error("Erro interno em deleteUser:", err);
        return { error: `Erro inesperado no servidor: ${err.message}` };
    }
}


export async function getUsers() {
    const supabase = await createClient();
    const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("role", { ascending: true })
        .order("created_at", { ascending: false });

    return error ? [] : profiles;
}

export async function updateUserRole(userId: string, newRole: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Não autorizado" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { error: "Acesso negado" };

    const { data: oldProfile } = await supabase.from("profiles").select("role").eq("id", userId).single();

    const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

    if (error) return { error: error.message };

    await logAudit({
        entity: 'admin_users',
        entity_id: userId,
        action: `ALTERAÇÃO_PERMISSÃO: ${oldProfile?.role} -> ${newRole}`,
        before: { role: oldProfile?.role },
        after: { role: newRole }
    });

    revalidatePath("/admin/users");
    return { success: true };
}

export async function createAdminUser(email: string, fullName: string) {
    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (!currentUser) return { error: "Não autorizado" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", currentUser.id).single();
    if (profile?.role !== "admin") return { error: "Acesso negado" };

    const adminClient = createAdminClient();
    if (!adminClient) return { error: "Erro de configuração." };

    const { data, error } = await adminClient.auth.admin.createUser({
        email,
        password: Math.random().toString(36).slice(-12),
        email_confirm: true,
        user_metadata: { full_name: fullName }
    });

    if (error) return { error: error.message };

    await adminClient
        .from("profiles")
        .update({ role: 'admin', full_name: fullName })
        .eq("id", data.user.id);

    await logAudit({
        entity: 'admin_users',
        entity_id: data.user.id,
        action: `CRIAÇÃO_ADMIN: ${email}`,
        after: { email, role: 'admin' }
    });

    revalidatePath("/admin/users");
    return { success: true };
}
