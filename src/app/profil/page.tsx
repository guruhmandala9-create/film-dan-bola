import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import { updateProfileDetails, uploadAvatar } from "@/lib/profile/actions";

export const metadata: Metadata = { title: "Profil" };

export default async function ProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div>
        <PageHeader
          title="Profil"
          description="Kelola akun, preferensi tim/genre favorit, dan tontonan yang sudah ditandai."
        />
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <p className="font-medium">Kamu belum masuk</p>
            <div className="flex gap-2">
              <Link href="/login" className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-background">
                Masuk
              </Link>
              <Link href="/signup" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, city, favorite_genres, favorite_teams, is_admin, username, avatar_url, bio")
    .eq("id", user.id)
    .maybeSingle();

  const { count: watchedCount } = await supabase
    .from("watched_items")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <div>
      <PageHeader
        title="Profil"
        description="Kelola akun, preferensi tim/genre favorit, dan tontonan yang sudah ditandai."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {error && (
          <p className="mb-4 max-w-xl rounded-lg border border-border bg-card px-3 py-2 text-sm text-red-500">{error}</p>
        )}
        {saved && (
          <p className="mb-4 max-w-xl rounded-lg border border-border bg-card px-3 py-2 text-sm text-primary">Tersimpan.</p>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border border-border bg-background">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="Foto profil" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted">
                  {(profile?.display_name || user.email || "?").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <form action={uploadAvatar} className="mt-4 flex flex-col gap-2">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                required
                className="text-xs file:mr-2 file:rounded-lg file:border file:border-border file:bg-background file:px-2 file:py-1 file:text-xs"
              />
              <button type="submit" className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-background">
                Ganti foto
              </button>
            </form>

            {profile?.username && (
              <Link
                href={`/pengguna/${profile.username}`}
                className="mt-4 block text-center text-sm text-primary underline"
              >
                Lihat profil publik
              </Link>
            )}
            <Link href="/pengguna" className="mt-2 block text-center text-sm text-muted underline">
              Cari pengguna lain
            </Link>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted">{user.email}</p>

              <form action={updateProfileDetails} className="mt-4 flex flex-col gap-3">
                <label className="flex flex-col gap-1 text-sm">
                  Nama tampilan
                  <input
                    type="text"
                    name="display_name"
                    defaultValue={profile?.display_name ?? ""}
                    className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  Username (untuk profil publik & pencarian)
                  <input
                    type="text"
                    name="username"
                    required
                    pattern="[a-z0-9_.]{3,20}"
                    title="3-20 karakter: huruf kecil, angka, underscore, titik"
                    defaultValue={profile?.username ?? ""}
                    placeholder="mis. guruh_mandala"
                    className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  Bio
                  <textarea
                    name="bio"
                    rows={3}
                    defaultValue={profile?.bio ?? ""}
                    placeholder="Ceritakan sedikit tentang dirimu..."
                    className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
                  />
                </label>
                <button
                  type="submit"
                  className="self-start rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Simpan
                </button>
              </form>

              {profile ? (
                <dl className="mt-6 grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-muted">Kota domisili</dt>
                    <dd className="mt-0.5 font-medium">{profile.city || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Tim favorit</dt>
                    <dd className="mt-0.5 font-medium">
                      {profile.favorite_teams?.length ? profile.favorite_teams.join(", ") : "-"}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-muted">Genre favorit</dt>
                    <dd className="mt-0.5 font-medium">
                      {profile.favorite_genres?.length ? profile.favorite_genres.join(", ") : "-"}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-4 text-sm text-muted">Preferensi belum diatur.</p>
              )}

              <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-4">
                <Link
                  href="/onboarding"
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-background"
                >
                  {profile ? "Ubah preferensi" : "Atur preferensi"}
                </Link>
                <Link
                  href="/tontonan-saya"
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-background"
                >
                  Watchlist Saya
                </Link>
                <Link
                  href="/sudah-ditonton"
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-background"
                >
                  Sudah Ditonton ({watchedCount ?? 0})
                </Link>
                {profile?.is_admin && (
                  <Link
                    href="/admin"
                    className="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
                  >
                    Panel Admin
                  </Link>
                )}
                <form action={signOut}>
                  <button type="submit" className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-background">
                    Keluar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
