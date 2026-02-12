"use client";


import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

export default function Contato() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            const { sendContactFormEmail } = await import("@/app/admin/actions-email");
            const res = await sendContactFormEmail(formData);

            if (res.success) {
                setStatus("success");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: ""
                });
            } else {
                console.error("Email Error:", res.error);
                setStatus("error");
            }
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900 flex flex-col">


            <main className="flex-grow pt-48 pb-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">

                    {/* Header */}
                    <header className="mb-16 text-center max-w-2xl mx-auto">
                        <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-amber-600 uppercase bg-amber-50 rounded-full border border-amber-200">
                            Fale Conosco
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl font-serif mb-6 leading-tight">
                            Entre em Contato
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed font-light">
                            Tem alguma dúvida sobre o processo seletivo ou sobre o projeto? Estamos aqui para ajudar.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                        {/* Contact Info */}
                        <div className="space-y-12">
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                                <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                                    Canais de Atendimento
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Email</p>
                                            <a href="mailto:administrativo.education@cidadeviva.org" className="text-gray-600 hover:text-amber-600 transition-colors break-all">
                                                administrativo.education@cidadeviva.org
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                            <Phone className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">WhatsApp</p>
                                            <a href="https://wa.me/5583993322457" target="_blank" className="text-gray-600 hover:text-blue-600 transition-colors">
                                                (83) 99332-2457
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Endereço</p>
                                            <p className="text-gray-600 leading-relaxed">
                                                R. Lourdes Férrer, 191 - Aeroclube<br />
                                                João Pessoa - PB, 58036-630
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-4">Horário de Atendimento</h3>
                                    <p className="text-slate-300 mb-6 leading-relaxed">
                                        Nossa equipe administrativa está disponível para atender você nos seguintes horários:
                                    </p>
                                    <div className="space-y-2 font-medium">
                                        <div className="flex justify-between border-b border-white/10 pb-2">
                                            <span>Segunda a Sexta</span>
                                            <span>09:00 - 18:00</span>
                                        </div>
                                        <div className="flex justify-between pt-2 text-slate-400 text-sm">
                                            <span>Sábados e Domingos</span>
                                            <span>Fechado</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-xl border border-slate-100">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Envie uma mensagem</h3>
                            <p className="text-gray-500 mb-8 text-sm">
                                Preencha o formulário abaixo e entraremos em contato o mais breve possível.
                            </p>

                            {status === "success" ? (
                                <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-200 text-center animate-fade-in">
                                    <h4 className="text-xl font-bold mb-2">Mensagem Enviada!</h4>
                                    <p>Obrigado pelo contato. Responderemos em breve.</p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                    >
                                        Enviar outra mensagem
                                    </button>
                                </div>
                            ) : status === "error" ? (
                                <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200 text-center animate-fade-in">
                                    <h4 className="text-xl font-bold mb-2">Erro ao Enviar</h4>
                                    <p>Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente ou use o email direto.</p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                    >
                                        Tentar Novamente
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <input type="hidden" name="_captcha" value="false" />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium text-slate-900">Nome Completo</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                disabled={status === "submitting"}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all placeholder:text-gray-300 disabled:opacity-50"
                                                placeholder="Seu nome"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="phone" className="text-sm font-medium text-slate-900">Telefone</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                disabled={status === "submitting"}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all placeholder:text-gray-300 disabled:opacity-50"
                                                placeholder="(00) 00000-0000"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-slate-900">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={status === "submitting"}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all placeholder:text-gray-300 disabled:opacity-50"
                                            placeholder="seu@email.com"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="text-sm font-medium text-slate-900">Assunto</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            disabled={status === "submitting"}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all placeholder:text-gray-300 disabled:opacity-50"
                                            placeholder="Qual o motivo do contato?"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium text-slate-900">Mensagem</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleChange}
                                            disabled={status === "submitting"}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all placeholder:text-gray-300 resize-none disabled:opacity-50"
                                            placeholder="Descreva sua dúvida ou solicitação..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === "submitting"}
                                        className="w-full py-4 text-white font-bold text-lg bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:translate-y-0"
                                    >
                                        {status === "submitting" ? (
                                            <>Enviando...</>
                                        ) : (
                                            <>
                                                Enviar Mensagem
                                                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>


        </div>
    );
}
