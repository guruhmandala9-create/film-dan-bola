"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  if (!profile?.is_admin) throw new Error("Unauthorized");
}

export async function setCommentHidden(formData: FormData) {
  await assertAdmin();
  const commentId = String(formData.get("commentId") ?? "");
  const hidden = formData.get("hidden") === "true";
  const admin = createAdminClient();
  await admin.from("comments").update({ is_hidden: hidden }).eq("id", commentId);
  revalidatePath("/admin/comments");
}

export async function setProfileCommentHidden(formData: FormData) {
  await assertAdmin();
  const commentId = String(formData.get("commentId") ?? "");
  const hidden = formData.get("hidden") === "true";
  const admin = createAdminClient();
  await admin.from("profile_comments").update({ is_hidden: hidden }).eq("id", commentId);
  revalidatePath("/admin/comments");
}
