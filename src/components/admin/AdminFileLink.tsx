"use client";

import { useEffect, useState } from "react";
import { Download, Loader2, Eye } from "lucide-react";

export default function AdminFileLink({ path, name }: { path: string, name: string }) {
    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGetUrl = async () => {
        setLoading(true);
        try {
            const { getAdminSignedUrl } = await import("@/app/admin/actions");
            const res = await getAdminSignedUrl(path);

            if (res.error) throw new Error(res.error);

            if (res.signedUrl) {
                window.open(res.signedUrl, '_blank');
            }
        } catch (error) {
            console.error("Error getting signed URL:", error);
            alert("Erro ao carregar o arquivo. Verifique se ele ainda existe no storage.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleGetUrl}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-all disabled:opacity-50"
            title="Visualizar documento"
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
        </button>
    );
}
