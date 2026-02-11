import { createClient } from "@/utils/supabase/server";

export async function logAudit(action: {
    entity: 'applications' | 'kanban' | 'comms' | 'admin_users' | 'files';
    entity_id?: string;
    action: string;
    before?: any;
    after?: any;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('audit_log').insert({
        admin_id: user?.id,
        entity: action.entity,
        entity_id: action.entity_id,
        action: action.action,
        before_json: action.before,
        after_json: action.after,
        // IP and UserAgent are better handled in middleware or API routes
    });

    if (error) {
        console.error('Audit Log Error:', error);
    }
}
