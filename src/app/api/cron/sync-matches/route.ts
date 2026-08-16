import { createAdminClient } from "@/lib/supabase/admin";
import { fetchCompetitionMatches, COMPETITION_TO_LEAGUE } from "@/lib/football-data/client";

export const dynamic = "force-dynamic";

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "FOOTBALL_DATA_API_KEY belum diatur" }, { status: 500 });
  }

  const now = new Date();
  const dateFrom = isoDate(new Date(now.getTime() - 3 * 86_400_000));
  const dateTo = isoDate(new Date(now.getTime() + 21 * 86_400_000));

  const admin = createAdminClient();
  const codes = Object.keys(COMPETITION_TO_LEAGUE);

  let upserted = 0;
  let failed = 0;
  const perLeague: Record<string, number> = {};

  for (const code of codes) {
    const matches = await fetchCompetitionMatches(code, apiKey, dateFrom, dateTo);
    perLeague[COMPETITION_TO_LEAGUE[code]] = matches.length;

    for (const match of matches) {
      const { error } = await admin.from("matches").upsert(match, { onConflict: "external_id" });
      if (error) {
        console.error(`Upsert failed for ${match.external_id}: ${error.message}`);
        failed += 1;
      } else {
        upserted += 1;
      }
    }
  }

  return Response.json({ upserted, failed, perLeague, dateFrom, dateTo });
}
