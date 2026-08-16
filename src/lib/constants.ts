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

export const LEAGUES = [
  "Liga 1",
  "Liga Champions",
  "English Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
] as const;

export const TEAMS_BY_LEAGUE: Record<(typeof LEAGUES)[number], string[]> = {
  "Liga 1": ["Persija Jakarta", "Persib Bandung", "Bali United", "PSM Makassar"],
  "Liga Champions": ["Real Madrid", "Barcelona", "Bayern Munich", "Paris Saint-Germain"],
  "English Premier League": ["Manchester United", "Liverpool", "Arsenal", "Manchester City", "Chelsea"],
  "La Liga": ["Real Madrid", "Barcelona", "Atletico Madrid", "Sevilla"],
  "Serie A": ["Juventus", "AC Milan", "Inter Milan", "Napoli"],
  "Bundesliga": ["Bayern Munich", "Borussia Dortmund", "RB Leipzig", "Bayer Leverkusen"],
  "Ligue 1": ["Paris Saint-Germain", "Marseille", "Monaco", "Lyon"],
};

export const ALL_TEAMS = Array.from(new Set(Object.values(TEAMS_BY_LEAGUE).flat()));
