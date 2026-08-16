import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MatchForm from "@/components/admin/MatchForm";
import { updateMatch } from "../actions";

export default async function EditMatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: match } = await supabase.from("matches").select("*").eq("id", id).maybeSingle();

  if (!match) notFound();

  const updateMatchWithId = updateMatch.bind(null, id);

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Ubah pertandingan</h2>
      {error && (
        <p className="mb-4 max-w-xl rounded-lg border border-border bg-card px-3 py-2 text-sm text-red-500">
          {error}
        </p>
      )}
      <MatchForm action={updateMatchWithId} defaultValues={match} submitLabel="Simpan perubahan" />
    </div>
  );
}
