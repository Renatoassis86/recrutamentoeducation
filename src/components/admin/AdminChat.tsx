"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { MessageSquare, Send, User, Loader2, X, Mic, Square, Trash2, Play, Pause } from "lucide-react";
import { format } from "date-fns";

export default function AdminChat() {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Audio State
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    useEffect(() => {
        if (!isOpen) return;

        fetchMessages();

        const channel = supabase
            .channel('admin_chat')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'admin_chat_messages'
            }, (payload) => {
                // Fetch full message with joins to avoid missing user info
                fetchMessages();
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

    async function handleSend(e?: React.FormEvent, content?: string, type: 'text' | 'audio' = 'text', attachmentUrl?: string) {
        if (e) e.preventDefault();

        const textContent = content || newMessage;
        if (!textContent.trim() && !attachmentUrl) return;

        setSending(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase
                .from('admin_chat_messages')
                .insert({
                    content: textContent,
                    admin_id: user?.id,
                    type,
                    attachment_url: attachmentUrl
                });

            if (error) throw error;
            setNewMessage("");
            fetchMessages();
        } catch (err) {
            console.error("Chat Error:", err);
        } finally {
            setSending(false);
        }
    }

    // Audio Logic
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) setAudioChunks((prev) => [...prev, e.data]);
            };

            recorder.onstop = async () => {
                // Handled in a separate effect or manually below
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (err) {
            console.error("Erro ao acessar microfone:", err);
            alert("Não foi possível acessar o microfone.");
        }
    };

    const stopAndSendRecording = async () => {
        if (!mediaRecorder) return;

        mediaRecorder.addEventListener('stop', async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const file = new File([audioBlob], `audio_${Date.now()}.webm`, { type: 'audio/webm' });

            setSending(true);
            try {
                // Upload to Storage
                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('chat_audios')
                    .upload(`audio_${Date.now()}.webm`, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage.from('chat_audios').getPublicUrl(uploadData.path);

                await handleSend(undefined, "Mensagem de áudio", 'audio', publicUrl);
            } catch (err) {
                console.error("Audio Upload Error:", err);
            } finally {
                setAudioChunks([]);
                setSending(false);
            }
        }, { once: true });

        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
    };

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
                        <div className={`p-3 rounded-2xl shadow-sm border border-slate-100 text-sm font-medium leading-relaxed ${msg.type === 'audio' ? 'bg-amber-50' : 'bg-white text-slate-600'}`}>
                            {msg.type === 'audio' ? (
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-amber-600 rounded-full flex items-center justify-center text-white cursor-pointer" onClick={() => {
                                        const audio = new Audio(msg.attachment_url);
                                        audio.play();
                                    }}>
                                        <Play className="h-4 w-4 fill-current" />
                                    </div>
                                    <div className="flex-1 h-1 bg-amber-200 rounded-full overflow-hidden">
                                        <div className="h-full w-1/3 bg-amber-600 animate-pulse" />
                                    </div>
                                    <span className="text-[10px] text-amber-700 font-black">ÁUDIO</span>
                                </div>
                            ) : msg.content}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-50 flex gap-2 items-center">
                {isRecording ? (
                    <div className="flex-1 flex items-center gap-3 bg-red-50 text-red-600 px-4 py-3 rounded-2xl animate-pulse">
                        <div className="h-2 w-2 bg-red-600 rounded-full" />
                        <span className="text-xs font-black uppercase">Gravando Áudio...</span>
                        <button type="button" onClick={stopAndSendRecording} className="ml-auto bg-red-600 text-white p-2 rounded-xl">
                            <Square className="h-4 w-4 fill-current" />
                        </button>
                    </div>
                ) : (
                    <>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Sua ponderação..."
                            className="flex-1 bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-amber-500 transition-all outline-none text-slate-900"
                        />
                        <button
                            type="button"
                            onClick={startRecording}
                            className="h-11 w-11 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-all active:scale-95"
                        >
                            <Mic className="h-5 w-5" />
                        </button>
                        <button
                            type="submit"
                            disabled={sending}
                            className="h-11 w-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </button>
                    </>
                )}
            </form>
        </div>
    );
}
