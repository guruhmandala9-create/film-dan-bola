import { CITIES, GENRES } from "@/lib/constants";
import { toDatetimeLocalValue } from "@/lib/datetime";

export default function FilmForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: {
    title?: string;
    genre?: string[];
    synopsis?: string | null;
    poster_url?: string | null;
    city?: string;
    cinema_name?: string;
    showtime?: string;
  };
  submitLabel: string;
}) {
  const selectedGenres = new Set(defaultValues?.genre ?? []);

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Judul film
        <input
          type="text"
          name="title"
          required
          defaultValue={defaultValues?.title}
          className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary"
        />
      </label>

      <fieldset>
        <legend className="mb-2 text-sm">Genre</legend>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <label
              key={genre}
              className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground"
            >
              <input type="checkbox" name="genre" value={genre} defaultChecked={selectedGenres.has(genre)} className="sr-only" />
              {genre}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Kota
          <select
            name="city"
            required
            defaultValue={defaultValues?.city}
            className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          >
            <option value="" disabled>
              Pilih kota
            </option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Nama bioskop
          <input
            type="text"
            name="cinema_name"
            required
            defaultValue={defaultValues?.cinema_name}
            className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Jam tayang (WIB)
        <input
          type="datetime-local"
          name="showtime"
          required
          defaultValue={toDatetimeLocalValue(defaultValues?.showtime)}
          className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        URL poster (opsional)
        <input
          type="url"
          name="poster_url"
          defaultValue={defaultValues?.poster_url ?? ""}
          className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Sinopsis (opsional)
        <textarea
          name="synopsis"
          rows={3}
          defaultValue={defaultValues?.synopsis ?? ""}
          className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary"
        />
      </label>

      <button
        type="submit"
        className="self-start rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        {submitLabel}
      </button>
    </form>
  );
}
