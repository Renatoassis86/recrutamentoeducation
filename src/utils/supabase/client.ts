import { createBrowserClient } from "@supabase/ssr";

// Hardcoded fallback for production deployment (Public keys only)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mhkyutqqciueevjnlsfy.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_EN1IvzdsBVR3lFj8EV0tZg_m1e9Qh0G";

export function createClient() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.warn("Supabase env vars missing in client!");
    }

    return createBrowserClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );
}
