"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { cookies } from "next/headers";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function signup(formData: FormData) {
    try {
        const supabase = await createClient();
        const admin = createAdminClient();

        const email = (formData.get("email") as string).toLowerCase().trim();
        const password = formData.get("password") as string;
        const fullName = formData.get("fullName") as string;

        // Safety check for Admin API if available
        if (admin) {
            const { data: userData, error: listError } = await admin.auth.admin.listUsers();

            if (!listError && userData?.users) {
                const existingUser = userData.users.find(u => u.email === email);
                if (existingUser) {
                    console.log("Resetting existing user to resolve registration loop:", email);
                    await admin.auth.admin.deleteUser(existingUser.id);
                }
            }
        }

        // Normal Signup
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            console.error("Signup Error:", error.message);
            return { error: error.message };
        }

        // AUTO-CONFIRM user immediately if admin API is available
        if (data.user && admin) {
            await admin.auth.admin.updateUserById(
                data.user.id,
                { email_confirm: true }
            );

            // Attempt auto-login
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) {
                return { message: "Conta criada! Por favor, faça login com sua senha." };
            }
        } else if (data.user && !admin) {
            return { message: "Conta criada! Verifique seu e-mail para confirmar (ou aguarde o admin ativar)." };
        }
    } catch (e: any) {
        console.error("Critical Signup Failure:", e);
        return { error: "Ocorreu um erro interno no servidor. Por favor, tente novamente." };
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function clearAllCookies() {
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();

    for (const cookie of allCookies) {
        cookieStore.delete(cookie.name);
    }

    revalidatePath("/", "layout");
    return { success: true };
}
