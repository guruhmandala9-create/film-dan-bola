"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function toggleReaction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const returnTo = String(formData.get("returnTo") ?? "/");
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);

  const itemType = String(formData.get("itemType"));
  const itemId = String(formData.get("itemId"));
  const emoji = String(formData.get("emoji"));

  const { data: existing } = await supabase
    .from("reactions")
    .select("id, emoji")
    .eq("user_id", user.id)
    .eq("item_type", itemType)
    .eq("item_id", itemId)
    .maybeSingle();

  if (existing?.emoji === emoji) {
    await supabase.from("reactions").delete().eq("id", existing.id);
  } else if (existing) {
    await supabase.from("reactions").update({ emoji }).eq("id", existing.id);
  } else {
    await supabase.from("reactions").insert({ user_id: user.id, item_type: itemType, item_id: itemId, emoji });
  }

  redirect(returnTo);
}
