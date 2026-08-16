import Link from "next/link";
import { signUpWithEmail } from "@/lib/auth/actions";
import GoogleButton from "@/components/GoogleButton";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; check_email?: string }>;
}) {
  const { error, check_email } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-sm flex-col justify-center px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Daftar</h1>
      <p className="mt-1 text-sm text-muted">Buat akun untuk mulai menandai film dan jadwal bola favoritmu.</p>

      {error && (
        <p className="mt-4 rounded-lg border border-border bg-card px-3 py-2 text-sm text-red-500">
          {error}
        </p>
      )}

      {check_email ? (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-card px-4 py-4 text-sm">
          Cek email kamu untuk konfirmasi pendaftaran, lalu kembali ke sini untuk masuk.
        </p>
      ) : (
        <>
          <div className="mt-6">
            <GoogleButton />
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-muted">
            <div className="h-px flex-1 bg-border" />
            atau dengan email
            <div className="h-px flex-1 bg-border" />
          </div>

          <form action={signUpWithEmail} className="flex flex-col gap-3">
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
              placeholder="Kata sandi (min. 6 karakter)"
              required
              minLength={6}
              className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="mt-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Daftar
            </button>
          </form>
        </>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-foreground underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}
