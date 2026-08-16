"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleWatchlist(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const returnTo = String(formData.get("returnTo") ?? "/");

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  }

  const itemType = String(formData.get("itemType"));
  const itemId = String(formData.get("itemId"));
  const action = String(formData.get("action"));

  if (action === "add") {
    await supabase.from("watchlist").insert({ user_id: user.id, item_type: itemType, item_id: itemId });
  } else {
    await supabase
      .from("watchlist")
      .delete()
      .eq("user_id", user.id)
      .eq("item_type", itemType)
      .eq("item_id", itemId);
  }

  revalidatePath(returnTo);
  redirect(returnTo);
}
