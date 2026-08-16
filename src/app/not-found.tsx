import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">404</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Halaman tidak ditemukan</h1>
      <p className="mt-3 text-muted">
        Jadwal yang kamu cari mungkin sudah lewat, dihapus, atau alamatnya salah ketik.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Kembali ke Beranda
        </Link>
        <Link
          href="/jadwal-film"
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold hover:bg-card"
        >
          Lihat Jadwal Film
        </Link>
        <Link
          href="/jadwal-bola"
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold hover:bg-card"
        >
          Lihat Jadwal Bola
        </Link>
      </div>
    </div>
  );
}
