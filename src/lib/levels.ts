export const MAX_PLAYER_LEVEL = 57;

export const LEADERBOARD_RANK_COUNT = MAX_PLAYER_LEVEL;

/** Leaderboard position #1 → highest level (57) */
export function levelForLeaderboardRank(rank: number): number {
  return Math.max(1, MAX_PLAYER_LEVEL - rank + 1);
}
