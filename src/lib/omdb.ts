export type OmdbFilm = {
  title: string;
  year: string;
  genre: string;
  country: string;
  imdbRating: number | null;
  imdbId: string;
  posterUrl: string | null;
  plot: string;
};

export async function fetchOmdbByTitle(title: string, year?: string): Promise<OmdbFilm | null> {
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) throw new Error("OMDB_API_KEY belum diatur");

  const url = `https://www.omdbapi.com/?apikey=${apiKey}&type=movie&t=${encodeURIComponent(title)}${
    year ? `&y=${encodeURIComponent(year)}` : ""
  }`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.Response === "False") return null;

  return {
    title: data.Title,
    year: data.Year,
    genre: data.Genre,
    country: data.Country,
    imdbRating: data.imdbRating && data.imdbRating !== "N/A" ? parseFloat(data.imdbRating) : null,
    imdbId: data.imdbID,
    posterUrl: data.Poster && data.Poster !== "N/A" ? data.Poster : null,
    plot: data.Plot,
  };
}
