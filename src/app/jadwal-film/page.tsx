import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { CITIES } from "@/lib/constants";
import { formatDateTime } from "@/lib/datetime";
import WatchlistButton from "@/components/WatchlistButton";
import SearchBox from "@/components/SearchBox";

export const metadata: Metadata = { title: "Jadwal Film" };

export default async function JadwalFilmPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; q?: string }>;
}) {
  const { city, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("films").select("*").order("showtime", { ascending: true });
  if (city) query = query.eq("city", city);
  if (q) query = query.ilike("title", `%${q}%`);
  const { data: films } = await query;

  const returnTo = `/jadwal-film${
    city || q
      ? `?${new URLSearchParams({ ...(city && { city }), ...(q && { q }) }).toString()}`
      : ""
  }`;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  let watchlistedIds = new Set<string>();
  if (user) {
    const { data: watchlist } = await supabase
      .from("watchlist")
      .select("item_id")
      .eq("user_id", user.id)
      .eq("item_type", "film");
    watchlistedIds = new Set(watchlist?.map((w) => w.item_id));
  }

  return (
    <div>
      <PageHeader
        title="Jadwal Film"
        description="Film yang tayang minggu ini dan yang akan datang, dengan filter kota/bioskop."
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <Link
          href="/film-klasik"
          className="mb-6 flex items-center justify-between rounded-xl border border-dashed border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary"
        >
          <span>
            🎞️ Cari <strong>film, series, dan anime klasik dunia</strong> lengkap dengan rating IMDb
          </span>
          <span className="text-primary">Lihat &rarr;</span>
        </Link>

        <SearchBox action="/jadwal-film" placeholder="Cari judul film..." defaultValue={q} hiddenParams={{ city }} />

        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/jadwal-film"
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              !city ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-card"
            }`}
          >
            Semua kota
          </Link>
          {CITIES.map((c) => (
            <Link
              key={c}
              href={`/jadwal-film?city=${encodeURIComponent(c)}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                city === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-card"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {films?.map((film) => (
            <div
              key={film.id}
              className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <Link href={`/jadwal-film/${film.id}`}>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  🎬 Film
                </span>
                <p className="mt-2 font-semibold">{film.title}</p>
                <p className="mt-1 text-sm text-muted">{film.genre?.join(", ")}</p>
                <p className="mt-3 text-sm">
                  {film.cinema_name} — {film.city}
                </p>
                <p className="text-sm text-primary">{formatDateTime(film.showtime)}</p>
              </Link>
              <div className="mt-3">
                <WatchlistButton
                  itemType="film"
                  itemId={film.id}
                  returnTo={returnTo}
                  userId={user?.id ?? null}
                  isWatchlisted={watchlistedIds.has(film.id)}
                  className={`rounded-lg border px-3 py-1 text-xs font-medium ${
                    watchlistedIds.has(film.id)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-background"
                  }`}
                />
              </div>
            </div>
          ))}
          {!films?.length && (
            <p className="col-span-full py-12 text-center text-muted">
              {q ? `Tidak ada film yang cocok dengan "${q}".` : `Belum ada jadwal film${city ? ` untuk ${city}` : ""}.`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
