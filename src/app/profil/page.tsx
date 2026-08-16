import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";

export default async function ProfilPage() {
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
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-card p-8 text-center">
            <p className="font-medium">Kamu belum masuk</p>
            <div className="flex gap-2">
              <Link href="/login" className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-background">
                Masuk
              </Link>
              <Link href="/signup" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
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
    .select("display_name, city, favorite_genres, favorite_teams, is_admin")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div>
      <PageHeader
        title="Profil"
        description="Kelola akun, preferensi tim/genre favorit, dan tontonan yang sudah ditandai."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="font-semibold">{profile?.display_name || user.email}</p>
          <p className="text-sm text-muted">{user.email}</p>

          {profile ? (
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
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

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/onboarding"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-background"
            >
              {profile ? "Ubah preferensi" : "Atur preferensi"}
            </Link>
            <Link
              href="/tontonan-saya"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-background"
            >
              Tontonan Saya
            </Link>
            {profile?.is_admin && (
              <Link
                href="/admin"
                className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
              >
                Panel Admin
              </Link>
            )}
            <form action={signOut}>
              <button type="submit" className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-background">
                Keluar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
