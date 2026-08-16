import { normalizeTeamName } from "./team-names";

// Kode kompetisi football-data.org -> label liga yang kita pakai di app.
// Liga 1 Indonesia sengaja tidak ada di sini (tidak tersedia di sumber
// data ini), tetap diisi manual lewat panel admin.
export const COMPETITION_TO_LEAGUE: Record<string, string> = {
  PL: "English Premier League",
  PD: "La Liga",
  SA: "Serie A",
  BL1: "Bundesliga",
  FL1: "Ligue 1",
  CL: "Liga Champions",
};

type FdMatch = {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: { name: string; shortName?: string | null };
  awayTeam: { name: string; shortName?: string | null };
  score: { fullTime: { home: number | null; away: number | null } };
};

export type SyncedMatch = {
  external_id: string;
  league: string;
  home_team: string;
  away_team: string;
  kickoff_time: string;
  home_score: number | null;
  away_score: number | null;
};

export async function fetchCompetitionMatches(
  code: string,
  apiKey: string,
  dateFrom: string,
  dateTo: string
): Promise<SyncedMatch[]> {
  const url = `https://api.football-data.org/v4/competitions/${code}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;
  const res = await fetch(url, { headers: { "X-Auth-Token": apiKey } });

  if (!res.ok) {
    console.error(`football-data.org ${code} failed: HTTP ${res.status}`);
    return [];
  }

  const data = await res.json();
  const matches: FdMatch[] = data.matches ?? [];
  const league = COMPETITION_TO_LEAGUE[code] ?? code;

  return matches.map((m) => ({
    external_id: `fd-${m.id}`,
    league,
    home_team: normalizeTeamName(m.homeTeam.name, m.homeTeam.shortName),
    away_team: normalizeTeamName(m.awayTeam.name, m.awayTeam.shortName),
    kickoff_time: m.utcDate,
    home_score: m.status === "FINISHED" ? m.score.fullTime.home : null,
    away_score: m.status === "FINISHED" ? m.score.fullTime.away : null,
  }));
}
