export const CITIES = ["Jakarta", "Bandung"] as const;

export const GENRES = [
  "Action",
  "Drama",
  "Komedi",
  "Horor",
  "Animasi",
  "Thriller",
  "Romantis",
  "Fantasi",
] as const;

export const LEAGUES = ["Liga 1", "English Premier League", "Liga Champions"] as const;

export const TEAMS_BY_LEAGUE: Record<(typeof LEAGUES)[number], string[]> = {
  "Liga 1": ["Persija Jakarta", "Persib Bandung", "Bali United", "PSM Makassar"],
  "English Premier League": ["Manchester United", "Liverpool", "Arsenal", "Manchester City", "Chelsea"],
  "Liga Champions": ["Real Madrid", "Barcelona", "Bayern Munich", "Paris Saint-Germain"],
};

export const ALL_TEAMS = Object.values(TEAMS_BY_LEAGUE).flat();
