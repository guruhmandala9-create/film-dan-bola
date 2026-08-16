import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CITIES, GENRES, TEAMS_BY_LEAGUE } from "@/lib/constants";
import { saveOnboarding } from "./actions";
import BackButton from "@/components/BackButton";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("city, favorite_genres, favorite_teams")
    .eq("id", user.id)
    .maybeSingle();

  const selectedCity = profile?.city;
  const selectedTeams = new Set(profile?.favorite_teams ?? []);
  const selectedGenres = new Set(profile?.favorite_genres ?? []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <BackButton />
      <h1 className="text-2xl font-bold tracking-tight">Yuk, atur preferensimu</h1>
      <p className="mt-1 text-muted">
        Supaya homepage bisa menampilkan film dan jadwal bola yang paling relevan buatmu.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-border bg-card px-3 py-2 text-sm text-red-500">
          {error}
        </p>
      )}

      <form action={saveOnboarding} className="mt-8 flex flex-col gap-8">
        <fieldset>
          <legend className="mb-3 font-semibold">Kota domisili</legend>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((city, i) => (
              <label
                key={city}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground"
              >
                <input
                  type="radio"
                  name="city"
                  value={city}
                  defaultChecked={selectedCity ? selectedCity === city : i === 0}
                  className="sr-only"
                  required
                />
                {city}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 font-semibold">Tim sepak bola favorit</legend>
          <div className="flex flex-col gap-4">
            {Object.entries(TEAMS_BY_LEAGUE).map(([league, teams]) => (
              <div key={league}>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">{league}</p>
                <div className="flex flex-wrap gap-2">
                  {teams.map((team) => (
                    <label
                      key={team}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm has-[:checked]:border-secondary has-[:checked]:bg-secondary has-[:checked]:text-secondary-foreground"
                    >
                      <input
                        type="checkbox"
                        name="team"
                        value={team}
                        defaultChecked={selectedTeams.has(team)}
                        className="sr-only"
                      />
                      {team}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 font-semibold">Genre film favorit</legend>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <label
                key={genre}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground"
              >
                <input
                  type="checkbox"
                  name="genre"
                  value={genre}
                  defaultChecked={selectedGenres.has(genre)}
                  className="sr-only"
                />
                {genre}
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          className="self-start rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Simpan & lanjutkan
        </button>
      </form>
    </div>
  );
}
