"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import CommunicationModal from "./CommunicationModal";

interface DossierContactActionsProps {
    email: string;
    fullName: string;
}

export default function DossierContactActions({ email, fullName }: DossierContactActionsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-amber-400 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
            >
                <Mail className="h-4 w-4" /> Enviar E-mail
            </button>

            <CommunicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type="email"
                recipients={[email]}
                names={[fullName]}
            />
        </>
    );
}
