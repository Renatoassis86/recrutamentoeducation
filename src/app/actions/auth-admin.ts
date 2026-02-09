"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (username === "admin" && password === "recrutamento2026") {
        // Set cookie for 24 hours
        cookies().set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24,
            path: "/",
        });
        redirect("/admin");
    } else {
        return { error: "Credenciais inválidas" };
    }
}

export async function logoutAdmin() {
    cookies().delete("admin_session");
    redirect("/admin/login");
}
