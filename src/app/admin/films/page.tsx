import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/datetime";
import { deleteFilm } from "./actions";

export default async function AdminFilmsPage() {
  const supabase = await createClient();
  const { data: films } = await supabase
    .from("films")
    .select("id, title, city, cinema_name, showtime, genre")
    .order("showtime", { ascending: true });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">{films?.length ?? 0} film terdaftar</p>
        <Link
          href="/admin/films/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          + Tambah film
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-card text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Judul</th>
              <th className="px-4 py-3 font-medium">Kota / Bioskop</th>
              <th className="px-4 py-3 font-medium">Jam tayang</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {films?.map((film) => (
              <tr key={film.id} className="transition-colors hover:bg-muted-bg">
                <td className="px-4 py-3">
                  <p className="font-medium">{film.title}</p>
                  <p className="text-xs text-muted">{film.genre?.join(", ")}</p>
                </td>
                <td className="px-4 py-3">
                  {film.city} — {film.cinema_name}
                </td>
                <td className="px-4 py-3">{formatDateTime(film.showtime)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/films/${film.id}`} className="text-primary hover:underline">
                      Ubah
                    </Link>
                    <form action={deleteFilm}>
                      <input type="hidden" name="id" value={film.id} />
                      <button type="submit" className="text-red-500 hover:underline">
                        Hapus
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {!films?.length && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  Belum ada film.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
