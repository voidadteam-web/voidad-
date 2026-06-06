export const MAX_MILITARY_LEVEL = 57;

export type MilitaryRank = {
  index: number;
  level: number;
  grade: string;
  metal: "Bronze" | "Silver" | "Gold";
  name: string;
  image: string;
};

const GRADES = [
  "Private",
  "Private First Class",
  "Lance Corporal",
  "Corporal",
  "Specialist",
  "Sergeant",
  "Staff Sergeant",
  "Senior Sergeant",
  "Sergeant First Class",
  "Sergeant Major",
  "Second Lieutenant",
  "First Lieutenant",
  "Major",
  "Lieutenant Colonel",
  "Colonel",
  "Brigadier General",
  "Major General",
  "Lieutenant General",
  "General",
] as const;

const METALS = ["Bronze", "Silver", "Gold"] as const;

function buildMilitaryRanks(): MilitaryRank[] {
  const ranks: MilitaryRank[] = [];
  let index = 1;
  for (const grade of GRADES) {
    for (const metal of METALS) {
      ranks.push({
        index,
        level: index,
        grade,
        metal,
        name: `${grade} (${metal})`,
        image: `/ranks/rank-${index}.png`,
      });
      index++;
    }
  }
  return ranks;
}

export const MILITARY_RANKS = buildMilitaryRanks();

/** Level 1 = lowest rank, level 57 = General (Gold) */
export function rankForLevel(level: number): MilitaryRank {
  if (level <= 0) return MILITARY_RANKS[0]!;
  const idx = Math.min(MAX_MILITARY_LEVEL, Math.max(1, level)) - 1;
  return MILITARY_RANKS[idx] ?? MILITARY_RANKS[0]!;
}

export function rankImageForLevel(level: number): string {
  return rankForLevel(level).image;
}

export function levelBadgeTitle(level: number): string {
  return rankForLevel(level).name;
}

/** Leaderboard: rank #1 → highest level (57) */
export function levelForLeaderboardRank(rank: number): number {
  return Math.max(1, MAX_MILITARY_LEVEL - rank + 1);
}

export const LEADERBOARD_RANK_COUNT = MAX_MILITARY_LEVEL;
