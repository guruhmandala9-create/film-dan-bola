import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          Jangan sampai ketinggalan nonton
          <br />
          <span className="text-primary">film</span> atau{" "}
          <span className="text-secondary">bola</span>.
        </h1>
        <p className="mt-4 max-w-xl text-muted sm:text-lg">
          Satu tempat untuk cek jadwal tayang film bioskop dan jadwal pertandingan
          sepak bola favoritmu — lengkap dengan reminder, kalender gabungan, dan
          ruang diskusi sesama penggemar.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/jadwal-film"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Lihat Jadwal Film
          </Link>
          <Link
            href="/jadwal-bola"
            className="rounded-md bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground transition-opacity hover:opacity-90"
          >
            Lihat Jadwal Bola
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Jadwal Film",
              desc: "Film tayang minggu ini di bioskop kotamu.",
              href: "/jadwal-film",
            },
            {
              title: "Jadwal Bola",
              desc: "Jadwal pertandingan tim dan liga favoritmu.",
              href: "/jadwal-bola",
            },
            {
              title: "Kalender Gabungan",
              desc: "Semua jadwal tontonanmu dalam satu tampilan.",
              href: "/kalender",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-muted">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
