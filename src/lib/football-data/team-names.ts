// Memetakan nama tim dari football-data.org ke nama yang sudah kita pakai
// di src/lib/constants.ts (ALL_TEAMS), supaya filter tim di Jadwal Bola
// tetap konsisten. Tim yang tidak ada di peta ini jatuh ke shortName API.
const TEAM_NAME_MAP: Record<string, string> = {
  "Manchester United FC": "Manchester United",
  "Man United": "Manchester United",
  "Liverpool FC": "Liverpool",
  "Arsenal FC": "Arsenal",
  "Manchester City FC": "Manchester City",
  "Man City": "Manchester City",
  "Chelsea FC": "Chelsea",
  "Real Madrid CF": "Real Madrid",
  "FC Barcelona": "Barcelona",
  "Club Atlético de Madrid": "Atletico Madrid",
  "Atletico de Madrid": "Atletico Madrid",
  "Sevilla FC": "Sevilla",
  "Juventus FC": "Juventus",
  "AC Milan": "AC Milan",
  "FC Internazionale Milano": "Inter Milan",
  "Inter": "Inter Milan",
  "SSC Napoli": "Napoli",
  "FC Bayern München": "Bayern Munich",
  "Bayern München": "Bayern Munich",
  "Borussia Dortmund": "Borussia Dortmund",
  "RB Leipzig": "RB Leipzig",
  "Bayer 04 Leverkusen": "Bayer Leverkusen",
  "Paris Saint-Germain FC": "Paris Saint-Germain",
  "PSG": "Paris Saint-Germain",
  "Olympique de Marseille": "Marseille",
  "AS Monaco FC": "Monaco",
  "Olympique Lyonnais": "Lyon",
};

export function normalizeTeamName(name: string, shortName?: string | null) {
  return TEAM_NAME_MAP[name] ?? (shortName ? TEAM_NAME_MAP[shortName] ?? shortName : name);
}
