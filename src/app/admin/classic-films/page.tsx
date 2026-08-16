import { createClient } from "@/lib/supabase/server";
import { addClassicFilmByTitle, seedClassicCatalog, deleteClassicFilm } from "./actions";

export default async function AdminClassicFilmsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; added?: string; seeded?: string; failed?: string }>;
}) {
  const { error, added, seeded, failed } = await searchParams;
  const supabase = await createClient();
  const { data: films } = await supabase
    .from("classic_films")
    .select("id, title, year, genre, country, imdb_rating")
    .order("created_at", { ascending: false });

  return (
    <div>
      {error && (
        <p className="mb-4 max-w-xl rounded-md border border-border bg-card px-3 py-2 text-sm text-red-500">{error}</p>
      )}
      {added && (
        <p className="mb-4 max-w-xl rounded-md border border-border bg-card px-3 py-2 text-sm text-primary">
          &quot;{added}&quot; ditambahkan.
        </p>
      )}
      {seeded && (
        <p className="mb-4 max-w-xl rounded-md border border-border bg-card px-3 py-2 text-sm text-primary">
          Selesai isi katalog: {seeded} berhasil{Number(failed) > 0 ? `, ${failed} gagal ditemukan di OMDb` : ""}.
        </p>
      )}

      <div className="mb-6 flex flex-wrap gap-3">
        <form action={addClassicFilmByTitle} className="flex gap-2">
          <input
            type="text"
            name="title"
            required
            placeholder="Judul film (mis. Citizen Kane)"
            className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Tambah dari OMDb
          </button>
        </form>

        <form action={seedClassicCatalog}>
          <button type="submit" className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-card">
            Isi katalog contoh (18 film dunia)
          </button>
        </form>
      </div>

      <p className="mb-3 text-sm text-muted">{films?.length ?? 0} film klasik terdaftar</p>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Judul</th>
              <th className="px-4 py-3 font-medium">Tahun</th>
              <th className="px-4 py-3 font-medium">Genre</th>
              <th className="px-4 py-3 font-medium">Negara</th>
              <th className="px-4 py-3 font-medium">IMDb</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {films?.map((film) => (
              <tr key={film.id}>
                <td className="px-4 py-3 font-medium">{film.title}</td>
                <td className="px-4 py-3">{film.year}</td>
                <td className="px-4 py-3 text-muted">{film.genre}</td>
                <td className="px-4 py-3 text-muted">{film.country}</td>
                <td className="px-4 py-3">{film.imdb_rating ?? "-"}</td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteClassicFilm}>
                    <input type="hidden" name="id" value={film.id} />
                    <button type="submit" className="text-red-500 hover:underline">
                      Hapus
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {!films?.length && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  Belum ada film klasik.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
