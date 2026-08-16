import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/datetime";

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: match } = await supabase.from("matches").select("*").eq("id", id).maybeSingle();

  if (!match) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/jadwal-bola" className="text-sm text-muted hover:underline">
        &larr; Kembali ke Jadwal Bola
      </Link>

      <p className="mt-4 text-sm font-medium uppercase tracking-wide text-muted">{match.league}</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
        {match.home_team} vs {match.away_team}
      </h1>

      <div className="mt-6 grid gap-4 rounded-lg border border-border bg-card p-5 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted">Kick-off</p>
          <p className="font-medium text-secondary">{formatDateTime(match.kickoff_time)}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Saluran siaran</p>
          <p className="font-medium">{match.broadcast_channel || "-"}</p>
        </div>
      </div>
    </div>
  );
}
