"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function postComment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const returnTo = String(formData.get("returnTo") ?? "/");
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);

  const itemType = String(formData.get("itemType"));
  const itemId = String(formData.get("itemId"));
  const body = String(formData.get("body") ?? "").trim();

  if (body) {
    await supabase.from("comments").insert({ user_id: user.id, item_type: itemType, item_id: itemId, body });
  }

  redirect(returnTo);
}

export async function deleteComment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const returnTo = String(formData.get("returnTo") ?? "/");
  if (!user) redirect("/login");

  const commentId = String(formData.get("commentId"));
  await supabase.from("comments").delete().eq("id", commentId).eq("user_id", user.id);

  redirect(returnTo);
}

export async function reportComment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const returnTo = String(formData.get("returnTo") ?? "/");
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);

  const commentId = String(formData.get("commentId"));
  await supabase.from("comment_reports").insert({ comment_id: commentId, reporter_id: user.id });

  redirect(returnTo);
}
