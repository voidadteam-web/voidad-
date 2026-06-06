import { MAX_MILITARY_LEVEL } from "@/lib/military-ranks";

export type ShieldTier = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const SHIELD_TIER_COUNT = 10;

export const SHIELD_LEADERBOARD_COUNT = SHIELD_TIER_COUNT;

export const SHIELD_TIER_NAMES: Record<ShieldTier, string> = {
  0: "Void Initiate",
  1: "Network Scout",
  2: "Cipher Guard",
  3: "Drake Sentinel",
  4: "Cyber Warden",
  5: "Void Knight",
  6: "Dragon Commander",
  7: "Elite Sentinel",
  8: "Grand Warden",
  9: "Void Guardian",
};

const MAX_TIER = (SHIELD_TIER_COUNT - 1) as ShieldTier;

/** Map level 1–57 → shield tier 0–9 (higher level = higher tier) */
export function shieldTierForLevel(level: number): ShieldTier {
  if (level <= 0) return 0;
  const clamped = Math.min(MAX_MILITARY_LEVEL, Math.max(1, level));
  const tier = Math.floor(((clamped - 1) / (MAX_MILITARY_LEVEL - 1)) * MAX_TIER);
  return Math.min(MAX_TIER, Math.max(0, tier)) as ShieldTier;
}

/** Leaderboard rank #1 → tier 9 (Void Guardian), #10 → tier 0 */
export function shieldTierForRank(rank: number): ShieldTier {
  const r = Math.min(SHIELD_LEADERBOARD_COUNT, Math.max(1, rank));
  return (SHIELD_TIER_COUNT - r) as ShieldTier;
}

const SHIELD_RANK_LEVELS = [110, 107, 104, 101, 98, 95, 92, 89, 86, 83] as const;

export function levelForShieldRank(rank: number): number {
  const idx = Math.min(SHIELD_LEADERBOARD_COUNT, Math.max(1, rank)) - 1;
  return SHIELD_RANK_LEVELS[idx] ?? SHIELD_RANK_LEVELS[SHIELD_RANK_LEVELS.length - 1]!;
}

export function shieldTitleForRank(rank: number): string {
  return SHIELD_TIER_NAMES[shieldTierForRank(rank)];
}

export function shieldTitleForLevel(level: number): string {
  return SHIELD_TIER_NAMES[shieldTierForLevel(level)];
}

export function shieldImageForTier(tier: ShieldTier): string {
  return `/shields/shield-tier-${tier}.png`;
}

export function shieldImageForLevel(level: number): string {
  return shieldImageForTier(shieldTierForLevel(level));
}
