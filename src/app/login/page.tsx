"use client";

import { useState } from "react";
import { login, signup } from "./actions";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";

function SubmitButton({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {children}
        </button>
    );
}

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (formData: FormData) => {
        setError(null);
        const res = await login(formData);
        if (res?.error) {
            setError(res.error);
        }
    };

    const handleSignup = async (formData: FormData) => {
        setError(null);
        const res = await signup(formData);
        if (res?.error) {
            if (res.error.includes("User already registered") || res.error.includes("already registered")) {
                setError("Este e-mail já está cadastrado. Redirecionando para login...");
                // Auto switch to login after short delay
                setTimeout(() => {
                    setIsLogin(true);
                    setError("Conta encontrada. Por favor, digite sua senha.");
                }, 1500);
            } else {
                setError(res.error);
            }
        }
    }

    return (
        <div className="flex min-h-screen flex-col-reverse lg:flex-row">
            {/* Left: Form Section */}
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white z-10 w-full lg:w-1/2">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="text-center lg:text-left">
                        {/* Mobile/Tablet Image Banner - REMOVED since we show the main panel now */}

                        <Link href="/" className="inline-block">
                            <h2 className="text-3xl font-bold tracking-tight text-amber-600 font-serif hover:text-amber-500 transition-colors">
                                Cidade Viva Education
                            </h2>
                        </Link>
                        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-slate-900">
                            {isLogin ? "Bem-vindo de volta" : "Criar sua conta"}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {isLogin ? "Acesse para continuar sua inscrição na Chamada Editorial." : "Cadastre-se para participar da seleção de autores."}
                        </p>
                    </div>

                    <div className="mt-10">
                        {error && (
                            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700 flex gap-2 items-start animate-fade-in-up">
                                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium">Ocorreu um erro</p>
                                    <p>{error}</p>
                                    {error.includes("já está cadastrado") && !isLogin && (
                                        <button
                                            onClick={() => { setIsLogin(true); setError(null); }}
                                            className="mt-2 text-red-800 underline font-medium hover:text-red-900"
                                        >
                                            Ir para Login
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <form action={isLogin ? handleLogin : handleSignup} className="space-y-6">
                            {!isLogin && (
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-slate-900">
                                        Nome Completo
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            required
                                            className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
                                    E-mail
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-900">
                                    Senha
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete={isLogin ? "current-password" : "new-password"}
                                        required
                                        minLength={6}
                                        className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <SubmitButton>{isLogin ? "Entrar" : "Criar Conta"}</SubmitButton>
                            </div>
                        </form>
                    </div>

                    <div className="mt-10">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm font-medium leading-6">
                                <span className="bg-white px-6 text-slate-900">
                                    {isLogin ? "Novo por aqui?" : "Já tem conta?"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError(null);
                                }}
                                className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                            >
                                {isLogin ? "Criar uma conta gratuita" : "Fazer login em sua conta"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Image Section (Vertical Layout) */}
            <div className="flex relative bg-slate-50 overflow-hidden w-full lg:w-1/2 h-96 lg:h-auto border-b lg:border-b-0 lg:border-l border-slate-200">
                <div className="absolute inset-0 bg-slate-900/10 z-10 pointer-events-none"></div>

                {/* Scrollable Container */}
                <div className="w-full h-full overflow-y-auto scrollbar-hide">
                    <div className="flex flex-col items-center gap-12 py-16 px-8 min-h-full">

                        <div className="text-center mb-4 z-20">
                            <h3 className="font-serif text-3xl font-bold text-slate-800 mb-2">Coleção Paideia</h3>
                            <div className="w-20 h-1.5 bg-amber-500 mx-auto rounded-full"></div>
                        </div>

                        {/* Imagem 1 */}
                        <div className="relative group max-w-sm w-full transition-transform duration-300 hover:scale-[1.02]">
                            <div className="absolute inset-0 bg-amber-600/20 rounded-lg transform translate-x-4 translate-y-4"></div>
                            <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-white">
                                <img src="/paideia-1-ano.png" alt="Capa Livro 1" className="w-full h-auto object-cover" />
                            </div>
                        </div>

                        {/* Imagem 2 */}
                        <div className="relative group max-w-sm w-full transition-transform duration-300 hover:scale-[1.02]">
                            <div className="absolute inset-0 bg-blue-600/20 rounded-lg transform translate-x-4 translate-y-4"></div>
                            <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-white">
                                <img src="/paideia-2.png" alt="Capa Livro 2" className="w-full h-auto object-cover" />
                            </div>
                        </div>

                        {/* Imagem 3 */}
                        <div className="relative group max-w-sm w-full transition-transform duration-300 hover:scale-[1.02]">
                            <div className="absolute inset-0 bg-green-600/20 rounded-lg transform translate-x-4 translate-y-4"></div>
                            <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-white">
                                <img src="/paideia-3.png" alt="Capa Livro 3" className="w-full h-auto object-cover" />
                            </div>
                        </div>

                        {/* Imagem 4 */}
                        <div className="relative group max-w-sm w-full transition-transform duration-300 hover:scale-[1.02]">
                            <div className="absolute inset-0 bg-red-600/20 rounded-lg transform translate-x-4 translate-y-4"></div>
                            <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-white">
                                <img src="/paideia-4.png" alt="Capa Livro 4" className="w-full h-auto object-cover" />
                            </div>
                        </div>

                        {/* Imagem 5 */}
                        <div className="relative group max-w-sm w-full transition-transform duration-300 hover:scale-[1.02]">
                            <div className="absolute inset-0 bg-purple-600/20 rounded-lg transform translate-x-4 translate-y-4"></div>
                            <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-white">
                                <img src="/paideia-5.png" alt="Capa Livro 5" className="w-full h-auto object-cover" />
                            </div>
                        </div>

                        {/* Footer Logo in column */}
                        <div className="mt-8 opacity-80 max-w-[150px]">
                            <img src="/logo-education.png" alt="Cidade Viva Education" className="w-full h-auto" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
