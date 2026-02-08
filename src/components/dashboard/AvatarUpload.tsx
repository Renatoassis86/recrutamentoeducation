"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { User, Camera, Loader2 } from "lucide-react";
import Image from "next/image";

interface AvatarUploadProps {
    userId: string;
    initialUrl?: string | null;
    userName: string;
}

export default function AvatarUpload({ userId, initialUrl, userName }: AvatarUploadProps) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(initialUrl || null);
    const [uploading, setUploading] = useState(false);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        if (initialUrl) setAvatarUrl(initialUrl);
    }, [initialUrl]);

    // Construct public URL if it's a path
    const getPublicUrl = (path: string) => {
        if (path.startsWith("http")) return path;
        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        return data.publicUrl;
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("Selecione uma imagem para enviar.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const filePath = `${userId}/avatar_${Date.now()}.${fileExt}`;

            // 1. Upload to 'avatars' bucket (assuming it exists, or we use 'applications' as fallback if configured)
            // Let's assume 'avatars' bucket for separation, if not user might need to create it.
            // We'll try 'avatars' first.
            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                // Return descriptive error if bucket missing
                throw uploadError;
            }

            // 2. Update profile
            const { error: updateError } = await supabase
                .from("profiles")
                .update({ avatar_url: filePath })
                .eq("id", userId);

            if (updateError) throw updateError;

            setAvatarUrl(filePath);

        } catch (error: any) {
            console.error("Erro no upload:", error);
            alert("Erro ao atualizar foto. Verifique se o bucket 'avatars' existe e é público.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative group">
            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-white shadow-lg overflow-hidden bg-slate-100 flex items-center justify-center relative">
                {avatarUrl ? (
                    <Image
                        src={getPublicUrl(avatarUrl)}
                        alt={userName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 96px, 128px"
                    />
                ) : (
                    <User className="h-12 w-12 sm:h-16 sm:w-16 text-slate-300" />
                )}

                {/* Loading State */}
                {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                )}

                {/* Hover Edit Overlay */}
                <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                >
                    <Camera className="h-8 w-8 mb-1" />
                    <span className="text-xs font-medium">Alterar</span>
                </label>
                <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="hidden"
                />
            </div>

        </div>
    );
}
