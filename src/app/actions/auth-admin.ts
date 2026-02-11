"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

/**
 * LOGIN ADMINISTRATIVO SEGURO (SUPABASE AUTH + RBAC)
 */
export async function loginAdmin(formData: FormData) {
    const email = formData.get("username") as string;
    const password = formData.get("password") as string;

    const supabase = await createClient();

    // 1. Autenticar no Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: "Credenciais inválidas ou acesso negado." };
    }

    // 2. Verificar se o perfil tem permissão de Admin (RBAC)
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

    if (profile?.role !== "admin") {
        await supabase.auth.signOut();
        return { error: "Acesso negado: Este usuário não possui privilégios administrativos." };
    }

    redirect("/admin");
}

/**
 * LOGOUT E LIMPEZA DE SESSÃO
 */
export async function logoutAdmin() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/admin/login");
}
