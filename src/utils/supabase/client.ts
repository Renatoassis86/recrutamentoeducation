import { createBrowserClient } from "@supabase/ssr";
import { createMockClient } from "./mock";

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!supabaseUrl || !supabaseKey) {
        console.warn("Supabase env vars missing in client! Using mock client.");
        return createMockClient();
    }

    return createBrowserClient(
        supabaseUrl,
        supabaseKey
    );
}
