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
    const supabase = await createClient();
    const admin = createAdminClient();

    const email = (formData.get("email") as string).toLowerCase().trim();
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    // Check if user exists and delete if needed (Force Reset behavior)
    // The user wants a clean slate, so if someone is "stuck", we reset them.
    const { data: { users }, error: listError } = await admin.auth.admin.listUsers();
    const existingUser = users?.find(u => u.email === email);

    if (existingUser) {
        console.log("Resetting existing user to resolve registration loop:", email);
        await admin.auth.admin.deleteUser(existingUser.id);
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

    // AUTO-CONFIRM user immediately using Admin API to bypass email verification wall
    if (data.user) {
        const { error: confirmError } = await admin.auth.admin.updateUserById(
            data.user.id,
            { email_confirm: true }
        );

        if (confirmError) console.error("Auto-confirm error:", confirmError.message);

        // After auto-confirm, we still need to log them in properly or they just log in manually.
        // Actually, signUp with return session if auto-confirm was already on in dashboard.
        // Since it's likely NOT on, we tell them to log in now.

        // Let's attempt to log them in immediately on the server side to be seamless.
        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) {
            console.error("Auto-login error after confirm:", loginError.message);
            return { message: "Conta criada e confirmada! Por favor, faça login abaixo." };
        }
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
