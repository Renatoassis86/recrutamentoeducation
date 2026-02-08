"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full text-center border border-gray-200">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
                        <div className="bg-gray-100 p-4 rounded text-left overflow-auto max-h-60 mb-6 text-sm font-mono text-slate-800">
                            <p className="font-bold">Error Message:</p>
                            <p>{error.message}</p>
                            {error.digest && (
                                <p className="mt-2 text-gray-500">Digest: {error.digest}</p>
                            )}
                        </div>
                        <button
                            onClick={() => reset()}
                            className="bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
