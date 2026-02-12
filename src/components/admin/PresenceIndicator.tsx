"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "lucide-react";

export default function PresenceIndicator() {
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchUserAndSubscribe = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, role')
                .eq('id', user.id)
                .single();

            const channel = supabase.channel('online-admins', {
                config: {
                    presence: {
                        key: user.id,
                    },
                },
            });

            channel
                .on('presence', { event: 'sync' }, () => {
                    const state = channel.presenceState();
                    const users = Object.values(state).flat().map((p: any) => p.user_info);
                    // Remove duplicates by ID
                    const uniqueUsers = Array.from(new Map(users.map(u => [u.id, u])).values());
                    setOnlineUsers(uniqueUsers);
                })
                .subscribe(async (status) => {
                    if (status === 'SUBSCRIBED') {
                        await channel.track({
                            user_info: {
                                id: user.id,
                                full_name: profile?.full_name || user.email,
                                role: profile?.role
                            },
                            online_at: new Date().toISOString(),
                        });
                    }
                });

            return () => {
                channel.unsubscribe();
            };
        };

        fetchUserAndSubscribe();
    }, []);

    if (onlineUsers.length === 0) return null;

    return (
        <div className="flex items-center gap-2">
            <div className="flex -space-x-2 overflow-hidden">
                {onlineUsers.slice(0, 5).map((user) => (
                    <div
                        key={user.id}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center overflow-hidden"
                        title={`${user.full_name} (${user.role === 'admin' ? 'Admin' : 'Comissão'})`}
                    >
                        <div className="bg-amber-500 text-white text-[10px] font-bold w-full h-full flex items-center justify-center uppercase">
                            {(user.full_name?.[0] || 'A')}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</span>
                <span className="text-[11px] font-bold text-green-600 flex items-center gap-1">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                    {onlineUsers.length} {onlineUsers.length === 1 ? 'Online' : 'Online agora'}
                </span>
            </div>
        </div>
    );
}
