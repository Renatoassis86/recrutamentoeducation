"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Não autorizado" };
    }

    // Check if current user is admin
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        return { error: "Acesso negado" };
    }

    const adminClient = createAdminClient();

    // Delete the user from auth.users (this should cascade if configured, or we might need to delete profile first)
    // Assuming Supabase cascade delete is set up for public.profiles -> auth.users
    if (!adminClient) {
        return { error: "Erro de configuração do servidor: Chave de Admin não encontrada." };
    }

    const { error } = await adminClient.auth.admin.deleteUser(userId);

    if (error) {
        console.error("Error deleting user:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/users");
    return { success: true };
}

export async function getUsers() {
    const supabase = await createClient();
    // We can't list auth users with normal client. 
    // We can list profiles.

    const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return [];
    }

    return profiles;
}
