import { createBrowserClient } from "@supabase/ssr";

// Hardcoded fallback for production deployment (Public keys only so safe to expose if needed)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mhkyutqqciueevjnlsfy.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFub24iLCJpYXQiOjE3NzA0OTIxODgsImV4cCI6MjA4NjA2ODE4OH0.kT-4EkfupW-WLXk6pdwvLVTMI_RhwkpHsIEDlDTHKPg";

export function createClient() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.warn("Supabase env vars missing in client!");
    }

    return createBrowserClient(
        SUPABASE_URL as string,
        SUPABASE_ANON_KEY as string
    );
}
