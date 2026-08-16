import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SearchBox from "@/components/SearchBox";
import { createClient } from "@/lib/supabase/server";

export default async function CariPenggunaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let users: Array<{ id: string; username: string; display_name: string | null; avatar_url: string | null; bio: string | null }> = [];
  if (q) {
    const { data } = await supabase
      .from("public_profiles")
      .select("id, username, display_name, avatar_url, bio")
      .ilike("username", `%${q}%`)
      .limit(30);
    users = data ?? [];
  }

  return (
    <div>
      <PageHeader title="Cari Pengguna" description="Temukan dan lihat profil pengguna lain lewat username." />

      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <SearchBox action="/pengguna" placeholder="Cari username..." defaultValue={q} />

        <div className="flex flex-col gap-3">
          {users.map((u) => (
            <Link
              key={u.id}
              href={`/pengguna/${u.username}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-background">
                {u.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={u.avatar_url} alt={u.display_name ?? u.username} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-bold text-muted">
                    {(u.display_name ?? u.username).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{u.display_name || u.username}</p>
                <p className="truncate text-sm text-muted">@{u.username}</p>
              </div>
            </Link>
          ))}
          {q && !users.length && (
            <p className="py-8 text-center text-sm text-muted">Tidak ada pengguna dengan username &quot;{q}&quot;.</p>
          )}
          {!q && <p className="py-8 text-center text-sm text-muted">Ketik username untuk mulai mencari.</p>}
        </div>
      </div>
    </div>
  );
}
