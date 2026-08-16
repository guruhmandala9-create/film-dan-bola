import { LEAGUES } from "@/lib/constants";
import { toDatetimeLocalValue } from "@/lib/datetime";

export default function MatchForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: {
    league?: string;
    home_team?: string;
    away_team?: string;
    broadcast_channel?: string | null;
    kickoff_time?: string;
    home_score?: number | null;
    away_score?: number | null;
  };
  submitLabel: string;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Liga
        <select
          name="league"
          required
          defaultValue={defaultValues?.league}
          className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
        >
          <option value="" disabled>
            Pilih liga
          </option>
          {LEAGUES.map((league) => (
            <option key={league} value={league}>
              {league}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Tim tuan rumah
          <input
            type="text"
            name="home_team"
            required
            defaultValue={defaultValues?.home_team}
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Tim tamu
          <input
            type="text"
            name="away_team"
            required
            defaultValue={defaultValues?.away_team}
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Waktu kick-off (WIB)
        <input
          type="datetime-local"
          name="kickoff_time"
          required
          defaultValue={toDatetimeLocalValue(defaultValues?.kickoff_time)}
          className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Skor tuan rumah (isi setelah selesai)
          <input
            type="number"
            name="home_score"
            min={0}
            defaultValue={defaultValues?.home_score ?? ""}
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Skor tim tamu (isi setelah selesai)
          <input
            type="number"
            name="away_score"
            min={0}
            defaultValue={defaultValues?.away_score ?? ""}
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Saluran siaran (opsional)
        <input
          type="text"
          name="broadcast_channel"
          defaultValue={defaultValues?.broadcast_channel ?? ""}
          placeholder="mis. Vidio, beIN Sports"
          className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
        />
      </label>

      <button
        type="submit"
        className="self-start rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground hover:opacity-90"
      >
        {submitLabel}
      </button>
    </form>
  );
}
