import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createMockClient } from "./mock";

// Hardcoded fallback for production deployment (Public keys only)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
    const cookieStore = cookies();
    // Fallback Hardcoded Keys (To fix Vercel Environment Issue)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mhkyutqqciueevjnlsfy.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFub24iLCJpYXQiOjE3NzA0OTIxODgsImV4cCI6MjA4NjA2ODE4OH0.kT-4EkfupW-WLXk6pdwvLVTMI_RhwkpHsIEDlDTHKPg";

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("❌ FAILED: Supabase Keys missing on Server!", {
            url_present: !!supabaseUrl,
            key_present: !!supabaseAnonKey
        });
        return createMockClient();
    }

    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
}
