import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/datetime";
import HeroBackground from "@/components/HeroBackground";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { favorite_genres: string[]; favorite_teams: string[] } | null = null;
  let recommendedFilms: Array<{ id: string; title: string; genre: string[]; cinema_name: string; city: string; showtime: string }> = [];
  let recommendedMatches: Array<{ id: string; league: string; home_team: string; away_team: string; kickoff_time: string }> = [];

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("favorite_genres, favorite_teams")
      .eq("id", user.id)
      .maybeSingle();
    profile = data;

    const now = new Date().toISOString();

    if (profile?.favorite_genres?.length) {
      const { data: films } = await supabase
        .from("films")
        .select("id, title, genre, cinema_name, city, showtime")
        .overlaps("genre", profile.favorite_genres)
        .gte("showtime", now)
        .order("showtime", { ascending: true })
        .limit(3);
      recommendedFilms = films ?? [];
    }

    if (profile?.favorite_teams?.length) {
      const teamList = profile.favorite_teams.join(",");
      const { data: matches } = await supabase
        .from("matches")
        .select("id, league, home_team, away_team, kickoff_time")
        .or(`home_team.in.(${teamList}),away_team.in.(${teamList})`)
        .gte("kickoff_time", now)
        .order("kickoff_time", { ascending: true })
        .limit(3);
      recommendedMatches = matches ?? [];
    }
  }

  const hasRecommendations = recommendedFilms.length > 0 || recommendedMatches.length > 0;

  return (
    <div>
      <section className="relative overflow-hidden">
        <HeroBackground />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Jangan sampai ketinggalan nonton
            <br />
            <span className="text-primary">film</span> atau{" "}
            <span className="text-secondary">bola</span>.
          </h1>
          <p className="mt-4 max-w-xl text-muted sm:text-lg">
            Satu tempat untuk cek jadwal tayang film bioskop dan jadwal pertandingan
            sepak bola favoritmu — lengkap dengan reminder, kalender gabungan, dan
            ruang diskusi sesama penggemar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/jadwal-film"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
            >
              Lihat Jadwal Film
            </Link>
            <Link
              href="/jadwal-bola"
              className="rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
            >
              Lihat Jadwal Bola
            </Link>
          </div>
        </div>
      </section>

      {hasRecommendations && (
        <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
          <h2 className="mb-4 text-xl font-bold tracking-tight">Untukmu</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedFilms.map((film) => (
              <Link
                key={film.id}
                href={`/jadwal-film/${film.id}`}
                className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
              >
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
            ))}
            {recommendedMatches.map((match) => (
              <Link
                key={match.id}
                href={`/jadwal-bola/${match.id}`}
                className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary hover:shadow-md"
              >
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-semibold text-secondary">
                  ⚽ {match.league}
                </span>
                <p className="mt-2 font-semibold">
                  {match.home_team} vs {match.away_team}
                </p>
                <p className="mt-3 text-sm text-secondary">{formatDateTime(match.kickoff_time)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Jadwal Film",
              desc: "Film tayang minggu ini di bioskop kotamu.",
              href: "/jadwal-film",
            },
            {
              title: "Jadwal Bola",
              desc: "Jadwal pertandingan tim dan liga favoritmu.",
              href: "/jadwal-bola",
            },
            {
              title: "Kalender Gabungan",
              desc: "Semua jadwal tontonanmu dalam satu tampilan.",
              href: "/kalender",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-muted">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
