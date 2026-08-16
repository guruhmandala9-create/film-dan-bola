export function CardGridSkeleton({ count = 6, cols = "sm:grid-cols-2 lg:grid-cols-3" }: { count?: number; cols?: string }) {
  return (
    <div className={`grid gap-4 ${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-5">
          <div className="h-4 w-16 rounded-full bg-muted-bg" />
          <div className="mt-3 h-5 w-3/4 rounded bg-muted-bg" />
          <div className="mt-2 h-3 w-1/2 rounded bg-muted-bg" />
          <div className="mt-4 h-3 w-2/3 rounded bg-muted-bg" />
          <div className="mt-4 h-7 w-24 rounded-lg bg-muted-bg" />
        </div>
      ))}
    </div>
  );
}

export function PosterGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-xl border border-border bg-card">
          <div className="h-64 w-full bg-muted-bg" />
          <div className="p-4">
            <div className="h-4 w-4/5 rounded bg-muted-bg" />
            <div className="mt-2 h-3 w-1/2 rounded bg-muted-bg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-4 rounded-xl border border-border bg-card p-4">
          <div className="h-9 w-16 shrink-0 rounded-lg bg-muted-bg" />
          <div className="flex-1">
            <div className="h-4 w-1/2 rounded bg-muted-bg" />
            <div className="mt-2 h-3 w-1/3 rounded bg-muted-bg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-border">
      <div className="h-11 bg-card" />
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <div className="h-4 w-1/3 rounded bg-muted-bg" />
            <div className="h-4 w-1/4 rounded bg-muted-bg" />
            <div className="h-4 w-1/5 rounded bg-muted-bg" />
          </div>
        ))}
      </div>
    </div>
  );
}
