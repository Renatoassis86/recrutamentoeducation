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
 * EXCLUSÃO DEFINITIVA DE INSCRIÇÃO E CONTA (VIA RPC MASTER)
 */
export async function deleteApplication(id: string) {
    const supabase = await createClient();

    try {
        // 1. Get current application to find the user_id
        const { data: appData, error: fetchError } = await supabase
            .from("applications")
            .select("*, user_id")
            .eq("id", id)
            .single();

        if (fetchError || !appData) {
            return { error: "Inscrição não encontrada ou já excluída." };
        }

        const candidateUserId = appData.user_id;

        console.log(`🗑️ Chamando RPC de exclusão definitiva: ${appData.full_name} (${id})`);

        // 2. Chamar a função SQL com SECURITY DEFINER
        // Se houver um candidateUserId, usamos a função de exclusão de conta
        if (candidateUserId) {
            const { error: rpcError } = await supabase.rpc('delete_user_entirely', {
                target_user_id: candidateUserId
            });

            if (rpcError) {
                console.error("Erro no RPC de exclusão:", rpcError);
                return { error: `Erro no banco de dados: ${rpcError.message}` };
            }
        } else {
            // Se não houver user_id (caso raro), apaga apenas a linha da inscrição normalmente
            const { error: delError } = await supabase.from("applications").delete().eq("id", id);
            if (delError) return { error: delError.message };
        }

        // 3. Log Audit
        await logAudit({
            entity: 'applications',
            entity_id: id,
            action: 'EXCLUSÃO_DEFINITIVA_RPC',
            before: appData
        });

        revalidatePath("/admin/candidates");
        revalidatePath("/admin/users");
        revalidatePath("/admin/kanban");

        return { success: true };
    } catch (err: any) {
        console.error("Erro em deleteApplication:", err);
        return { error: `Erro inesperado: ${err.message}` };
    }
}

/**
 * EXCLUSÃO EM MASSA DE CANDIDATOS E CONTAS (VIA RPC)
 */
export async function deleteApplicationsBulk(ids: string[]) {
    const supabase = await createClient();
    const results = { success: 0, errors: 0 };

    for (const id of ids) {
        try {
            const { data: appData } = await supabase.from("applications").select("user_id, full_name").eq("id", id).single();

            if (appData?.user_id) {
                const { error: rpcError } = await supabase.rpc('delete_user_entirely', {
                    target_user_id: appData.user_id
                });

                if (!rpcError) {
                    results.success++;
                    await logAudit({
                        entity: 'applications',
                        entity_id: id,
                        action: 'EXCLUSÃO_MASSA_RPC',
                        before: appData
                    });
                } else {
                    console.error(`Erro ao excluir ${id}:`, rpcError);
                    results.errors++;
                }
            } else {
                await supabase.from("applications").delete().eq("id", id);
                results.success++;
            }
        } catch (e) {
            results.errors++;
        }
    }

    revalidatePath("/admin/candidates");
    revalidatePath("/admin/users");
    revalidatePath("/admin/kanban");

    return {
        success: results.errors === 0,
        message: `${results.success} candidatos excluídos com sucesso.${results.errors > 0 ? ` ${results.errors} falhas.` : ''}`,
        error: results.errors > 0 ? `${results.errors} falhas ocorreram.` : undefined
    };
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
        let supabase: any;
        const adminSupabase = createAdminClient();

        if (adminSupabase) {
            supabase = adminSupabase;
            console.log(`✅ Usando Service Role para: ${path}`);
        } else {
            console.warn("⚠️ Service Role Key não encontrada. Tentando usar sessão do administrador...");
            supabase = await createClient();
        }

        const { data, error } = await supabase
            .storage
            .from('applications')
            .createSignedUrl(path, 3600, forceDownload ? { download: true } : undefined);

        if (error) {
            console.error("Erro no Supabase Storage:", error);

            if (!adminSupabase) {
                return {
                    error: "Erro de Configuração Provedor: A 'SUPABASE_SERVICE_ROLE_KEY' não foi configurada nas variáveis de ambiente do seu servidor (Vercel). Adicione-a nas configurações do projeto para garantir o acesso aos arquivos."
                };
            }

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

