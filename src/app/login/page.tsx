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
    const [isLogin, setIsLogin] = useState(false); // Default to Register as per flow, or keep Login? User said "Garanta que o usuario só consiga começar a inscrição apos realizar o cadastro". Maybe default to Login but show clear option.
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
            setError(res.error);
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Link href="/">
                    <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 font-serif">
                        Cidade Viva Education
                    </h2>
                </Link>
                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 text-justify">
                    <p className="flex gap-2">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <span>
                            Para se inscrever na Chamada Editorial, é necessário ter uma conta.
                            <strong> Se você é novo, crie sua conta abaixo.</strong> Se já possui cadastro, faça login.
                        </span>
                    </p>
                </div>
                <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
                    {isLogin ? "Acesse sua conta" : "Crie sua conta"}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="bg-white px-6 py-12 shadow-xl rounded-2xl sm:px-12 border border-slate-100">

                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form action={isLogin ? handleLogin : handleSignup} className="space-y-6">
                        {!isLogin && (
                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="block text-sm font-medium leading-6 text-slate-900"
                                >
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
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-slate-900"
                            >
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
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-slate-900"
                            >
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

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-slate-500">
                                    {isLogin ? "Ainda não tem conta?" : "Já tem uma conta?"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError(null);
                                }}
                                className="flex w-full justify-center px-4 py-2 text-sm font-medium text-amber-600 hover:text-amber-500 focus:outline-none focus:underline"
                            >
                                {isLogin ? "Criar uma conta agora" : "Fazer login"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
