"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

export async function deleteUser(userId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Não autorizado" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { error: "Acesso negado" };

    const adminClient = createAdminClient();
    if (!adminClient) return { error: "Erro de configuração do servidor." };

    // Get info for audit
    const { data: targetProfile } = await supabase.from("profiles").select("*").eq("id", userId).single();

    // Delete profile first to avoid orphan records or foreign key issues if any (though usually it's the other way around)
    // Actually, delete from profiles
    const { error: profileError } = await adminClient.from("profiles").delete().eq("id", userId);
    if (profileError) return { error: "Erro ao excluir perfil: " + profileError.message };

    const { error } = await adminClient.auth.admin.deleteUser(userId);
    if (error) return { error: error.message };

    await logAudit({
        entity: 'admin_users',
        entity_id: userId,
        action: `EXCLUSÃO_USUÁRIO: ${targetProfile?.email}`,
        before: targetProfile
    });

    revalidatePath("/admin/users");
    return { success: true };
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
