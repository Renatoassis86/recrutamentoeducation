import { SupabaseClient } from "@supabase/supabase-js";

export function createMockClient(): SupabaseClient {
    console.warn("⚠️  Initializing Mock Supabase Client due to missing Env Vars. Auth and DB calls will fail gracefully.");

    const mock: any = {
        auth: {
            getUser: async () => ({ data: { user: null }, error: { message: "Missing Environment Variables" } }),
            signInWithPassword: async () => ({ data: { user: null }, error: handleMissingEnv() }),
            signUp: async () => ({ data: { user: null }, error: handleMissingEnv() }),
            signOut: async () => ({ error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        },
        from: (table: string) => ({
            select: () => createQueryBuilder(),
            insert: () => createQueryBuilder(),
            update: () => createQueryBuilder(),
            delete: () => createQueryBuilder(),
            upsert: () => createQueryBuilder(),
        }),
        storage: {
            from: (bucket: string) => ({
                upload: async () => ({ data: null, error: handleMissingEnv() }),
                getPublicUrl: () => ({ data: { publicUrl: "" } }),
            })
        }
    };

    return mock as SupabaseClient;
}

function handleMissingEnv() {
    return {
        message: "Supabase Environment Variables are missing. Check Vercel project settings.",
        status: 500
    };
}

function createQueryBuilder() {
    const builder: any = {
        select: () => builder,
        insert: () => builder,
        update: () => builder,
        delete: () => builder,
        eq: () => builder,
        in: () => builder,
        single: async () => ({ data: null, error: handleMissingEnv() }),
        maybeSingle: async () => ({ data: null, error: handleMissingEnv() }),
        then: (resolve: any) => resolve({ data: null, error: handleMissingEnv() })
    };
    return builder;
}
