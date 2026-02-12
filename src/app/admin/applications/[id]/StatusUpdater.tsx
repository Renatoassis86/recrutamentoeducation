"use client";

import { useState } from "react";
import { updateApplicationStatus } from "../../actions";
import { useRouter } from "next/navigation";

export default function StatusUpdater({ id, currentStatus }: { id: string, currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const statuses = [
        { value: 'received', label: 'Recebido' },
        { value: 'under_review', label: 'Em Análise' },
        { value: 'info_requested', label: 'Informações Solicitadas' },
        { value: 'interview_invited', label: 'Convidado p/ Entrevista' },
        { value: 'closed', label: 'Fechado / Encerrado' },
    ];

    const handleUpdate = async (newStatus: string) => {
        setLoading(true);
        const res = await updateApplicationStatus(id, newStatus) as any;
        setLoading(false);

        if (res.success) {
            if (res.message) {
                alert(res.message);
            } else {
                setStatus(newStatus);
                router.refresh();
            }
        } else {
            alert("Erro ao atualizar: " + (res.error || "Tente novamente."));
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
                <button
                    key={s.value}
                    onClick={() => handleUpdate(s.value)}
                    disabled={loading}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors
                        ${status === s.value
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                        }
                    `}
                >
                    {s.label}
                </button>
            ))}
        </div>
    );
}
