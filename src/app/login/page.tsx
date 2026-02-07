"use client";

import { useState } from "react";
import { login, signup } from "./actions"; // We'll need to wrap these to handle errors in UI
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function SubmitButton({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {children}
        </button>
    );
}

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Wrapper for server actions to catch errors
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
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Link href="/">
                    <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                        Cidade Viva Education
                    </h2>
                </Link>
                <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    {isLogin ? "Sign in to your account" : "Create your account"}
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">

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
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Full Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <SubmitButton>{isLogin ? "Sign in" : "Sign up"}</SubmitButton>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">
                                    {isLogin ? "New here?" : "Already have an account?"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError(null);
                                }}
                                className="flex w-full justify-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
                            >
                                {isLogin ? "Create an account" : "Sign in"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
