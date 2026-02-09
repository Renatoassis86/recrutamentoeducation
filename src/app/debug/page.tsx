"use client";

export default function DebugEnvPage() {
    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">Debug Environment Variables</h1>
            <div className="space-y-2">
                <div>
                    <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{" "}
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Present" : "❌ Missing"}
                </div>
                <div>
                    <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{" "}
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Present" : "❌ Missing"}
                </div>
            </div>
            <p className="mt-8 text-gray-500">
                If marked as Missing, the environment variables are not loaded in the browser bundle.
                This usually means the project needs a <strong>Redeploy</strong> in Vercel after adding the keys.
            </p>
        </div>
    );
}
