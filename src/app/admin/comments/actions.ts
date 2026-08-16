"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function setCommentHidden(formData: FormData) {
  const commentId = String(formData.get("commentId") ?? "");
  const hidden = formData.get("hidden") === "true";
  const supabase = await createClient();
  await supabase.from("comments").update({ is_hidden: hidden }).eq("id", commentId);
  revalidatePath("/admin/comments");
}

export async function setProfileCommentHidden(formData: FormData) {
  const commentId = String(formData.get("commentId") ?? "");
  const hidden = formData.get("hidden") === "true";
  const supabase = await createClient();
  await supabase.from("profile_comments").update({ is_hidden: hidden }).eq("id", commentId);
  revalidatePath("/admin/comments");
}
