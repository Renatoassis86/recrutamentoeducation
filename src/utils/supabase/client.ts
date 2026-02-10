import { createBrowserClient } from "@supabase/ssr";

// Hardcoded fallback for production deployment (Public keys only)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.warn("Supabase env vars missing in client!");
    }

    return createBrowserClient(
        SUPABASE_URL as string,
        SUPABASE_ANON_KEY as string
    );
}
