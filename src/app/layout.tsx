import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://jadwalnonton.vercel.app";
const SITE_TITLE = "JadwalNonton — Film & Bola";
const SITE_DESCRIPTION =
  "Agregator jadwal tayang film bioskop dan jadwal pertandingan sepak bola dalam satu platform. Jangan sampai ketinggalan nonton — film atau bola.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s — JadwalNonton` },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "JadwalNonton",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
    isAdmin = Boolean(profile?.is_admin);
  }

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <script
          // Runs before paint to avoid a flash of the wrong theme; must
          // stay in sync with the fallback logic in ThemeToggle.tsx.
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}}catch(e){}`,
          }}
        />
        <Header user={user ? { email: user.email ?? "" } : null} isAdmin={isAdmin} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
