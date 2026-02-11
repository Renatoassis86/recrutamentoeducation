"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveEvaluation(formData: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Não autorizado" };

    // Check admin role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { error: "Proibido" };

    const { application_id, score_pedagogical, score_writing, score_alignment, comments } = formData;

    const { error } = await supabase
        .from("application_evaluations")
        .upsert({
            application_id,
            admin_id: user.id,
            score_pedagogical,
            score_writing,
            score_alignment,
            comments,
            updated_at: new Date().toISOString()
        }, { onConflict: 'application_id, admin_id' });

    if (error) {
        console.error("Error saving evaluation:", error);
        return { error: error.message };
    }

    revalidatePath(`/admin/candidates/${application_id}`);
    revalidatePath(`/admin/kanban`);
    return { success: true };
}

export async function getEvaluations(applicationId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("application_evaluations")
        .select("*, profiles:admin_id(full_name)")
        .eq("application_id", applicationId);

    if (error) return [];
    return data;
}
