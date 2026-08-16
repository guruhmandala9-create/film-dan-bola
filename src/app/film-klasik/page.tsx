import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";
import WatchedButton from "@/components/WatchedButton";

function splitList(value: string | null) {
  return (value ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export default async function FilmKlasikPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; country?: string; type?: string }>;
}) {
  const { genre, country, type } = await searchParams;
  const supabase = await createClient();

  const { data: films } = await supabase
    .from("classic_films")
    .select("*")
    .order("imdb_rating", { ascending: false, nullsFirst: false });

  const allFilms = films ?? [];

  const {
    data: { user },
  } = await supabase.auth.getUser();
  let watchedIds = new Set<string>();
  if (user) {
    const { data: watched } = await supabase
      .from("watched_items")
      .select("item_id")
      .eq("user_id", user.id)
      .eq("item_type", "classic_film");
    watchedIds = new Set(watched?.map((w) => w.item_id));
  }

  const allGenres = Array.from(new Set(allFilms.flatMap((f) => splitList(f.genre)))).sort();
  const allCountries = Array.from(new Set(allFilms.flatMap((f) => splitList(f.country)))).sort();

  const filtered = allFilms.filter((f) => {
    if (type && (f.media_type ?? "movie") !== type) return false;
    if (genre && !splitList(f.genre).includes(genre)) return false;
    if (country && !splitList(f.country).includes(country)) return false;
    return true;
  });

  const query = (overrides: { genre?: string; country?: string; type?: string }) => {
    const params = new URLSearchParams();
    const g = overrides.genre !== undefined ? overrides.genre : genre;
    const c = overrides.country !== undefined ? overrides.country : country;
    const t = overrides.type !== undefined ? overrides.type : type;
    if (g) params.set("genre", g);
    if (c) params.set("country", c);
    if (t) params.set("type", t);
    const qs = params.toString();
    return qs ? `/film-klasik?${qs}` : "/film-klasik";
  };

  return (
    <div>
      <PageHeader
        title="Film & Series Klasik Dunia"
        description="Film, series, dan anime lawas dari berbagai negara, lengkap dengan rating IMDb — data diambil dari OMDb API."
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Tipe:</span>
          <Link
            href={query({ type: undefined })}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              !type ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-card"
            }`}
          >
            Semua
          </Link>
          <Link
            href={query({ type: "movie" })}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              type === "movie" ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-card"
            }`}
          >
            🎬 Film
          </Link>
          <Link
            href={query({ type: "series" })}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              type === "series" ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-card"
            }`}
          >
            📺 Series / Anime
          </Link>
        </div>

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
            <div
              key={film.id}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <a
                href={film.imdb_id ? `https://www.imdb.com/title/${film.imdb_id}/` : undefined}
                target="_blank"
                rel="noopener noreferrer"
              >
                {film.poster_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={film.poster_url} alt={film.title} className="h-64 w-full object-cover" />
                ) : (
                  <div className="flex h-64 w-full items-center justify-center bg-background text-sm text-muted">
                    Tidak ada poster
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4 pb-0">
                  <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {(film.media_type ?? "movie") === "series" ? "📺 Series" : "🎬 Film"}
                  </span>
                  <p className="mt-2 font-semibold">
                    {film.title} <span className="font-normal text-muted">({film.year})</span>
                  </p>
                  <p className="mt-1 text-xs text-muted">{film.genre}</p>
                  <p className="text-xs text-muted">{film.country}</p>
                  {film.imdb_rating && (
                    <p className="pt-2 text-sm font-semibold text-primary">★ {film.imdb_rating} / 10 IMDb</p>
                  )}
                </div>
              </a>
              <div className="p-4 pt-3">
                <WatchedButton
                  itemType="classic_film"
                  itemId={film.id}
                  returnTo="/film-klasik"
                  userId={user?.id ?? null}
                  isWatched={watchedIds.has(film.id)}
                  className={`w-full rounded-lg border px-3 py-1.5 text-xs font-medium ${
                    watchedIds.has(film.id)
                      ? "border-secondary bg-secondary text-secondary-foreground"
                      : "border-border hover:bg-background"
                  }`}
                />
              </div>
            </div>
          ))}
          {!filtered.length && (
            <p className="col-span-full py-12 text-center text-muted">
              {allFilms.length
                ? "Tidak ada yang cocok dengan filter ini."
                : "Katalog film & series klasik belum diisi admin."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
