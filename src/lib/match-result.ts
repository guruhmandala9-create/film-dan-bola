export function isMatchFinished(match: { home_score: number | null; away_score: number | null }) {
  // Loose check on purpose: also treats `undefined` (e.g. columns not
  // yet migrated in the database) as "not finished", not just `null`.
  return match.home_score != null && match.away_score != null;
}

export function formatMatchResult(match: { home_score: number | null; away_score: number | null }) {
  return `${match.home_score} - ${match.away_score}`;
}
