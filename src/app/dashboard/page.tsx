import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                        Minha Área - Cidade Viva Education
                    </h3>
                    <div className="mt-2 text-sm text-gray-500">
                        <p>Você está logado como: {user.email}</p>
                        <p className="mt-2">Seu ID de usuário é: {user.id}</p>
                    </div>
                    <div className="mt-5">
                        <a
                            href="/application"
                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Iniciar nova candidatura
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
