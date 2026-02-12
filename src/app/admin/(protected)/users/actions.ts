"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

export async function deleteUser(userId: string) {
    const supabase = await createClient();

    try {
        // 1. Get info for audit before they are gone
        const { data: targetProfile } = await supabase.from("profiles").select("*").eq("id", userId).single();
        const targetEmail = targetProfile?.email || "Usuário desconhecido";

        console.log(`🗑️ Chamando RPC de exclusão de usuário: ${targetEmail} (${userId})`);

        // 2. Chamar a função SQL com SECURITY DEFINER
        // Isso irá apagar o usuário no Auth e disparar o cascade para tudo
        const { error: rpcError } = await supabase.rpc('delete_user_entirely', {
            target_user_id: userId
        });

        if (rpcError) {
            console.error("Erro no RPC de exclusão de usuário:", rpcError);
            return { error: `Erro no banco de dados: ${rpcError.message}` };
        }

        // 3. Register in audit log
        await logAudit({
            entity: 'admin_users',
            entity_id: userId,
            action: `EXCLUSÃO_DEFINITIVA_USUÁRIO: ${targetEmail}`,
            before: targetProfile
        });

        // 4. Force refresh
        revalidatePath("/admin/users");
        revalidatePath("/admin/candidates");
        revalidatePath("/admin/kanban");

        return { success: true };
    } catch (err: any) {
        console.error("Erro interno em deleteUser:", err);
        return { error: `Erro inesperado: ${err.message}` };
    }
}

export async function getUsers() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return [];

    const { data: users, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching users:", error);
        return [];
    }

    return users || [];
}

export async function updateUserRole(userId: string, role: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Não autorizado" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { error: "Acesso negado" };

    const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", userId);

    if (error) return { error: error.message };

    await logAudit({
        entity: 'admin_users',
        entity_id: userId,
        action: `ALTERAÇÃO_ROLE: para ${role}`
    });

    revalidatePath("/admin/users");
    return { success: true };
}
