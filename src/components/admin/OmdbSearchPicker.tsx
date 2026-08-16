"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { searchOmdb, addClassicFilmByImdbId } from "@/app/admin/classic-films/actions";
import type { OmdbSearchResult } from "@/lib/omdb";

export default function OmdbSearchPicker() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"movie" | "series">("movie");
  const [results, setResults] = useState<OmdbSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, startSearch] = useTransition();
  const [addingId, setAddingId] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Debounced search against an external API (OMDb via a server action) —
    // clearing stale results when the query shrinks is part of that sync.
    if (query.trim().length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      setOpen(false);
      return;
    }
    const timer = setTimeout(() => {
      startSearch(async () => {
        const data = await searchOmdb(query, type);
        setResults(data);
        setOpen(true);
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [query, type]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handlePick(imdbId: string) {
    setAddingId(imdbId);
    await addClassicFilmByImdbId(imdbId);
  }

  return (
    <div ref={boxRef} className="relative w-full max-w-lg">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Ketik judul film/series (mis. Avengers, Attack on Titan)..."
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "movie" | "series")}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="movie">Film</option>
          <option value="series">Series / Anime</option>
        </select>
      </div>

      {searching && <p className="mt-1 text-xs text-muted">Mencari...</p>}

      {open && results.length > 0 && (
        <div className="absolute z-20 mt-1 max-h-96 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-md">
          {results.map((r) => (
            <button
              key={r.imdbId}
              type="button"
              disabled={addingId !== null}
              onClick={() => handlePick(r.imdbId)}
              className="flex w-full items-center gap-3 border-b border-border px-3 py-2 text-left text-sm last:border-b-0 hover:bg-muted-bg disabled:opacity-50"
            >
              <div className="h-14 w-10 shrink-0 overflow-hidden rounded bg-background">
                {r.posterUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.posterUrl} alt={r.title} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{r.title}</span>
                <span className="text-xs text-muted">
                  {r.year} · {r.mediaType === "series" ? "Series" : "Film"}
                </span>
              </span>
              {addingId === r.imdbId && <span className="text-xs text-primary">Menambahkan...</span>}
            </button>
          ))}
        </div>
      )}

      {open && !searching && results.length === 0 && query.trim().length >= 2 && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted shadow-md">
          Tidak ada hasil untuk &quot;{query}&quot;.
        </div>
      )}
    </div>
  );
}
