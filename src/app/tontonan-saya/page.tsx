import Link from "next/link";
import { redirect } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import WatchlistButton from "@/components/WatchlistButton";
import { createClient } from "@/lib/supabase/server";
import { getWatchlistItems } from "@/lib/watchlist/get-watchlist-items";
import { formatDateTime } from "@/lib/datetime";

export default async function TontonanSayaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/tontonan-saya");

  const { films, matches } = await getWatchlistItems(user.id);

  return (
    <div>
      <PageHeader
        title="Tontonan Saya"
        description="Film dan pertandingan yang sudah kamu tandai untuk ditonton."
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <section>
          <h2 className="mb-3 font-semibold">Film ({films.length})</h2>
          {films.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {films.map((film) => (
                <div key={film.id} className="rounded-lg border border-border bg-card p-5">
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
                      returnTo="/tontonan-saya"
                      userId={user.id}
                      isWatchlisted
                      className="rounded-md border border-primary bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-border bg-card p-6 text-sm text-muted">
              Belum ada film yang ditandai.{" "}
              <Link href="/jadwal-film" className="underline">
                Cari film
              </Link>
              .
            </p>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-3 font-semibold">Pertandingan ({matches.length})</h2>
          {matches.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map((match) => (
                <div key={match.id} className="rounded-lg border border-border bg-card p-5">
                  <Link href={`/jadwal-bola/${match.id}`}>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">{match.league}</p>
                    <p className="mt-1 font-semibold">
                      {match.home_team} vs {match.away_team}
                    </p>
                    <p className="mt-3 text-sm text-secondary">{formatDateTime(match.kickoff_time)}</p>
                  </Link>
                  <div className="mt-3">
                    <WatchlistButton
                      itemType="match"
                      itemId={match.id}
                      returnTo="/tontonan-saya"
                      userId={user.id}
                      isWatchlisted
                      className="rounded-md border border-secondary bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-border bg-card p-6 text-sm text-muted">
              Belum ada pertandingan yang ditandai.{" "}
              <Link href="/jadwal-bola" className="underline">
                Cari jadwal bola
              </Link>
              .
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
