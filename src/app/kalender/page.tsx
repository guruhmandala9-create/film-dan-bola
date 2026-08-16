import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { getWatchlistItems } from "@/lib/watchlist/get-watchlist-items";
import { dateKeyWIB, formatDateHeader, formatTime } from "@/lib/datetime";
import { isMatchFinished, formatMatchResult } from "@/lib/match-result";

type AgendaItem = {
  id: string;
  href: string;
  when: string;
  title: string;
  subtitle: string;
  kind: "film" | "match";
  badge: string;
};

export default async function KalenderPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div>
        <PageHeader
          title="Kalender"
          description="Satu tampilan kalender yang menggabungkan jadwal film dan jadwal bola yang sudah kamu tandai."
        />
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <p className="font-medium">Masuk untuk melihat kalender tontonanmu</p>
            <div className="flex gap-2">
              <Link href="/login?next=/kalender" className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-background">
                Masuk
              </Link>
              <Link href="/signup" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { films, matches } = await getWatchlistItems(user.id);

  const items: AgendaItem[] = [
    ...films.map((film) => ({
      id: film.id,
      href: `/jadwal-film/${film.id}`,
      when: film.showtime,
      title: film.title,
      subtitle: `${film.cinema_name} — ${film.city}`,
      kind: "film" as const,
      badge: formatTime(film.showtime),
    })),
    ...matches.map((match) => ({
      id: match.id,
      href: `/jadwal-bola/${match.id}`,
      when: match.kickoff_time,
      title: `${match.home_team} vs ${match.away_team}`,
      subtitle: isMatchFinished(match) ? `${match.league} · Selesai` : match.league,
      kind: "match" as const,
      badge: isMatchFinished(match) ? formatMatchResult(match) : formatTime(match.kickoff_time),
    })),
  ].sort((a, b) => a.when.localeCompare(b.when));

  const groups = new Map<string, AgendaItem[]>();
  for (const item of items) {
    const key = dateKeyWIB(item.when);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }

  return (
    <div>
      <PageHeader
        title="Kalender"
        description="Satu tampilan kalender yang menggabungkan jadwal film dan jadwal bola yang sudah kamu tandai."
      />
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        {groups.size ? (
          <div className="flex flex-col gap-8">
            {Array.from(groups.entries()).map(([key, dayItems]) => (
              <div key={key}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                  {formatDateHeader(dayItems[0].when)}
                </h2>
                <div className="flex flex-col gap-2">
                  {dayItems.map((item) => (
                    <Link
                      key={`${item.kind}-${item.id}`}
                      href={item.href}
                      className={`flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                        item.kind === "film" ? "hover:border-primary" : "hover:border-secondary"
                      }`}
                    >
                      <span
                        className={`flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${
                          item.kind === "film"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {item.kind === "film" ? "🎬" : "⚽"} {item.badge}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{item.title}</span>
                        <span className="block truncate text-sm text-muted">{item.subtitle}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <p className="font-medium">Belum ada jadwal yang ditandai</p>
            <p className="max-w-md text-sm text-muted">
              Tandai film atau pertandingan dari halaman Jadwal Film / Jadwal Bola supaya muncul di sini.
            </p>
            <div className="flex gap-2">
              <Link href="/jadwal-film" className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-background">
                Jadwal Film
              </Link>
              <Link href="/jadwal-bola" className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-background">
                Jadwal Bola
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
