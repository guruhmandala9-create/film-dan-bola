"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function postProfileComment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const returnTo = String(formData.get("returnTo") ?? "/");
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);

  const profileOwnerId = String(formData.get("profileOwnerId"));
  const body = String(formData.get("body") ?? "").trim();

  if (body) {
    await supabase.from("profile_comments").insert({
      profile_owner_id: profileOwnerId,
      author_id: user.id,
      body,
    });
  }

  revalidatePath(returnTo);
  redirect(returnTo);
}

export async function deleteProfileComment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const returnTo = String(formData.get("returnTo") ?? "/");
  if (!user) redirect("/login");

  const commentId = String(formData.get("commentId"));
  await supabase.from("profile_comments").delete().eq("id", commentId).eq("author_id", user.id);

  revalidatePath(returnTo);
  redirect(returnTo);
}

export async function reportProfileComment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const returnTo = String(formData.get("returnTo") ?? "/");
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);

  const commentId = String(formData.get("commentId"));
  await supabase.from("profile_comment_reports").insert({ profile_comment_id: commentId, reporter_id: user.id });

  revalidatePath(returnTo);
  redirect(returnTo);
}
