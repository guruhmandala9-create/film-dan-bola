import MatchForm from "@/components/admin/MatchForm";
import { createMatch } from "../actions";

export default async function NewMatchPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Tambah pertandingan</h2>
      {error && (
        <p className="mb-4 max-w-xl rounded-lg border border-border bg-card px-3 py-2 text-sm text-red-500">
          {error}
        </p>
      )}
      <MatchForm action={createMatch} submitLabel="Simpan pertandingan" />
    </div>
  );
}
