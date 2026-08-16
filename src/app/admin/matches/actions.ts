"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fromJakartaLocalValue } from "@/lib/datetime";

function parseMatchForm(formData: FormData) {
  return {
    league: String(formData.get("league") ?? ""),
    home_team: String(formData.get("home_team") ?? ""),
    away_team: String(formData.get("away_team") ?? ""),
    broadcast_channel: String(formData.get("broadcast_channel") ?? "") || null,
    kickoff_time: fromJakartaLocalValue(String(formData.get("kickoff_time"))),
  };
}

export async function createMatch(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("matches").insert(parseMatchForm(formData));

  if (error) {
    redirect(`/admin/matches/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/matches");
  revalidatePath("/jadwal-bola");
  redirect("/admin/matches");
}

export async function updateMatch(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("matches").update(parseMatchForm(formData)).eq("id", id);

  if (error) {
    redirect(`/admin/matches/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/matches");
  revalidatePath("/jadwal-bola");
  redirect("/admin/matches");
}

export async function deleteMatch(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("matches").delete().eq("id", id);
  revalidatePath("/admin/matches");
  revalidatePath("/jadwal-bola");
  redirect("/admin/matches");
}
