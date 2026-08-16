"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveOnboarding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const city = String(formData.get("city") ?? "");
  const genres = formData.getAll("genre").map(String);
  const teams = formData.getAll("team").map(String);
  const displayName = user.email?.split("@")[0] ?? "Pengguna";

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: displayName,
    city,
    favorite_genres: genres,
    favorite_teams: teams,
  });

  if (error) {
    redirect(`/onboarding?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}
