import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDateTime } from "@/lib/datetime";

export const dynamic = "force-dynamic";

type WatchlistRow = { id: string; user_id: string; item_id: string };
type FilmItem = { id: string; title: string; showtime: string };
type MatchItem = { id: string; home_team: string; away_team: string; kickoff_time: string };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jadwalnonton.vercel.app";

async function sendReminderEmail(
  resend: Resend,
  to: string,
  itemType: "film" | "match",
  item: FilmItem | MatchItem,
  label: string
) {
  const isFilm = itemType === "film";
  const title = isFilm ? (item as FilmItem).title : `${(item as MatchItem).home_team} vs ${(item as MatchItem).away_team}`;
  const when = isFilm ? (item as FilmItem).showtime : (item as MatchItem).kickoff_time;
  const detailUrl = `${SITE_URL}/${isFilm ? "jadwal-film" : "jadwal-bola"}/${item.id}`;

  await resend.emails.send({
    from: "JadwalNonton <onboarding@resend.dev>",
    to,
    subject: `Pengingat (${label}): ${title}`,
    html: `<p>Halo!</p><p>${isFilm ? "Film" : "Pertandingan"} <strong>${title}</strong> ${
      isFilm ? "tayang" : "berlangsung"
    } pada <strong>${formatDateTime(when)}</strong> — ${label} lagi.</p><p><a href="${detailUrl}">Lihat detail</a></p>`,
  });
}

async function processWindow(
  admin: ReturnType<typeof createAdminClient>,
  resend: Resend,
  itemType: "film" | "match",
  reminderField: "reminded_h1" | "reminded_1h",
  hoursAhead: number,
  label: string
) {
  const now = new Date();
  const cutoff = new Date(now.getTime() + hoursAhead * 3_600_000).toISOString();
  const nowIso = now.toISOString();

  const { data: watchlistRows } = await admin
    .from("watchlist")
    .select("id, user_id, item_id")
    .eq("item_type", itemType)
    .eq(reminderField, false);

  if (!watchlistRows?.length) return 0;

  const itemIds = Array.from(new Set((watchlistRows as WatchlistRow[]).map((w) => w.item_id)));
  const table = itemType === "film" ? "films" : "matches";
  const timeCol = itemType === "film" ? "showtime" : "kickoff_time";

  const { data: items } = await admin.from(table).select("*").in("id", itemIds).lte(timeCol, cutoff).gt(timeCol, nowIso);
  if (!items?.length) return 0;

  const itemMap = new Map((items as (FilmItem | MatchItem)[]).map((i) => [i.id, i]));
  const dueRows = (watchlistRows as WatchlistRow[]).filter((w) => itemMap.has(w.item_id));

  let sent = 0;
  for (const row of dueRows) {
    const item = itemMap.get(row.item_id)!;
    const { data: userData } = await admin.auth.admin.getUserById(row.user_id);
    const email = userData?.user?.email;

    if (email) {
      await sendReminderEmail(resend, email, itemType, item, label);
      sent += 1;
    }

    await admin.from("watchlist").update({ [reminderField]: true }).eq("id", row.id);
  }

  return sent;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const admin = createAdminClient();
  const resend = new Resend(process.env.RESEND_API_KEY!);

  const [h1Films, h1Matches, oneHourFilms, oneHourMatches] = await Promise.all([
    processWindow(admin, resend, "film", "reminded_h1", 24, "H-1"),
    processWindow(admin, resend, "match", "reminded_h1", 24, "H-1"),
    processWindow(admin, resend, "film", "reminded_1h", 1, "1 jam"),
    processWindow(admin, resend, "match", "reminded_1h", 1, "1 jam"),
  ]);

  return Response.json({ sent: { h1Films, h1Matches, oneHourFilms, oneHourMatches } });
}
