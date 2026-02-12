"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { sendConfirmationEmail } from "@/utils/mail";
import {
    personalSchema,
    educationSchema,
    experienceSchema,
    PersonalFormData,
    EducationFormData,
    ExperienceFormData
} from "@/schemas/application";

export async function saveProfile(data: PersonalFormData) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: "Usuário não autenticado" };
    }

    const validated = personalSchema.safeParse(data);
    if (!validated.success) {
        return { error: "Dados inválidos: " + JSON.stringify(validated.error.format()) };
    }

    // Check if application exists
    const { data: existingApp } = await supabase
        .from("applications")
        .select("id")
        .eq("user_id", user.id)
        .single();

    const payload = {
        full_name: validated.data.full_name,
        cpf: validated.data.cpf,
        email: validated.data.email,
        phone: validated.data.phone,
        city: validated.data.city,
        state: validated.data.state,
        profile_type: validated.data.profile_type,
        licensure_area: validated.data.licensure_area ?? null,
        pedagogy_areas: validated.data.pedagogy_areas ?? null,
        updated_at: new Date().toISOString(),
    };

    let appError;
    if (existingApp) {
        const { error } = await supabase
            .from("applications")
            .update(payload)
            .eq("id", existingApp.id);
        appError = error;
    } else {
        const { error } = await supabase
            .from("applications")
            .insert({
                ...payload,
                user_id: user.id,
                status: 'draft',
            });
        appError = error;
    }

    if (appError) {
        console.error("Error saving profile:", appError);
        if (appError.code === '23505' || appError.message.includes('cpf')) {
            return { error: "CPF já cadastrado. Por favor, verifique seus dados ou entre em contato." };
        }
        return { error: "Erro ao salvar: " + appError.message };
    }

    revalidatePath("/application");
    return { success: true };
}

export async function submitApplication() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // 1. Fetch current application data to verify
    const { data: app, error: fetchError } = await supabase
        .from("applications")
        .select(`
            *,
            documents(id)
        `)
        .eq("user_id", user.id)
        .single();

    if (fetchError || !app) return { error: "Candidatura não localizada. Por favor, preencha os dados básicos primeiro." };

    // 2. Strict Validation Check
    const errors = [];
    if (!app.full_name || !app.cpf || !app.email) errors.push("Dados pessoais incompletos.");
    if (!app.graduation_course || !app.graduation_institution) errors.push("Dados de formação acadêmica incompletos.");
    if (!app.experience_summary || app.experience_summary.length < 50) errors.push("O resumo de experiência é obrigatório (mínimo 50 caracteres).");
    if (!app.documents || app.documents.length === 0) errors.push("O anexo do Currículo e Texto Autoral em PDF é obrigatório.");

    if (errors.length > 0) {
        return { error: "Não foi possível finalizar. Corrija os seguintes itens: " + errors.join(" ") };
    }

    // 3. Update status to received
    const { error } = await supabase
        .from("applications")
        .update({
            status: 'received',
            updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id);

    if (error) return { error: error.message };

    // Send confirmation email
    await sendConfirmation();

    revalidatePath("/application");
    revalidatePath("/dashboard");
    revalidatePath("/admin");
    revalidatePath("/admin/candidates");
    return { success: true };
}

export async function saveDeclarations(data: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // Update application with declarations
    const { error } = await supabase
        .from("applications")
        .update({
            terms_accepted: data,
            updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

    if (error) return { error: error.message };
    revalidatePath("/application");
    return { success: true };
}

export async function saveEducation(data: EducationFormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const validated = educationSchema.safeParse(data);
    if (!validated.success) return { error: "Dados inválidos" };

    // Update application
    const { error } = await supabase
        .from("applications")
        .update({
            graduation_course: validated.data.graduation_course,
            graduation_institution: validated.data.graduation_institution,
            graduation_year: validated.data.graduation_year,
            postgrad_areas: validated.data.postgrad_areas,
            updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

    if (error) return { error: error.message };
    revalidatePath("/application");
    return { success: true };
}

export async function saveExperience(data: ExperienceFormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const validated = experienceSchema.safeParse(data);
    if (!validated.success) return { error: "Dados inválidos" };

    const { error } = await supabase
        .from("applications")
        .update({
            experience_years: validated.data.experience_years,
            experience_summary: validated.data.experience_summary,
            updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

    if (error) return { error: error.message };
    revalidatePath("/application");
    return { success: true };
}



export async function sendConfirmation() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) return { error: "User not found" };

    // Get profile for name
    const { data: app } = await supabase
        .from("applications")
        .select("full_name")
        .eq("user_id", user.id)
        .single();

    const name = app?.full_name || "Candidato";

    const result = await sendConfirmationEmail(user.email, name);
    return result;
}
