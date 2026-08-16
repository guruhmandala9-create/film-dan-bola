"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/auth/actions";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/jadwal-film", label: "Jadwal Film" },
  { href: "/jadwal-bola", label: "Jadwal Bola" },
  { href: "/kalender", label: "Kalender" },
  { href: "/profil", label: "Profil" },
];

export default function Header({
  user,
  isAdmin,
}: {
  user: { email: string } | null;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight" onClick={() => setMenuOpen(false)}>
          Jadwal<span className="text-primary">Nonton</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-card hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-md border border-primary px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10"
            >
              Admin
            </Link>
          )}
          {user ? (
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-card"
              >
                Keluar
              </button>
            </form>
          ) : (
            <>
              <Link href="/login" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-card">
                Masuk
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Buka menu navigasi"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border md:hidden"
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1.5">
            <span className={`h-0.5 w-5 bg-foreground transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-foreground transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 bg-foreground transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-border px-4 py-2 md:hidden">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-md px-3 py-2.5 text-sm font-medium ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-card hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="mt-2 border-t border-border pt-2">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-primary hover:bg-card"
              >
                Panel Admin
              </Link>
            )}
            {user ? (
              <form action={signOut}>
                <button
                  type="submit"
                  className="block w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-foreground/70 hover:bg-card hover:text-foreground"
                >
                  Keluar ({user.email})
                </button>
              </form>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-card hover:text-foreground"
                >
                  Masuk
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
