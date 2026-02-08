export const dynamic = "force-dynamic";

export default function DebugPage() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const urlStatus = url ? `Defined (Starts with: ${url.substring(0, 8)}...)` : "UNDEFINED / Esvaziado";
    const keyStatus = key ? `Defined (Starts with: ${key.substring(0, 5)}...)` : "UNDEFINED / Esvaziado";

    return (
        <div className="p-10 font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">Vercel Environment Debugger</h1>
            <div className="bg-gray-100 p-4 rounded border border-gray-300 space-y-2">
                <p><strong>URL:</strong> {urlStatus}</p>
                <p><strong>KEY:</strong> {keyStatus}</p>
                <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
            </div>
            <p className="mt-4 text-gray-600">
                Se aparecer "UNDEFINED", as variáveis não estão chegando no servidor do Vercel.
                <br />
                Verifique: Settings -&gt; Environment Variables.
            </p>
        </div>
    );
}
