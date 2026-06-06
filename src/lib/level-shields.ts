/** Dragon shield tier from player level (higher = more ornate badge) */
export type ShieldTier = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ShieldTierMeta = {
  tier: ShieldTier;
  name: string;
  accent: string;
  glow: string;
};

const TIERS: ShieldTierMeta[] = [
  { tier: 0, name: "Void Hatchling", accent: "#6b8f7a", glow: "rgba(107,143,122,0.35)" },
  { tier: 1, name: "Ember Whelp", accent: "#7dd3a8", glow: "rgba(125,211,168,0.4)" },
  { tier: 2, name: "Claw Guard", accent: "#5eead4", glow: "rgba(94,234,212,0.42)" },
  { tier: 3, name: "Scale Sentinel", accent: "#4ade80", glow: "rgba(74,222,128,0.45)" },
  { tier: 4, name: "Drake Warden", accent: "#34d399", glow: "rgba(52,211,153,0.48)" },
  { tier: 5, name: "Wyrm Knight", accent: "#2dd4a8", glow: "rgba(45,212,168,0.5)" },
  { tier: 6, name: "Ancient Dragon", accent: "#00ff99", glow: "rgba(0,255,153,0.55)" },
  { tier: 7, name: "Grand Guardian", accent: "#00ff99", glow: "rgba(0,255,153,0.65)" },
];

function tierIndexForLevel(level: number): ShieldTier {
  if (level >= 103) {
    return Math.min(7, level - 103) as ShieldTier;
  }
  if (level >= 80) {
    return Math.min(6, Math.floor((level - 80) / 4)) as ShieldTier;
  }
  if (level >= 40) {
    return Math.min(4, Math.floor((level - 40) / 10)) as ShieldTier;
  }
  if (level >= 1) {
    return Math.min(2, Math.floor(level / 14)) as ShieldTier;
  }
  return 0;
}

export function shieldTierForLevel(level: number): ShieldTierMeta {
  return TIERS[tierIndexForLevel(level)] ?? TIERS[0]!;
}

export function shieldVariantIndex(level: number): number {
  return level % 3;
}

/** Premium PNG for absolute top level only */
export function usesGrandGuardianAsset(level: number): boolean {
  return level >= 110;
}

export function levelBadgeTitle(level: number): string {
  return shieldTierForLevel(level).name;
}

export { TIERS };
