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
        <div className="flex min-h-[calc(100vh-64px)] flex-col-reverse lg:flex-row mt-16 bg-white overflow-hidden">
            {/* Left: Form Section */}
            <div className="flex flex-1 flex-col justify-center items-center px-4 py-8 sm:px-6 lg:flex-none lg:px-20 xl:px-24 z-10 w-full lg:w-1/2">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="text-center lg:text-left">
                        <Link href="/" className="inline-block mb-4">
                            {/* Logo redundant text removed */}
                            <img src="/logo-education.png" alt="Cidade Viva Education" className="h-16 w-auto" />
                        </Link>
                        <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-slate-900">
                            {isLogin ? "Bem-vindo de volta" : "Criar sua conta"}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {isLogin ? "Acesse para continuar sua inscrição na Chamada Editorial." : "Cadastre-se para participar da seleção de autores da Coleção Paideia."}
                        </p>
                    </div>

                    <div className="mt-8">
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

                        <form action={isLogin ? handleLogin : handleSignup} className="space-y-5">
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

                    <div className="mt-8">
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

            {/* Right: Fan Book Section */}
            <div className="flex relative bg-slate-100 w-full lg:w-1/2 h-[300px] lg:h-auto items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-l border-slate-200">
                <div className="absolute inset-0 bg-slate-900/5 z-0"></div>

                {/* Fan Container */}
                <div className="relative w-full max-w-lg aspect-square flex items-center justify-center scale-75 lg:scale-100 mt-8 lg:mt-0 group perspective-1000">

                    {/* Book 1 - Leftmost */}
                    <div className="absolute transform -rotate-12 -translate-x-32 translate-y-4 hover:translate-y-[-20px] hover:scale-110 hover:z-50 hover:rotate-0 transition-all duration-300 z-10 w-48 shadow-2xl rounded-lg cursor-pointer">
                        <img src="/paideia-1-ano.png" alt="Book 1" className="w-full rounded-lg border-2 border-white/50" />
                    </div>

                    {/* Book 2 */}
                    <div className="absolute transform -rotate-6 -translate-x-16 translate-y-2 hover:translate-y-[-20px] hover:scale-110 hover:z-50 hover:rotate-0 transition-all duration-300 z-20 w-48 shadow-2xl rounded-lg cursor-pointer">
                        <img src="/paideia-2.png" alt="Book 2" className="w-full rounded-lg border-2 border-white/50" />
                    </div>

                    {/* Book 3 - Center */}
                    <div className="absolute transform rotate-0 translate-y-0 hover:translate-y-[-20px] hover:scale-110 hover:z-50 transition-all duration-300 z-30 w-52 shadow-2xl rounded-lg scale-105 cursor-pointer">
                        <img src="/paideia-3.png" alt="Book 3" className="w-full rounded-lg border-2 border-white/50" />
                    </div>

                    {/* Book 4 */}
                    <div className="absolute transform rotate-6 translate-x-16 translate-y-2 hover:translate-y-[-20px] hover:scale-110 hover:z-50 hover:rotate-0 transition-all duration-300 z-20 w-48 shadow-2xl rounded-lg cursor-pointer">
                        <img src="/paideia-4.png" alt="Book 4" className="w-full rounded-lg border-2 border-white/50" />
                    </div>

                    {/* Book 5 - Rightmost */}
                    <div className="absolute transform rotate-12 translate-x-32 translate-y-4 hover:translate-y-[-20px] hover:scale-110 hover:z-50 hover:rotate-0 transition-all duration-300 z-10 w-48 shadow-2xl rounded-lg cursor-pointer">
                        <img src="/paideia-5.png" alt="Book 5" className="w-full rounded-lg border-2 border-white/50" />
                    </div>

                    {/* Logo/Badge */}
                    <div className="absolute bottom-[-60px] lg:bottom-[-20px] bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/50 z-40 transform translate-y-12">
                        <img src="/logo-education.png" alt="Logo" className="h-8 w-auto opacity-90" />
                    </div>
                </div>
            </div>
        </div>
    );
}
