import { createClient } from "@/lib/supabase/server";
import { seedClassicBatch, deleteClassicFilm } from "./actions";
import { CURATED_BATCHES } from "@/lib/classic-films/curated-titles";
import OmdbSearchPicker from "@/components/admin/OmdbSearchPicker";

export default async function AdminClassicFilmsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; added?: string; seeded?: string; failed?: string; batch?: string }>;
}) {
  const { error, added, seeded, failed, batch } = await searchParams;
  const supabase = await createClient();
  const { data: films } = await supabase
    .from("classic_films")
    .select("id, title, year, genre, country, imdb_rating, media_type")
    .order("created_at", { ascending: false });

  return (
    <div>
      {error && (
        <p className="mb-4 max-w-xl rounded-lg border border-border bg-card px-3 py-2 text-sm text-red-500">{error}</p>
      )}
      {added && (
        <p className="mb-4 max-w-xl rounded-lg border border-border bg-card px-3 py-2 text-sm text-primary">
          &quot;{added}&quot; ditambahkan.
        </p>
      )}
      {seeded && (
        <p className="mb-4 max-w-xl rounded-lg border border-border bg-card px-3 py-2 text-sm text-primary">
          Batch {batch}: {seeded} berhasil{Number(failed) > 0 ? `, ${failed} gagal ditemukan di OMDb` : ""}.
        </p>
      )}

      <div className="mb-6 flex flex-col gap-4">
        <div>
          <p className="mb-2 text-sm text-muted">Cari judul, pilih dari hasil yang muncul:</p>
          <OmdbSearchPicker />
        </div>

        <div>
          <p className="mb-2 text-sm text-muted">
            Isi katalog contoh ({CURATED_BATCHES.flat().length} film dunia, dibagi {CURATED_BATCHES.length} batch supaya tidak kena batas waktu server — klik satu-satu berurutan):
          </p>
          <div className="flex flex-wrap gap-2">
            {CURATED_BATCHES.map((batchItems, i) => (
              <form key={i} action={seedClassicBatch}>
                <input type="hidden" name="batch" value={i} />
                <button type="submit" className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-card">
                  Batch {i + 1} ({batchItems.length} film)
                </button>
              </form>
            ))}
          </div>
        </div>
      </div>

      <p className="mb-3 text-sm text-muted">{films?.length ?? 0} film klasik terdaftar</p>

      <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-card text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Judul</th>
              <th className="px-4 py-3 font-medium">Tipe</th>
              <th className="px-4 py-3 font-medium">Tahun</th>
              <th className="px-4 py-3 font-medium">Genre</th>
              <th className="px-4 py-3 font-medium">Negara</th>
              <th className="px-4 py-3 font-medium">IMDb</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {films?.map((film) => (
              <tr key={film.id} className="transition-colors hover:bg-muted-bg">
                <td className="px-4 py-3 font-medium">{film.title}</td>
                <td className="px-4 py-3 text-muted">{film.media_type === "series" ? "Series" : "Film"}</td>
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
                <td colSpan={7} className="px-4 py-8 text-center text-muted">
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
