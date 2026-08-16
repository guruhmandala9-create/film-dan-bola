import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";

function splitList(value: string | null) {
  return (value ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export default async function FilmKlasikPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; country?: string }>;
}) {
  const { genre, country } = await searchParams;
  const supabase = await createClient();

  const { data: films } = await supabase
    .from("classic_films")
    .select("*")
    .order("imdb_rating", { ascending: false, nullsFirst: false });

  const allFilms = films ?? [];

  const allGenres = Array.from(new Set(allFilms.flatMap((f) => splitList(f.genre)))).sort();
  const allCountries = Array.from(new Set(allFilms.flatMap((f) => splitList(f.country)))).sort();

  const filtered = allFilms.filter((f) => {
    if (genre && !splitList(f.genre).includes(genre)) return false;
    if (country && !splitList(f.country).includes(country)) return false;
    return true;
  });

  const query = (overrides: { genre?: string; country?: string }) => {
    const params = new URLSearchParams();
    const g = overrides.genre !== undefined ? overrides.genre : genre;
    const c = overrides.country !== undefined ? overrides.country : country;
    if (g) params.set("genre", g);
    if (c) params.set("country", c);
    const qs = params.toString();
    return qs ? `/film-klasik?${qs}` : "/film-klasik";
  };

  return (
    <div>
      <PageHeader
        title="Film Klasik Dunia"
        description="Film-film lawas dari berbagai negara, lengkap dengan rating IMDb — data diambil dari OMDb API."
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Genre:</span>
          <Link
            href={query({ genre: undefined })}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              !genre ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-card"
            }`}
          >
            Semua
          </Link>
          {allGenres.map((g) => (
            <Link
              key={g}
              href={query({ genre: g })}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                genre === g ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-card"
              }`}
            >
              {g}
            </Link>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Negara:</span>
          <Link
            href={query({ country: undefined })}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              !country ? "border-secondary bg-secondary text-secondary-foreground" : "border-border hover:bg-card"
            }`}
          >
            Semua
          </Link>
          {allCountries.map((c) => (
            <Link
              key={c}
              href={query({ country: c })}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                country === c ? "border-secondary bg-secondary text-secondary-foreground" : "border-border hover:bg-card"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((film) => (
            <a
              key={film.id}
              href={film.imdb_id ? `https://www.imdb.com/title/${film.imdb_id}/` : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary"
            >
              {film.poster_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={film.poster_url} alt={film.title} className="h-64 w-full object-cover" />
              ) : (
                <div className="flex h-64 w-full items-center justify-center bg-background text-sm text-muted">
                  Tidak ada poster
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <p className="font-semibold">
                  {film.title} <span className="font-normal text-muted">({film.year})</span>
                </p>
                <p className="mt-1 text-xs text-muted">{film.genre}</p>
                <p className="text-xs text-muted">{film.country}</p>
                {film.imdb_rating && (
                  <p className="mt-auto pt-2 text-sm font-semibold text-primary">★ {film.imdb_rating} / 10 IMDb</p>
                )}
              </div>
            </a>
          ))}
          {!filtered.length && (
            <p className="col-span-full py-12 text-center text-muted">
              {allFilms.length
                ? "Tidak ada film yang cocok dengan filter ini."
                : "Katalog film klasik belum diisi admin."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
