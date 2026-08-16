import { createClient } from "@/lib/supabase/server";

export async function getWatchlistItems(userId: string) {
  const supabase = await createClient();
  const { data: watchlist } = await supabase
    .from("watchlist")
    .select("item_type, item_id")
    .eq("user_id", userId);

  const filmIds = watchlist?.filter((w) => w.item_type === "film").map((w) => w.item_id) ?? [];
  const matchIds = watchlist?.filter((w) => w.item_type === "match").map((w) => w.item_id) ?? [];

  const [filmsResult, matchesResult] = await Promise.all([
    filmIds.length
      ? supabase.from("films").select("*").in("id", filmIds).order("showtime", { ascending: true })
      : Promise.resolve({ data: [] as Array<Record<string, unknown>> }),
    matchIds.length
      ? supabase.from("matches").select("*").in("id", matchIds).order("kickoff_time", { ascending: true })
      : Promise.resolve({ data: [] as Array<Record<string, unknown>> }),
  ]);

  return {
    films: (filmsResult.data ?? []) as Array<{
      id: string;
      title: string;
      genre: string[];
      city: string;
      cinema_name: string;
      showtime: string;
    }>,
    matches: (matchesResult.data ?? []) as Array<{
      id: string;
      league: string;
      home_team: string;
      away_team: string;
      kickoff_time: string;
      broadcast_channel: string | null;
      home_score: number | null;
      away_score: number | null;
    }>,
  };
}
