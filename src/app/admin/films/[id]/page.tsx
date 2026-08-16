import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FilmForm from "@/components/admin/FilmForm";
import { updateFilm } from "../actions";

export default async function EditFilmPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: film } = await supabase.from("films").select("*").eq("id", id).maybeSingle();

  if (!film) notFound();

  const updateFilmWithId = updateFilm.bind(null, id);

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Ubah film</h2>
      {error && (
        <p className="mb-4 max-w-xl rounded-md border border-border bg-card px-3 py-2 text-sm text-red-500">
          {error}
        </p>
      )}
      <FilmForm action={updateFilmWithId} defaultValues={film} submitLabel="Simpan perubahan" />
    </div>
  );
}
