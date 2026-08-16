import type { Metadata } from "next";
import Link from "next/link";
import { signInWithEmail } from "@/lib/auth/actions";
import GoogleButton from "@/components/GoogleButton";
import BackButton from "@/components/BackButton";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-sm flex-col justify-center px-4 py-12 sm:px-6">
      <BackButton />
      <h1 className="text-2xl font-bold tracking-tight">Masuk</h1>
      <p className="mt-1 text-sm text-muted">Masuk untuk menandai jadwal dan mengatur reminder.</p>

      {error && (
        <p className="mt-4 rounded-lg border border-border bg-card px-3 py-2 text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="mt-6">
        <GoogleButton next={next} />
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <div className="h-px flex-1 bg-border" />
        atau dengan email
        <div className="h-px flex-1 bg-border" />
      </div>

      <form action={signInWithEmail} className="flex flex-col gap-3">
        <input type="hidden" name="next" value={next ?? ""} />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        <input
          type="password"
          name="password"
          placeholder="Kata sandi"
          required
          minLength={6}
          className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="mt-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Masuk
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Belum punya akun?{" "}
        <Link href="/signup" className="font-medium text-foreground underline">
          Daftar
        </Link>
      </p>
    </div>
  );
}
