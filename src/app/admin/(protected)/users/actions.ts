"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

export async function deleteUser(userId: string) {
    const supabase = await createClient();

    try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', currentUser?.id).single();

        if (profile?.role === 'committee') {
            const { data: targetProfile } = await supabase.from("profiles").select("full_name").eq("id", userId).single();
            const { requestAuthorization } = await import("@/app/admin/actions");
            return await requestAuthorization({
                action_type: 'DELETE_USER',
                entity_type: 'admin_users',
                entity_id: userId,
                payload: {},
                description: `Solicitação de exclusão do usuário/admin: ${targetProfile?.full_name || userId}`
            });
        }
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
    // Only Admin can manage users, but Committee can maybe view? 
    // User says: "So o administrador geral que poderá entrar nessa pagina de admin junto com a comissão organizadora"
    if (profile?.role !== "admin" && profile?.role !== "committee") return [];

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

export async function createAdminUser(email: string, fullName: string) {
    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (!currentUser) return { error: "Não autorizado" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", currentUser.id).single();
    if (profile?.role !== "admin") return { error: "Acesso negado" };

    const adminClient = createAdminClient();
    if (!adminClient) return { error: "Erro de configuração: Chave mestre não encontrada." };

    const { data, error } = await adminClient.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: fullName }
    });

    if (error) return { error: error.message };

    // Update profile to ensure role is admin
    const { error: profileError } = await adminClient
        .from("profiles")
        .update({ role: "admin", full_name: fullName })
        .eq("id", data.user.id);

    if (profileError) return { error: profileError.message };

    await logAudit({
        entity: 'admin_users',
        entity_id: data.user.id,
        action: `CRIAÇÃO_ADMIN: ${email}`
    });

    revalidatePath("/admin/users");
    return { success: true };
}
export async function createCommitteeUser(email: string, fullName: string, password?: string, position?: string) {
    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (!currentUser) return { error: "Não autorizado" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", currentUser.id).single();
    // Only General Admin (admin) can create committee members
    if (profile?.role !== "admin") return { error: "Acesso negado: Apenas o administrador geral pode cadastrar a comissão." };

    const adminClient = createAdminClient();
    if (!adminClient) return { error: "Erro de configuração: Chave mestre não encontrada." };

    const { data, error } = await adminClient.auth.admin.createUser({
        email,
        password, // Optional, if provided
        email_confirm: true,
        user_metadata: { full_name: fullName }
    });

    let userId = data?.user?.id;

    if (error) {
        if (error.message.includes("already been registered")) {
            // User exists in Auth, let's find them
            const { data: usersData, error: listError } = await adminClient.auth.admin.listUsers();
            if (listError) return { error: `Usuário já existe, mas falha ao listar: ${listError.message}` };

            const existingUser = usersData.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
            if (!existingUser) return { error: "Erro de sincronia: Usuário diz que existe mas não foi encontrado." };

            userId = existingUser.id;
        } else {
            return { error: error.message };
        }
    }

    // Update profile to ensure role is committee and set position
    const { error: profileError } = await adminClient
        .from("profiles")
        .upsert({
            id: userId,
            role: "committee",
            full_name: fullName,
            position: position || "Membro da Comissão",
            email: email.toLowerCase()
        }, { onConflict: 'id' });

    if (profileError) return { error: profileError.message };

    await logAudit({
        entity: 'admin_users',
        entity_id: userId,
        action: `CRIAÇÃO_COMISSÃO: ${email} (Cargo: ${position})`
    });

    revalidatePath("/admin/commission");
    return { success: true };
}

export async function updateUser(userId: string, data: { full_name?: string, role?: string, position?: string, email?: string }) {
    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (!currentUser) return { error: "Não autorizado" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", currentUser.id).single();
    if (profile?.role !== "admin") return { error: "Acesso negado" };

    const adminClient = createAdminClient();
    if (!adminClient) return { error: "Falha ao inicializar client admin" };

    // 1. Get current data for audit
    const { data: beforeUpdate } = await adminClient.from("profiles").select("*").eq("id", userId).single();

    // 2. Prepare updates for Profile
    const profileUpdates: any = {};
    if (data.full_name) profileUpdates.full_name = data.full_name;
    if (data.role) profileUpdates.role = data.role;
    if (data.position !== undefined) profileUpdates.position = data.position;

    const { error: profileError } = await adminClient
        .from("profiles")
        .update(profileUpdates)
        .eq("id", userId);

    if (profileError) return { error: profileError.message };

    // 3. Update Auth email if provided
    if (data.email && data.email !== beforeUpdate?.email) {
        const { error: authError } = await adminClient.auth.admin.updateUserById(userId, {
            email: data.email
        });
        if (authError) return { error: `Perfil atualizado, mas falha ao mudar email no Auth: ${authError.message}` };
    }

    // 4. Audit
    await logAudit({
        entity: 'admin_users',
        entity_id: userId,
        action: `ATUALIZAÇÃO_PERFIL: ${beforeUpdate?.email}`,
        before: beforeUpdate,
        after: { ...beforeUpdate, ...profileUpdates, email: data.email || beforeUpdate?.email }
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin/commission");

    return { success: true };
}
