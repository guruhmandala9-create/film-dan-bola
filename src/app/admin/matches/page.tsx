import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/datetime";
import { isMatchFinished, formatMatchResult } from "@/lib/match-result";
import { deleteMatch } from "./actions";

export default async function AdminMatchesPage() {
  const supabase = await createClient();
  const { data: matches } = await supabase
    .from("matches")
    .select("id, league, home_team, away_team, kickoff_time, broadcast_channel, home_score, away_score")
    .order("kickoff_time", { ascending: true });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">{matches?.length ?? 0} pertandingan terdaftar</p>
        <Link
          href="/admin/matches/new"
          className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground hover:opacity-90"
        >
          + Tambah pertandingan
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-card text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Pertandingan</th>
              <th className="px-4 py-3 font-medium">Liga</th>
              <th className="px-4 py-3 font-medium">Kick-off</th>
              <th className="px-4 py-3 font-medium">Skor</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {matches?.map((match) => (
              <tr key={match.id} className="transition-colors hover:bg-muted-bg">
                <td className="px-4 py-3">
                  <p className="font-medium">
                    {match.home_team} vs {match.away_team}
                  </p>
                  <p className="text-xs text-muted">{match.broadcast_channel}</p>
                </td>
                <td className="px-4 py-3">{match.league}</td>
                <td className="px-4 py-3">{formatDateTime(match.kickoff_time)}</td>
                <td className="px-4 py-3">
                  {isMatchFinished(match) ? (
                    <span className="font-semibold">{formatMatchResult(match)}</span>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/matches/${match.id}`} className="text-primary hover:underline">
                      Ubah
                    </Link>
                    <form action={deleteMatch}>
                      <input type="hidden" name="id" value={match.id} />
                      <button type="submit" className="text-red-500 hover:underline">
                        Hapus
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {!matches?.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Belum ada pertandingan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
