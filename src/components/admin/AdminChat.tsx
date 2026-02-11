"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { MessageSquare, Send, User, Loader2, X } from "lucide-react";
import { format } from "date-fns";

export default function AdminChat() {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    useEffect(() => {
        if (!isOpen) return;

        fetchMessages();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('admin_chat')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'admin_chat_messages'
            }, (payload) => {
                setMessages(current => [...current, payload.new]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    async function fetchMessages() {
        const { data } = await supabase
            .from('admin_chat_messages')
            .select(`
                *,
                admin:admin_id(full_name, email)
            `)
            .order('created_at', { ascending: true })
            .limit(100);

        if (data) setMessages(data);
        setLoading(false);
    }

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase
                .from('admin_chat_messages')
                .insert({
                    content: newMessage,
                    admin_id: user?.id
                });

            if (error) throw error;
            setNewMessage("");
            // We fetch messages again to get the one we just sent with its profile joined
            // or we could optimistically update, but simpler for now to let realtime/refetch handle it
            fetchMessages();
        } catch (err) {
            console.error("Chat Error:", err);
        } finally {
            setSending(false);
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 h-16 w-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-[60] border-4 border-white active:scale-95"
            >
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-amber-500 rounded-full border-2 border-white animate-pulse" />
                <MessageSquare className="h-7 w-7" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-8 right-8 w-[400px] h-[550px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col z-[60] border border-slate-100 overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-tighter">Admin Lounge</h3>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500">
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" /> Sala Geral
                        </div>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30"
            >
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                    </div>
                ) : messages.map((msg, idx) => (
                    <div key={msg.id || idx} className="flex flex-col gap-1 animate-fade-in">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                {msg.admin?.full_name || "Admin"}
                            </span>
                            <span className="text-[9px] font-bold text-slate-300">
                                {format(new Date(msg.created_at), "HH:mm")}
                            </span>
                        </div>
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-sm text-slate-600 font-medium leading-relaxed">
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-50 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Sua ponderação..."
                    className="flex-1 bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                />
                <button
                    disabled={sending}
                    className="h-11 w-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                >
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
            </form>
        </div>
    );
}
