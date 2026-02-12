"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { MessageSquare, Send, User, Loader2, X, Mic, Square, Trash2, Play, Pause, Users, CheckSquare } from "lucide-react";
import { format } from "date-fns";

export default function AdminChat() {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Audio State
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    useEffect(() => {
        const getUserId = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setCurrentUserId(user.id);
        };
        getUserId();
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        fetchMessages();

        const channel = supabase
            .channel('admin_chat_v2')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'admin_chat_messages'
            }, (payload) => {
                // Ao receber nova mensagem, fazemos um fetch rápido apenas da nova 
                // ou simplesmente um refresh total para garantir os Joins
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
                profiles:admin_id(id, full_name, email, role)
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
            const { error } = await supabase
                .from('admin_chat_messages')
                .insert({
                    content: textContent,
                    admin_id: currentUserId,
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
            setAudioChunks([]);
            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) setAudioChunks((prev) => [...prev, e.data]);
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
                className="fixed bottom-8 right-8 h-16 w-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-[60] border-4 border-white active:scale-95 group"
            >
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-amber-500 rounded-full border-2 border-white animate-pulse" />
                <MessageSquare className="h-7 w-7" />
                <span className="absolute right-20 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden lg:block">Chat da Comissão</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-8 right-8 w-[400px] h-[600px] bg-[#f0f2f5] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col z-[60] border border-slate-200 overflow-hidden animate-fade-in-up">
            {/* Header Estilo Grupo WhatsApp */}
            <div className="bg-[#075e54] p-5 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#128c7e] rounded-full flex items-center justify-center shadow-inner border border-white/20">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black tracking-tight leading-none mb-1">COMISSÃO EDUCATION</h3>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#25d366]">
                            <div className="h-1.5 w-1.5 bg-[#25d366] rounded-full animate-pulse" /> Grupo Ativo
                        </div>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Area de Mensagens */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-contain"
            >
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-[#075e54]" />
                    </div>
                ) : messages.map((msg, idx) => {
                    const isMine = msg.admin_id === currentUserId;
                    return (
                        <div
                            key={msg.id || idx}
                            className={`flex flex-col max-w-[85%] ${isMine ? 'ml-auto' : 'mr-auto'}`}
                        >
                            {!isMine && (
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter ml-2 mb-0.5">
                                    {msg.profiles?.full_name || "Membro"}
                                </span>
                            )}
                            <div
                                className={`px-3 py-2 rounded-xl shadow-sm relative text-sm font-medium leading-tight ${isMine ? 'bg-[#dcf8c6] text-slate-800 rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none'}`}
                            >
                                {msg.type === 'audio' ? (
                                    <div className="flex items-center gap-3 min-w-[150px]">
                                        <button
                                            className={`h-9 w-9 rounded-full flex items-center justify-center text-white shadow-sm ${isMine ? 'bg-emerald-600' : 'bg-amber-600'}`}
                                            onClick={() => new Audio(msg.attachment_url).play()}
                                        >
                                            <Play className="h-4 w-4 fill-current ml-0.5" />
                                        </button>
                                        <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full w-full bg-slate-400/30 opacity-20" />
                                        </div>
                                        <Mic className="h-3 w-3 text-slate-400" />
                                    </div>
                                ) : (
                                    <span className="block whitespace-pre-wrap">{msg.content}</span>
                                )}
                                <div className="flex justify-end items-center gap-1 mt-1">
                                    <span className="text-[9px] font-bold text-slate-400">
                                        {format(new Date(msg.created_at), "HH:mm")}
                                    </span>
                                    {isMine && <CheckSquare className="h-2.5 w-2.5 text-blue-400" />}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input Barra Inferior */}
            <form onSubmit={handleSend} className="p-4 bg-[#f0f2f5] flex gap-2 items-center shrink-0">
                {isRecording ? (
                    <div className="flex-1 flex items-center gap-3 bg-red-50 text-red-600 px-4 py-3 rounded-2xl border border-red-100 animate-pulse">
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
                            placeholder="Mensagem..."
                            className="flex-1 bg-white border-none rounded-full px-4 py-3 text-sm focus:ring-0 outline-none text-slate-900 shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={startRecording}
                            className="h-11 w-11 bg-white text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <Mic className="h-5 w-5" />
                        </button>
                        <button
                            type="submit"
                            disabled={sending}
                            className="h-11 w-11 bg-[#128c7e] text-white rounded-full flex items-center justify-center hover:bg-[#075e54] transition-all shadow-md active:scale-95 disabled:opacity-50"
                        >
                            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 ml-0.5" />}
                        </button>
                    </>
                )}
            </form>
        </div>
    );
}
