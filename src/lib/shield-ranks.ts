import { MAX_MILITARY_LEVEL } from "@/lib/military-ranks";

export type ShieldTier = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const SHIELD_TIER_COUNT = 8;

/** Leaderboard shows one card per shield tier, highest first */
export const SHIELD_LEADERBOARD_COUNT = SHIELD_TIER_COUNT;

export const SHIELD_TIER_NAMES: Record<ShieldTier, string> = {
  0: "Void Initiate",
  1: "Network Scout",
  2: "Cipher Guard",
  3: "Drake Sentinel",
  4: "Cyber Warden",
  5: "Void Knight",
  6: "Dragon Commander",
  7: "Grand Guardian",
};

/** Map level 1–57 → shield tier 0–7 (higher level = higher tier) */
export function shieldTierForLevel(level: number): ShieldTier {
  if (level <= 0) return 0;
  const clamped = Math.min(MAX_MILITARY_LEVEL, Math.max(1, level));
  const tier = Math.floor(((clamped - 1) / (MAX_MILITARY_LEVEL - 1)) * (SHIELD_TIER_COUNT - 1));
  return Math.min(7, Math.max(0, tier)) as ShieldTier;
}

/** Leaderboard rank #1 → tier 7 (Grand Guardian), #8 → tier 0 — descending */
export function shieldTierForRank(rank: number): ShieldTier {
  const r = Math.min(SHIELD_LEADERBOARD_COUNT, Math.max(1, rank));
  return (SHIELD_TIER_COUNT - r) as ShieldTier;
}

/** Descending levels for shield leaderboard (#1 highest) */
const SHIELD_RANK_LEVELS = [110, 105, 101, 98, 95, 92, 89, 86] as const;

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
