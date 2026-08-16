"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchOmdbByTitle, fetchOmdbById, searchOmdbTitles, type OmdbFilm, type OmdbSearchResult } from "@/lib/omdb";
import { CURATED_BATCHES } from "@/lib/classic-films/curated-titles";

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
    media_type: film.mediaType,
  };
}

export async function addClassicFilmByTitle(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const type = formData.get("type") === "series" ? "series" : "movie";
  if (!title) redirect("/admin/classic-films?error=Judul%20tidak%20boleh%20kosong");

  const supabase = await createClient();
  const film = await fetchOmdbByTitle(title, { type });

  if (!film) {
    redirect(`/admin/classic-films?error=${encodeURIComponent(`"${title}" (${type === "series" ? "series" : "film"}) tidak ditemukan di OMDb`)}`);
  }

  const { error } = await supabase.from("classic_films").upsert(toRow(film!), { onConflict: "imdb_id" });

  if (error) {
    redirect(`/admin/classic-films?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/classic-films");
  revalidatePath("/film-klasik");
  redirect(`/admin/classic-films?added=${encodeURIComponent(film!.title)}`);
}

export async function searchOmdb(query: string, type?: "movie" | "series"): Promise<OmdbSearchResult[]> {
  if (!query.trim()) return [];
  return searchOmdbTitles(query, type);
}

export async function addClassicFilmByImdbId(imdbId: string) {
  const supabase = await createClient();
  const film = await fetchOmdbById(imdbId);

  if (!film) {
    redirect(`/admin/classic-films?error=${encodeURIComponent("Gagal mengambil detail dari OMDb")}`);
  }

  const { error } = await supabase.from("classic_films").upsert(toRow(film!), { onConflict: "imdb_id" });

  if (error) {
    redirect(`/admin/classic-films?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/classic-films");
  revalidatePath("/film-klasik");
  redirect(`/admin/classic-films?added=${encodeURIComponent(film!.title)}`);
}

export async function seedClassicBatch(formData: FormData) {
  const batchIndex = Number(formData.get("batch") ?? 0);
  const batch = CURATED_BATCHES[batchIndex];
  if (!batch) redirect("/admin/classic-films?error=Batch%20tidak%20valid");

  const supabase = await createClient();
  const results = await Promise.allSettled(
    batch.map((item) => fetchOmdbByTitle(item.title, { year: item.year, type: "movie" }))
  );

  let added = 0;
  let failed = 0;

  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      const { error } = await supabase.from("classic_films").upsert(toRow(result.value), { onConflict: "imdb_id" });
      if (error) {
        console.error(`Upsert failed for "${result.value.title}": ${error.message}`);
        failed += 1;
      } else {
        added += 1;
      }
    } else {
      if (result.status === "rejected") {
        console.error(`fetchOmdbByTitle rejected: ${result.reason}`);
      }
      failed += 1;
    }
  }

  revalidatePath("/admin/classic-films");
  revalidatePath("/film-klasik");
  redirect(`/admin/classic-films?seeded=${added}&failed=${failed}&batch=${batchIndex + 1}`);
}

export async function deleteClassicFilm(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("classic_films").delete().eq("id", id);
  revalidatePath("/admin/classic-films");
  revalidatePath("/film-klasik");
  redirect("/admin/classic-films");
}
