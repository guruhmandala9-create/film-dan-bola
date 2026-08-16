export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse px-4 py-10 sm:px-6">
      <div className="h-4 w-40 rounded bg-muted-bg" />
      <div className="mt-4 h-8 w-2/3 rounded bg-muted-bg" />
      <div className="mt-2 h-4 w-1/3 rounded bg-muted-bg" />
      <div className="mt-6 h-32 rounded-xl bg-muted-bg" />
      <div className="mt-6 h-20 rounded-xl bg-muted-bg" />
    </div>
  );
}
