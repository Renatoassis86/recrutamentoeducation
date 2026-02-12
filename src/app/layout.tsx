import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import LandingNav from "@/components/layout/LandingNav";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap"
});
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "Recrutamento - Cidade Viva Education",
  description: "Plataforma de recrutamento para autores do Cidade Viva Education.",
  openGraph: {
    title: "Recrutamento - Cidade Viva Education",
    description: "Plataforma de recrutamento para autores do Cidade Viva Education.",
    images: [
      {
        url: "/logo-education.png",
        width: 800,
        height: 600,
        alt: "Cidade Viva Education Logo",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recrutamento - Cidade Viva Education",
    description: "Plataforma de recrutamento para autores do Cidade Viva Education.",
    images: ["/logo-education.png"],
  },
};

import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = headers();
  const pathname = headerList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");

  let user = null;
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.warn("Aviso: Falha ao recuperar usuário (não crítico):", error.message);
      } else {
        user = data?.user || null;
      }
    }
  } catch (e) {
    console.error("Erro crítico no Supabase (Layout):", e);
  }

  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${cormorant.variable} ${montserrat.variable} font-sans bg-white`}>
        {!isAdmin && <LandingNav user={user} />}
        <main className="min-h-screen">
          {children}
        </main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}
