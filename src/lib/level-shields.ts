/** Eight rank shields — one image per tier (split from rank grid) */
export type ShieldTier = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ShieldTierMeta = {
  tier: ShieldTier;
  name: string;
  image: string;
  minLevel: number;
};

export const SHIELD_TIERS: ShieldTierMeta[] = [
  { tier: 0, name: "Bronze Guardian", image: "/shields/tier-0.png", minLevel: 0 },
  { tier: 1, name: "Silver Sentinel", image: "/shields/tier-1.png", minLevel: 14 },
  { tier: 2, name: "Gold Warden", image: "/shields/tier-2.png", minLevel: 28 },
  { tier: 3, name: "Crystal Dragon", image: "/shields/tier-3.png", minLevel: 42 },
  { tier: 4, name: "Emerald Drake", image: "/shields/tier-4.png", minLevel: 56 },
  { tier: 5, name: "Master Guardian", image: "/shields/tier-5.png", minLevel: 70 },
  { tier: 6, name: "Grandmaster Dragon", image: "/shields/tier-6.png", minLevel: 84 },
  { tier: 7, name: "Legend Dragon", image: "/shields/tier-7.png", minLevel: 98 },
];

/** Map any level to one of the 8 shields (every ~14 levels) */
export function tierIndexForLevel(level: number): ShieldTier {
  if (level <= 0) return 0;
  return Math.min(7, Math.floor(level / 14)) as ShieldTier;
}

export function shieldTierForLevel(level: number): ShieldTierMeta {
  return SHIELD_TIERS[tierIndexForLevel(level)] ?? SHIELD_TIERS[0]!;
}

export function levelBadgeTitle(level: number): string {
  return shieldTierForLevel(level).name;
}

export function shieldImageForLevel(level: number): string {
  return shieldTierForLevel(level).image;
}

/** @deprecated use shieldImageForLevel */
export function usesGrandGuardianAsset(_level: number): boolean {
  return false;
}

export function shieldVariantIndex(_level: number): number {
  return 0;
}

export { SHIELD_TIERS as TIERS };
