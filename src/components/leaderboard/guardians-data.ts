import { COUNTRIES } from "@/lib/countries";
import {
  levelForShieldRank,
  SHIELD_LEADERBOARD_COUNT,
  shieldTitleForRank,
} from "@/lib/shield-ranks";

export type VoidGuardian = {
  rank: number;
  title: string;
  username: string;
  level: number;
  countryCode: string;
  countryName: string;
  adsBlocked: string;
  donated: string;
  avatarUrl: string;
};

/** Rank #1 (Grand Guardian) first, descending to #8 (Void Initiate) */
export function getLeaderboardDisplayOrder(players: VoidGuardian[]): VoidGuardian[] {
  return [...players].sort((a, b) => a.rank - b.rank);
}

export { SHIELD_LEADERBOARD_COUNT as LEADERBOARD_RANK_COUNT, levelForShieldRank as levelForLeaderboardRank };

const AVATARS = [
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
];

const GUARDIAN_PROFILES = [
  { username: "Void_Reclaimer_01", countryCode: "US" },
  { username: "CyberSentinel_X", countryCode: "DE" },
  { username: "NetGuardian_7", countryCode: "GB" },
  { username: "PixelShield_99", countryCode: "FR" },
  { username: "DarkNet_Warden", countryCode: "JP" },
  { username: "CipherKnight_42", countryCode: "CA" },
  { username: "VoidHunter_88", countryCode: "AU" },
  { username: "TechScout_01", countryCode: "SE" },
] as const;

function formatStat(value: number, suffix = ""): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M${suffix}`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K${suffix}`;
  return `${value}${suffix}`;
}

function countryNameFor(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.name ?? code;
}

/** 8 shield tiers — rank #1 Grand Guardian → #8 Void Initiate, levels descending */
export const VOID_GUARDIANS: VoidGuardian[] = Array.from(
  { length: SHIELD_LEADERBOARD_COUNT },
  (_, i) => {
    const rank = i + 1;
    const level = levelForShieldRank(rank);
    const profile = GUARDIAN_PROFILES[i]!;
    const ads = Math.max(50_000, 1_550_000 - rank * 180_000);
    const donated = Math.max(5_000, 305_000 - rank * 35_000);

    return {
      rank,
      title: shieldTitleForRank(rank).toUpperCase(),
      username: profile.username,
      level,
      countryCode: profile.countryCode,
      countryName: countryNameFor(profile.countryCode),
      adsBlocked: formatStat(ads),
      donated: formatStat(donated),
      avatarUrl: AVATARS[i]!,
    };
  },
);
