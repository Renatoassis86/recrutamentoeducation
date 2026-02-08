import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-white py-12 border-t border-slate-900">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <p className="font-serif text-2xl font-bold text-amber-500">Cidade Viva Education</p>
                    <p className="text-gray-500 text-sm mt-2">© {new Date().getFullYear()} Fundação Cidade Viva</p>
                    <div className="flex flex-col gap-2 mt-6 text-gray-400 text-sm">
                        <p>R. Profa. Luzia Simões Bartolini, 100 - Aeroclube, João Pessoa - PB</p>
                        <p>Email: <a href="mailto:administrativo.education@cidadeviva.org" className="hover:text-amber-500 transition-colors">administrativo.education@cidadeviva.org</a></p>
                        <p>Instagram: <a href="https://instagram.com/cidadeviva.education" target="_blank" className="hover:text-amber-500 transition-colors">@cidadeviva.education</a></p>
                    </div>
                </div>
                <div className="flex gap-6 text-sm text-gray-400">
                    <Link href="/about" className="hover:text-white transition-colors">Quem Somos</Link>
                    <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
                    <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                </div>
            </div>
        </footer>
    );
}
