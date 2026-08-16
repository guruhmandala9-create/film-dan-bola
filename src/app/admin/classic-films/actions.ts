"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchOmdbByTitle, type OmdbFilm } from "@/lib/omdb";

const CURATED_TITLES = [
  "Citizen Kane",
  "Casablanca",
  "Psycho",
  "Singin' in the Rain",
  "Seven Samurai",
  "Spirited Away",
  "Akira",
  "Bicycle Thieves",
  "Life Is Beautiful",
  "Cinema Paradiso",
  "Amelie",
  "The 400 Blows",
  "Pather Panchali",
  "Sholay",
  "Oldboy",
  "Parasite",
  "The Third Man",
  "Pengabdi Setan",
];

function toRow(film: OmdbFilm) {
  return {
    title: film.title,
    year: film.year,
    genre: film.genre,
    country: film.country,
    imdb_rating: film.imdbRating,
    imdb_id: film.imdbId,
    poster_url: film.posterUrl,
    plot: film.plot,
  };
}

export async function addClassicFilmByTitle(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) redirect("/admin/classic-films?error=Judul%20tidak%20boleh%20kosong");

  const supabase = await createClient();
  const film = await fetchOmdbByTitle(title);

  if (!film) {
    redirect(`/admin/classic-films?error=${encodeURIComponent(`Film "${title}" tidak ditemukan di OMDb`)}`);
  }

  const { error } = await supabase.from("classic_films").upsert(toRow(film!), { onConflict: "imdb_id" });

  if (error) {
    redirect(`/admin/classic-films?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/classic-films");
  revalidatePath("/film-klasik");
  redirect(`/admin/classic-films?added=${encodeURIComponent(film!.title)}`);
}

export async function seedClassicCatalog() {
  const supabase = await createClient();
  const results = await Promise.allSettled(CURATED_TITLES.map((title) => fetchOmdbByTitle(title)));

  let added = 0;
  let failed = 0;

  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      const { error } = await supabase.from("classic_films").upsert(toRow(result.value), { onConflict: "imdb_id" });
      if (error) failed += 1;
      else added += 1;
    } else {
      failed += 1;
    }
  }

  revalidatePath("/admin/classic-films");
  revalidatePath("/film-klasik");
  redirect(`/admin/classic-films?seeded=${added}&failed=${failed}`);
}

export async function deleteClassicFilm(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("classic_films").delete().eq("id", id);
  revalidatePath("/admin/classic-films");
  revalidatePath("/film-klasik");
  redirect("/admin/classic-films");
}
