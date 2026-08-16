import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/datetime";
import WatchlistButton from "@/components/WatchlistButton";
import WatchedButton from "@/components/WatchedButton";
import ReactionBar from "@/components/ReactionBar";
import CommentSection from "@/components/CommentSection";

export default async function FilmDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: film } = await supabase.from("films").select("*").eq("id", id).maybeSingle();

  if (!film) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/jadwal-film" className="text-sm text-muted hover:underline">
        &larr; Kembali ke Jadwal Film
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{film.title}</h1>
          <p className="mt-1 text-muted">{film.genre?.join(", ")}</p>
        </div>
        <div className="flex gap-2">
          <WatchlistButton itemType="film" itemId={film.id} returnTo={`/jadwal-film/${film.id}`} />
          <WatchedButton itemType="film" itemId={film.id} returnTo={`/jadwal-film/${film.id}`} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted">Bioskop</p>
          <p className="font-medium">{film.cinema_name}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Kota</p>
          <p className="font-medium">{film.city}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Jam tayang</p>
          <p className="font-medium text-primary">{formatDateTime(film.showtime)}</p>
        </div>
      </div>

      {film.synopsis && (
        <div className="mt-6">
          <p className="font-semibold">Sinopsis</p>
          <p className="mt-1 text-muted">{film.synopsis}</p>
        </div>
      )}

      <ReactionBar itemType="film" itemId={film.id} returnTo={`/jadwal-film/${film.id}`} />
      <CommentSection itemType="film" itemId={film.id} returnTo={`/jadwal-film/${film.id}`} />
    </div>
  );
}
