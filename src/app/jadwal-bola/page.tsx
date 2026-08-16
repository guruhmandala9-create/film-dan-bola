import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { ALL_TEAMS, LEAGUES } from "@/lib/constants";
import { formatDateTime } from "@/lib/datetime";
import { isMatchFinished, formatMatchResult } from "@/lib/match-result";
import WatchlistButton from "@/components/WatchlistButton";
import SearchBox from "@/components/SearchBox";

export default async function JadwalBolaPage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string; q?: string }>;
}) {
  const { team, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("matches").select("*").order("kickoff_time", { ascending: true });
  if (team) query = query.or(`home_team.eq.${team},away_team.eq.${team}`);
  if (q) {
    const term = q.replace(/,/g, " ");
    query = query.or(`home_team.ilike.%${term}%,away_team.ilike.%${term}%,league.ilike.%${term}%`);
  }
  const { data: matches } = await query;

  const returnTo = `/jadwal-bola${
    team || q
      ? `?${new URLSearchParams({ ...(team && { team }), ...(q && { q }) }).toString()}`
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
      .eq("item_type", "match");
    watchlistedIds = new Set(watchlist?.map((w) => w.item_id));
  }

  const byLeague = new Map<string, NonNullable<typeof matches>>();
  for (const match of matches ?? []) {
    if (!byLeague.has(match.league)) byLeague.set(match.league, []);
    byLeague.get(match.league)!.push(match);
  }
  const leagueGroups = LEAGUES.filter((l) => byLeague.has(l)).map((l) => [l, byLeague.get(l)!] as const);
  const isFiltering = Boolean(team || q);

  return (
    <div>
      <PageHeader
        title="Jadwal Bola"
        description="Jadwal pertandingan dari liga-liga populer, dengan filter tim favorit."
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <SearchBox action="/jadwal-bola" placeholder="Cari tim atau liga..." defaultValue={q} hiddenParams={{ team }} />

        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/jadwal-bola"
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              !team ? "border-secondary bg-secondary text-secondary-foreground" : "border-border hover:bg-card"
            }`}
          >
            Semua tim
          </Link>
          {ALL_TEAMS.map((t) => (
            <Link
              key={t}
              href={`/jadwal-bola?team=${encodeURIComponent(t)}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                team === t ? "border-secondary bg-secondary text-secondary-foreground" : "border-border hover:bg-card"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {leagueGroups.map(([league, leagueMatches]) => (
            <details key={league} open={isFiltering} className="group rounded-xl border border-border bg-card shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
                <span className="font-semibold">{league}</span>
                <span className="flex items-center gap-2 text-sm text-muted">
                  {leagueMatches.length} pertandingan
                  <span className="transition-transform group-open:rotate-180">▾</span>
                </span>
              </summary>

              <div className="grid gap-4 border-t border-border p-5 sm:grid-cols-2 lg:grid-cols-3">
                {leagueMatches.map((match) => {
                  const finished = isMatchFinished(match);
                  return (
                    <div
                      key={match.id}
                      className="rounded-xl border border-border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary hover:shadow-md"
                    >
                      <Link href={`/jadwal-bola/${match.id}`}>
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-semibold text-secondary">
                          ⚽ Bola
                        </span>
                        <p className="mt-2 font-semibold">
                          {match.home_team} vs {match.away_team}
                        </p>
                        {finished ? (
                          <p className="mt-2 text-lg font-bold text-secondary">{formatMatchResult(match)}</p>
                        ) : (
                          <p className="mt-2 text-sm text-secondary">{formatDateTime(match.kickoff_time)}</p>
                        )}
                        {finished && <p className="text-xs text-muted">Selesai</p>}
                        {!finished && match.broadcast_channel && <p className="text-sm text-muted">{match.broadcast_channel}</p>}
                      </Link>
                      <div className="mt-3">
                        <WatchlistButton
                          itemType="match"
                          itemId={match.id}
                          returnTo={returnTo}
                          userId={user?.id ?? null}
                          isWatchlisted={watchlistedIds.has(match.id)}
                          className={`rounded-lg border px-3 py-1 text-xs font-medium ${
                            watchlistedIds.has(match.id)
                              ? "border-secondary bg-secondary text-secondary-foreground"
                              : "border-border hover:bg-card"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          ))}
          {!leagueGroups.length && (
            <p className="py-12 text-center text-muted">
              {q
                ? `Tidak ada pertandingan yang cocok dengan "${q}".`
                : `Belum ada jadwal pertandingan${team ? ` untuk ${team}` : ""}.`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
