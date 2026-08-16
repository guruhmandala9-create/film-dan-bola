export type OmdbFilm = {
  title: string;
  year: string;
  genre: string;
  country: string;
  imdbRating: number | null;
  imdbId: string;
  posterUrl: string | null;
  plot: string;
  mediaType: "movie" | "series";
};

export async function fetchOmdbByTitle(
  title: string,
  options?: { year?: string; type?: "movie" | "series" }
): Promise<OmdbFilm | null> {
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) throw new Error("OMDB_API_KEY belum diatur");

  const type = options?.type ?? "movie";
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&type=${type}&t=${encodeURIComponent(title)}${
    options?.year ? `&y=${encodeURIComponent(options.year)}` : ""
  }`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.Response === "False") {
    console.error(`OMDb lookup failed for "${title}" (${type})${options?.year ? ` [${options.year}]` : ""}: ${data.Error} [http ${res.status}]`);
    return null;
  }

  return {
    title: data.Title,
    year: data.Year,
    genre: data.Genre,
    country: data.Country,
    imdbRating: data.imdbRating && data.imdbRating !== "N/A" ? parseFloat(data.imdbRating) : null,
    imdbId: data.imdbID,
    posterUrl: data.Poster && data.Poster !== "N/A" ? data.Poster : null,
    plot: data.Plot,
    mediaType: data.Type === "series" ? "series" : "movie",
  };
}
