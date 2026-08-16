"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function parseFilmForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    genre: formData.getAll("genre").map(String),
    synopsis: String(formData.get("synopsis") ?? "") || null,
    poster_url: String(formData.get("poster_url") ?? "") || null,
    city: String(formData.get("city") ?? ""),
    cinema_name: String(formData.get("cinema_name") ?? ""),
    showtime: new Date(String(formData.get("showtime"))).toISOString(),
  };
}

export async function createFilm(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("films").insert(parseFilmForm(formData));

  if (error) {
    redirect(`/admin/films/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/films");
  revalidatePath("/jadwal-film");
  redirect("/admin/films");
}

export async function updateFilm(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("films").update(parseFilmForm(formData)).eq("id", id);

  if (error) {
    redirect(`/admin/films/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/films");
  revalidatePath("/jadwal-film");
  redirect("/admin/films");
}

export async function deleteFilm(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("films").delete().eq("id", id);
  revalidatePath("/admin/films");
  revalidatePath("/jadwal-film");
  redirect("/admin/films");
}
