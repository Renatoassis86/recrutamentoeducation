import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import AuthButtons from "@/components/layout/AuthButtons";

export default async function Navbar() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <nav className="border-b border-gray-200 bg-white/75 backdrop-blur-lg fixed w-full z-10 top-0">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        <Link href="/" className="flex flex-shrink-0 items-center">
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                                Cidade Viva Education
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                            Quem Somos
                        </Link>
                        <AuthButtons user={user} />
                    </div>
                </div>
            </div>
        </nav>
    );
}
