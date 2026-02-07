"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
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
        return { error: "Dados inválidos" };
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            // role is not updating here
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (error) {
        return { error: "Erro ao atualizar perfil" };
    }

    // We also need to update/create the application draft with personal info if it corresponds to columns in applications table
    // The schema has columns like full_name, email, phone, city, state in 'applications' table?
    // Let's check initial_schema.sql.
    // Yes: full_name, email, phone, city, state are in 'applications'.
    // But they are NOT in 'profiles' (only role).
    // Wait, my initial_schema.sql says:
    /*
     create table public.profiles (
       id uuid references auth.users on delete cascade not null primary key,
       role app_role not null default 'candidate',
       ...
     );
     create table public.applications (
       ...
       full_name text not null,
       email text not null,
       phone text,
       city text,
       state text,
       ...
     );
    */
    // So 'profiles' is mostly for auth role. The Personal Info goes into 'applications'.

    // Check if application exists
    const { data: existingApp } = await supabase
        .from("applications")
        .select("id")
        .eq("user_id", user.id)
        .single();

    let appError;
    if (existingApp) {
        const { error } = await supabase
            .from("applications")
            .update({
                full_name: validated.data.full_name,
                email: validated.data.email, // keeping email in sync
                phone: validated.data.phone,
                city: validated.data.city,
                state: validated.data.state,
                updated_at: new Date().toISOString(),
            })
            .eq("id", existingApp.id);
        appError = error;
    } else {
        const { error } = await supabase
            .from("applications")
            .insert({
                user_id: user.id,
                full_name: validated.data.full_name,
                email: validated.data.email,
                phone: validated.data.phone,
                city: validated.data.city,
                state: validated.data.state,
                profile_type: 'licenciado', // default, will be updated in next step or concurrent
                status: 'received', // actually 'draft' would be better but enum has 'received'. Let's stick to 'received' or null? Enum is strict.
                // The schema defined default 'received'.
            });
        appError = error;
    }

    if (appError) {
        return { error: "Erro ao salvar candidatura: " + appError.message };
    }

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
