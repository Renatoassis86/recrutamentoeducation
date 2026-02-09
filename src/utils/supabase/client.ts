import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    // Fallback to empty string to prevent build time crash if vars are missing
    // Fallback to explicit values since Vercel env vars are failing
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mhkyutqqciueevjnlsfy.supabase.co";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_EN1IvzdsBVR3lFj8EV0tZg_m1e9Qh0G";

    if (!supabaseUrl || !supabaseKey) {
        console.warn("Supabase env vars missing in client!");
        // We can returns null or a dummy if needed, but createBrowserClient might throw.
        // Let's return normally, it usually handles empty strings by just not working, but not crashing the *build* of the file itself unless invoked.
    }

    return createBrowserClient(
        supabaseUrl,
        supabaseKey
    );
}
