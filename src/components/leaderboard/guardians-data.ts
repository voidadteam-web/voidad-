import { COUNTRIES } from "@/lib/countries";
import {
  LEADERBOARD_RANK_COUNT,
  levelForLeaderboardRank,
} from "@/lib/levels";
import { shieldTitleForLevel } from "@/lib/shield-ranks";

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
  nextLevelProgress?: number;
};

/** Rank #1 (highest level) first, descending */
export function getLeaderboardDisplayOrder(players: VoidGuardian[]): VoidGuardian[] {
  return [...players].sort((a, b) => a.rank - b.rank);
}

export { LEADERBOARD_RANK_COUNT, levelForLeaderboardRank };

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

const GUARDIAN_USERNAMES = [
  "Void_Reclaimer_01",
  "CyberSentinel_X",
  "NetGuardian_7",
  "PixelShield_99",
  "DarkNet_Warden",
  "CipherKnight_42",
  "VoidHunter_88",
  "TechScout_01",
  "GhostProtocol_17",
  "ZeroDay_Defender",
] as const;

function formatStat(value: number, suffix = ""): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M${suffix}`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K${suffix}`;
  return `${value}${suffix}`;
}

/** 57 leaderboard slots — scroll horizontally, levels descending */
export const VOID_GUARDIANS: VoidGuardian[] = Array.from(
  { length: LEADERBOARD_RANK_COUNT },
  (_, i) => {
    const rank = i + 1;
    const level = levelForLeaderboardRank(rank);
    const country = COUNTRIES[i % COUNTRIES.length]!;
    const ads = Math.max(50_000, 1_550_000 - rank * 25_000);
    const donated = Math.max(5_000, 305_000 - rank * 5_000);

    return {
      rank,
      title: shieldTitleForLevel(level).toUpperCase(),
      username:
        GUARDIAN_USERNAMES[i % GUARDIAN_USERNAMES.length] ??
        `Void_Guardian_${String(rank).padStart(2, "0")}`,
      level,
      countryCode: country.code,
      countryName: country.name,
      adsBlocked: formatStat(ads),
      donated: formatStat(donated),
      avatarUrl: AVATARS[i % AVATARS.length]!,
      nextLevelProgress: Math.max(35, 97 - rank * 2),
    };
  },
);

/** Top contributors for the full ranks page */
export const TOP_CONTRIBUTORS = VOID_GUARDIANS.slice(0, 8);
