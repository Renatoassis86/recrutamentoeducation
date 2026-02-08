import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import LandingNav from "@/components/layout/LandingNav";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Recrutamento - Cidade Viva Education",
  description: "Plataforma de recrutamento para autores do Sistema Cidade Viva Education.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  try {
    console.log("Checking Env Vars on Server:");
    console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Defined" : "MISSING");
    console.log("KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Defined" : "MISSING");

    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (e) {
    console.error("Supabase auth error (likely missing env vars):", e);
  }

  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${cormorant.variable} font-sans bg-white`}>
        <LandingNav user={user} />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
