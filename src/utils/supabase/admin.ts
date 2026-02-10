import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
