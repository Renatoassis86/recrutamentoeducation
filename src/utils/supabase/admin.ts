import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mhkyutqqciueevjnlsfy.supabase.co";
    // HARDCODED FALLBACK FOR EMERGENCY ACCESS
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "sb_secret_XbDWiAITsTurtfINe32_Ug_V_2soa8o";

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error("❌ CRITICAL: Missing Supabase Admin Keys!", {
            url: !!supabaseUrl,
            key: !!supabaseServiceKey
        });

        return null;
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}
