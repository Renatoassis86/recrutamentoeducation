import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    // Fallback to empty string to prevent build time crash if vars are missing
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

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
