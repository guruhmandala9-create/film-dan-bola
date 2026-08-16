import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { ALL_TEAMS } from "@/lib/constants";
import { formatDateTime } from "@/lib/datetime";

export default async function JadwalBolaPage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string }>;
}) {
  const { team } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("matches").select("*").order("kickoff_time", { ascending: true });
  if (team) query = query.or(`home_team.eq.${team},away_team.eq.${team}`);
  const { data: matches } = await query;

  return (
    <div>
      <PageHeader
        title="Jadwal Bola"
        description="Jadwal pertandingan dari liga-liga populer, dengan filter tim favorit."
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches?.map((match) => (
            <Link
              key={match.id}
              href={`/jadwal-bola/${match.id}`}
              className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-secondary"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-muted">{match.league}</p>
              <p className="mt-1 font-semibold">
                {match.home_team} vs {match.away_team}
              </p>
              <p className="mt-3 text-sm text-secondary">{formatDateTime(match.kickoff_time)}</p>
              {match.broadcast_channel && <p className="text-sm text-muted">{match.broadcast_channel}</p>}
            </Link>
          ))}
          {!matches?.length && (
            <p className="col-span-full py-12 text-center text-muted">
              Belum ada jadwal pertandingan{team ? ` untuk ${team}` : ""}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
