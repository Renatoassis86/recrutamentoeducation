import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  try {
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
        <Footer />
      </body>
    </html>
  );
}
