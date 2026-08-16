import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/datetime";
import { isMatchFinished, formatMatchResult } from "@/lib/match-result";
import WatchlistButton from "@/components/WatchlistButton";
import ReactionBar from "@/components/ReactionBar";
import CommentSection from "@/components/CommentSection";

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: match } = await supabase.from("matches").select("*").eq("id", id).maybeSingle();

  if (!match) notFound();

  const finished = isMatchFinished(match);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/jadwal-bola" className="text-sm text-muted hover:underline">
        &larr; Kembali ke Jadwal Bola
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-muted">{match.league}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {match.home_team} vs {match.away_team}
          </h1>
        </div>
        <WatchlistButton itemType="match" itemId={match.id} returnTo={`/jadwal-bola/${match.id}`} />
      </div>

      {finished && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Hasil akhir</p>
          <p className="mt-1 text-4xl font-bold text-secondary">{formatMatchResult(match)}</p>
        </div>
      )}

      <div className="mt-6 grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted">Kick-off</p>
          <p className="font-medium text-secondary">{formatDateTime(match.kickoff_time)}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Saluran siaran</p>
          <p className="font-medium">{match.broadcast_channel || "-"}</p>
        </div>
      </div>

      <ReactionBar itemType="match" itemId={match.id} returnTo={`/jadwal-bola/${match.id}`} />
      <CommentSection itemType="match" itemId={match.id} returnTo={`/jadwal-bola/${match.id}`} />
    </div>
  );
}
