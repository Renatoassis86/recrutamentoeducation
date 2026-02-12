"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

/**
 * BUSCA TODAS AS INSCRIÇÕES COM DADOS REAIS
 */
export async function getApplications(filters: any = {}) {
    const supabase = await createClient();

    let query = supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

    if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status);
    if (filters.state) query = query.eq('state', filters.state);
    if (filters.profile_type) query = query.eq('profile_type', filters.profile_type);

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

/**
 * ATUALIZA STATUS COM TRILHA DE AUDITORIA E HISTÓRICO KANBAN
 */
export async function updateApplicationStatus(id: string, newStatus: string, note?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Get current state for audit
    const { data: current } = await supabase
        .from("applications")
        .select("status, full_name")
        .eq("id", id)
        .single();

    if (!current) return { error: "Inscrição não encontrada" };

    // 2. Update Application
    const { error } = await supabase
        .from("applications")
        .update({ status: newStatus as any, updated_at: new Date().toISOString() })
        .eq("id", id);

    if (error) return { error: error.message };

    // 3. Register Kanban History
    await supabase.from('kanban_history').insert({
        application_id: id,
        from_status: current.status,
        to_status: newStatus,
        moved_by_admin_id: user?.id,
        note
    });

    // 4. Log Audit
    await logAudit({
        entity: 'kanban',
        entity_id: id,
        action: `MOVIMENTAÇÃO_FASE: ${current.status} -> ${newStatus}`,
        before: { status: current.status },
        after: { status: newStatus }
    });

    revalidatePath("/admin");
    revalidatePath("/admin/kanban");
    revalidatePath(`/admin/candidates/${id}`);

    return { success: true };
}

/**
 * EXCLUSÃO DE INSCRIÇÃO (APENAS ADMIN MASTER)
 */
export async function deleteApplication(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Verificação de Role (simplificada via profiles)
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();
    if (profile?.role !== 'admin') return { error: "Acesso negado: Apenas administradores mestre podem excluir registros." };

    // Audit before delete
    const { data: current } = await supabase.from("applications").select("*").eq("id", id).single();

    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) return { error: error.message };

    await logAudit({
        entity: 'applications',
        entity_id: id,
        action: 'EXCLUSÃO_REGISTRO',
        before: current
    });

    revalidatePath("/admin/candidates");
    return { success: true };
}

/**
 * BUSCA DE AUDITORIA
 */
export async function getAuditLogs() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('audit_log')
        .select(`
            *,
            admin:admin_id(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) throw error;
    return data;
}

/**
 * BUSCA TODOS OS DOCUMENTOS ENVIADOS
 */
export async function getAllDocuments() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('documents')
        .select(`
            *,
            applications:application_id(full_name, email)
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}
/**
 * GERA URL ASSINADA COM PRIVILÉGIOS DE ADMIN (SERVICE ROLE)
 */
import { createAdminClient } from "@/utils/supabase/admin";

export async function getAdminSignedUrl(path: string, forceDownload: boolean = false) {
    try {
        const adminSupabase = createAdminClient();

        if (!adminSupabase) {
            return { error: "Erro de configuração: Chave Service Role não encontrada no servidor. Verifique as variáveis de ambiente." };
        }

        console.log(`Solicitando URL assinada para: ${path}${forceDownload ? ' (Download)' : ''}`);

        const { data, error } = await adminSupabase
            .storage
            .from('applications')
            .createSignedUrl(path, 3600, forceDownload ? { download: true } : undefined);

        if (error) {
            console.error("Erro no Supabase Storage:", error);
            if (error.message.includes('Object not found') || error.message.includes('404')) {
                return { error: "O arquivo não foi encontrado no servidor. Ele pode ter sido removido ou o caminho está incorreto." };
            }
            return { error: `Erro ao acessar o storage: ${error.message}` };
        }

        if (!data?.signedUrl) {
            return { error: "O servidor não retornou uma URL válida para o arquivo." };
        }

        return { signedUrl: data.signedUrl };
    } catch (err: any) {
        console.error("Erro interno em getAdminSignedUrl:", err);
        return { error: `Erro inesperado: ${err.message}` };
    }
}
