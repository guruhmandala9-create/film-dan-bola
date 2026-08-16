"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/jadwal-film", label: "Jadwal Film" },
  { href: "/jadwal-bola", label: "Jadwal Bola" },
  { href: "/kalender", label: "Kalender" },
  { href: "/profil", label: "Profil" },
];

export default function Header() {
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
        </nav>
      )}
    </header>
  );
}
