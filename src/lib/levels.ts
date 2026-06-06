export const MAX_PLAYER_LEVEL = 57;

export const LEADERBOARD_RANK_COUNT = MAX_PLAYER_LEVEL;

/** Quadratic curve — level 1 starts at 10,000 VoidPoints (large gap between levels) */
export const VOIDPOINTS_PER_LEVEL_UNIT = 10_000;

/** 1,000 VoidPoints = €0.001 (0.10 cent) */
export const VOIDPOINTS_EUR_PER_1000 = 0.001;

/** 1,000 VoidPoints = 0.10 cent */
export const VOIDPOINTS_CENT_PER_1000 = 0.1;

/** Leaderboard position #1 → highest level (57) */
export function levelForLeaderboardRank(rank: number): number {
  return Math.max(1, MAX_PLAYER_LEVEL - rank + 1);
}

export function voidpointsForLevel(level: number): number {
  if (level <= 0) return 0;
  return level * level * VOIDPOINTS_PER_LEVEL_UNIT;
}

/** Derive player level from total VoidPoints earned */
export function levelForVoidpoints(voidpoints: number): number {
  if (voidpoints < VOIDPOINTS_PER_LEVEL_UNIT) return 0;
  return Math.min(
    MAX_PLAYER_LEVEL,
    Math.floor(Math.sqrt(voidpoints / VOIDPOINTS_PER_LEVEL_UNIT)),
  );
}

/** Monetary value of VoidPoints in euros (0.10 cent per 1,000 VP) */
export function voidpointsToEuro(voidpoints: number): number {
  return (voidpoints / 1000) * VOIDPOINTS_EUR_PER_1000;
}

/** Monetary value of VoidPoints in cents (0.10 cent per 1,000 VP) */
export function voidpointsToCents(voidpoints: number): number {
  return (voidpoints / 1000) * VOIDPOINTS_CENT_PER_1000;
}

/** Progress toward the next level (0–100) */
export function nextLevelProgress(voidpoints: number, level: number): number {
  if (level >= MAX_PLAYER_LEVEL) return 100;
  const current = voidpointsForLevel(level);
  const next = voidpointsForLevel(level + 1);
  if (next <= current) return 100;
  const pct = ((voidpoints - current) / (next - current)) * 100;
  return Math.min(100, Math.max(0, Math.round(pct)));
}

/** VoidPoints required to cross from `level` to `level + 1` */
export function voidpointsNeededForNextLevel(level: number): number {
  if (level >= MAX_PLAYER_LEVEL) return 0;
  return voidpointsForLevel(level + 1) - voidpointsForLevel(level);
}

/** VoidPoints earned inside the current level band */
export function voidpointsEarnedInLevelBand(voidpoints: number, level: number): number {
  return Math.max(0, voidpoints - voidpointsForLevel(level));
}

/** Minimum player level to unlock carbon tree stage N (1–10) */
export function playerLevelForCarbonTree(treeLevel: number): number {
  if (treeLevel <= 1) return 1;
  return Math.min(MAX_PLAYER_LEVEL, treeLevel);
}

/** VoidPoints required to unlock carbon tree stage N */
export function voidpointsForCarbonTree(treeLevel: number): number {
  return voidpointsForLevel(playerLevelForCarbonTree(treeLevel));
}
