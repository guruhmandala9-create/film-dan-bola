import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import WatchedButton from "@/components/WatchedButton";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Sudah Ditonton" };

export default async function SudahDitontonPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/sudah-ditonton");

  const { data: watched } = await supabase
    .from("watched_items")
    .select("item_type, item_id, watched_at")
    .eq("user_id", user.id)
    .order("watched_at", { ascending: false });

  const filmIds = (watched ?? []).filter((w) => w.item_type === "film").map((w) => w.item_id);
  const classicIds = (watched ?? []).filter((w) => w.item_type === "classic_film").map((w) => w.item_id);

  const [{ data: films }, { data: classics }] = await Promise.all([
    filmIds.length ? supabase.from("films").select("*").in("id", filmIds) : Promise.resolve({ data: [] }),
    classicIds.length ? supabase.from("classic_films").select("*").in("id", classicIds) : Promise.resolve({ data: [] }),
  ]);

  return (
    <div>
      <PageHeader title="Sudah Ditonton" description="Riwayat film dan film klasik yang sudah kamu tonton." />

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <section>
          <h2 className="mb-3 font-semibold">Film ({films?.length ?? 0})</h2>
          {films?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {films.map((film) => (
                <div key={film.id} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                  <Link href={`/jadwal-film/${film.id}`}>
                    <p className="font-semibold">{film.title}</p>
                    <p className="mt-1 text-sm text-muted">{film.genre?.join(", ")}</p>
                  </Link>
                  <div className="mt-3">
                    <WatchedButton
                      itemType="film"
                      itemId={film.id}
                      returnTo="/sudah-ditonton"
                      userId={user.id}
                      isWatched
                      className="rounded-lg border border-secondary bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted">
              Belum ada film yang ditandai sudah ditonton.
            </p>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-3 font-semibold">Film Klasik ({classics?.length ?? 0})</h2>
          {classics?.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {classics.map((film) => (
                <div key={film.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                  {film.poster_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={film.poster_url} alt={film.title} className="h-48 w-full object-cover" />
                  ) : null}
                  <div className="p-3">
                    <p className="text-sm font-semibold">{film.title}</p>
                    <p className="text-xs text-muted">{film.year}</p>
                    <div className="mt-2">
                      <WatchedButton
                        itemType="classic_film"
                        itemId={film.id}
                        returnTo="/sudah-ditonton"
                        userId={user.id}
                        isWatched
                        className="rounded-lg border border-secondary bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted">
              Belum ada film klasik yang ditandai sudah ditonton.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
