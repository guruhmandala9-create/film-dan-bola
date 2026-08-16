export default function ComingSoon({ note }: { note: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card p-8 text-center">
        <p className="font-medium">Segera hadir</p>
        <p className="max-w-md text-sm text-muted">{note}</p>
      </div>
    </div>
  );
}
