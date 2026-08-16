import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { CITIES } from "@/lib/constants";
import { formatDateTime } from "@/lib/datetime";
import WatchlistButton from "@/components/WatchlistButton";

export default async function JadwalFilmPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("films").select("*").order("showtime", { ascending: true });
  if (city) query = query.eq("city", city);
  const { data: films } = await query;

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
              className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <Link href={`/jadwal-film/${film.id}`}>
                <p className="font-semibold">{film.title}</p>
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
                  returnTo="/jadwal-film"
                  userId={user?.id ?? null}
                  isWatchlisted={watchlistedIds.has(film.id)}
                  className={`rounded-md border px-3 py-1 text-xs font-medium ${
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
              Belum ada jadwal film{city ? ` untuk ${city}` : ""}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
