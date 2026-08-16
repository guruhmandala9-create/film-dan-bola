"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const USERNAME_PATTERN = /^[a-z0-9_.]{3,20}$/;

export async function updateProfileDetails(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/profil");

  const usernameRaw = String(formData.get("username") ?? "").trim().toLowerCase();
  const bio = String(formData.get("bio") ?? "").trim();
  const displayName = String(formData.get("display_name") ?? "").trim();

  if (!USERNAME_PATTERN.test(usernameRaw)) {
    redirect(
      "/profil?error=" +
        encodeURIComponent("Username 3-20 karakter, hanya huruf kecil/angka/underscore/titik")
    );
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username: usernameRaw, bio: bio || null, display_name: displayName || null })
    .eq("id", user.id);

  if (error) {
    const message = error.code === "23505" ? "Username sudah dipakai orang lain" : error.message;
    redirect(`/profil?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/profil");
  revalidatePath(`/pengguna/${usernameRaw}`);
  redirect("/profil?saved=1");
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/profil");

  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) {
    redirect("/profil?error=" + encodeURIComponent("Pilih file gambar dulu"));
  }

  if (!file!.type.startsWith("image/")) {
    redirect("/profil?error=" + encodeURIComponent("File harus berupa gambar"));
  }

  if (file!.size > 2 * 1024 * 1024) {
    redirect("/profil?error=" + encodeURIComponent("Ukuran gambar maksimal 2MB"));
  }

  const ext = file!.name.split(".").pop() || "jpg";
  const path = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file!, {
    upsert: true,
    contentType: file!.type,
  });

  if (uploadError) {
    redirect(`/profil?error=${encodeURIComponent(uploadError.message)}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: `${publicUrl}?t=${Date.now()}` })
    .eq("id", user.id);

  if (updateError) {
    redirect(`/profil?error=${encodeURIComponent(updateError.message)}`);
  }

  revalidatePath("/profil");
  redirect("/profil?saved=1");
}
