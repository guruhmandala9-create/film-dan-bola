const JAKARTA_OFFSET_MINUTES = 7 * 60;

// Semua jadwal tayang di aplikasi ini ditampilkan dan diinput dalam WIB
// (Asia/Jakarta, UTC+7 tetap, tanpa DST), terlepas dari timezone server.

export function toDatetimeLocalValue(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(new Date(iso).getTime() + JAKARTA_OFFSET_MINUTES * 60_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

export function fromJakartaLocalValue(value: string) {
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const utcMs = Date.UTC(year, month - 1, day, hour, minute) - JAKARTA_OFFSET_MINUTES * 60_000;
  return new Date(utcMs).toISOString();
}

export function formatDateTime(iso: string) {
  const formatted = new Date(iso).toLocaleString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
  return `${formatted} WIB`;
}
