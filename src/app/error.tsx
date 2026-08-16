"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">Ups</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Terjadi kesalahan</h1>
      <p className="mt-3 text-muted">
        Ada yang tidak beres di halaman ini. Coba muat ulang — kalau masih terjadi, kembali ke beranda.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Coba lagi
        </button>
        <Link
          href="/"
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold hover:bg-card"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
