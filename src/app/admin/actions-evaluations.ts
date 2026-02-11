"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

export async function saveEvaluation(formData: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Não autorizado" };

    const { application_id, score_pedagogical, score_writing, score_alignment, comments } = formData;

    // Calculate overall score
    const overall = (score_pedagogical + score_writing + score_alignment) / 3;

    const { error } = await supabase
        .from("application_reviews")
        .upsert({
            application_id,
            admin_id: user.id,
            scores_json: {
                pedagogical: score_pedagogical,
                writing: score_writing,
                alignment: score_alignment
            },
            notes: comments,
            overall_score: overall,
            updated_at: new Date().toISOString()
        }, { onConflict: 'application_id, admin_id' });

    if (error) {
        console.error("Error saving evaluation:", error);
        return { error: error.message };
    }

    // Pro-active: Update overall score in application for fast sorting/kanban view
    // (This matches the objective of having ranking in Kanban)
    await supabase.from('applications').update({ overall_score: overall }).eq('id', application_id);

    await logAudit({
        entity: 'applications',
        entity_id: application_id,
        action: 'AVALIAÇÃO_TÉCNICA',
        after: { overall_score: overall }
    });

    revalidatePath(`/admin/candidates/${application_id}`);
    revalidatePath(`/admin/kanban`);
    return { success: true };
}

export async function getEvaluations(applicationId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("application_reviews")
        .select("*, profiles:admin_id(full_name)")
        .eq("application_id", applicationId);

    if (error) return [];
    return data;
}
