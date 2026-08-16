import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileCommentSection from "@/components/ProfileCommentSection";

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("public_profiles")
    .select("id, username, display_name, avatar_url, bio")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (!profile) notFound();

  const { data: watched } = await supabase
    .from("watched_items")
    .select("item_type, item_id, watched_at")
    .eq("user_id", profile.id)
    .order("watched_at", { ascending: false });

  const filmIds = (watched ?? []).filter((w) => w.item_type === "film").map((w) => w.item_id);
  const classicIds = (watched ?? []).filter((w) => w.item_type === "classic_film").map((w) => w.item_id);

  const [{ data: films }, { data: classics }] = await Promise.all([
    filmIds.length ? supabase.from("films").select("id, title, genre").in("id", filmIds) : Promise.resolve({ data: [] }),
    classicIds.length
      ? supabase.from("classic_films").select("id, title, year, poster_url").in("id", classicIds)
      : Promise.resolve({ data: [] }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border bg-card">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt={profile.display_name ?? profile.username} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted">
              {(profile.display_name ?? profile.username ?? "?").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold">{profile.display_name || profile.username}</h1>
          <p className="text-sm text-muted">@{profile.username}</p>
        </div>
      </div>

      {profile.bio && <p className="mt-4 whitespace-pre-wrap text-sm">{profile.bio}</p>}

      <div className="mt-8">
        <h2 className="mb-3 font-semibold">Sudah ditonton ({(films?.length ?? 0) + (classics?.length ?? 0)})</h2>
        {films?.length || classics?.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {films?.map((f) => (
              <div key={f.id} className="rounded-xl border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
                <p className="text-sm font-medium">{f.title}</p>
                <p className="text-xs text-muted">{f.genre?.join(", ")}</p>
              </div>
            ))}
            {classics?.map((f) => (
              <div key={f.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                {f.poster_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.poster_url} alt={f.title} className="h-40 w-full object-cover" />
                ) : null}
                <div className="p-2">
                  <p className="text-sm font-medium">{f.title}</p>
                  <p className="text-xs text-muted">{f.year}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Belum ada tontonan yang ditandai.</p>
        )}
      </div>

      <ProfileCommentSection profileOwnerId={profile.id} returnTo={`/pengguna/${profile.username}`} />
    </div>
  );
}
