import { createClient } from "@supabase/supabase-js";

// Hardcoded keys for immediate fix (Server-side ONLY - safe from client bundle)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mhkyutqqciueevjnlsfy.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "sb_secret_XbDWiAITsTurtfINe32_Ug_V_2soa8o";

export function createAdminClient() {
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
        console.warn("Supabase Admin credentials missing. Admin operations will be skipped.");
        return null;
    }

    return createClient(SUPABASE_URL as string, SERVICE_ROLE_KEY as string, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
