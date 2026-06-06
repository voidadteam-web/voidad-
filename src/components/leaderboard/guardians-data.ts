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

/** Linear order: rank #1 → #2 → #3 … left to right */
export function getLeaderboardDisplayOrder(players: VoidGuardian[]): VoidGuardian[] {
  return [...players].sort((a, b) => a.rank - b.rank);
}

/** Top rank starts at 110, each next rank −1 */
export function levelForRank(rank: number, topLevel = 110): number {
  return topLevel - (rank - 1);
}

const GUARDIAN_TITLES = [
  "GRAND GUARDIAN",
  "CYBER SENTRY",
  "TECH SENTINEL",
  "DIGITAL GUARDIAN",
  "NET SHIELD",
  "VOID WARDEN",
  "PIXEL SENTINEL",
] as const;

const GUARDIAN_PROFILES = [
  {
    username: "Void_Reclaimer_01",
    countryCode: "DE",
    countryName: "Germany",
    adsBlocked: "1.5M",
    donated: "300,000",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
  },
  {
    username: "Cyber_Sentry",
    countryCode: "JP",
    countryName: "Japan",
    adsBlocked: "1.2M",
    donated: "250,000",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
  },
  {
    username: "Tech_Sentinel",
    countryCode: "US",
    countryName: "USA",
    adsBlocked: "1.1M",
    donated: "210,000",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    username: "Digital_Guardian",
    countryCode: "GB",
    countryName: "United Kingdom",
    adsBlocked: "980K",
    donated: "180,000",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
  {
    username: "Net_Shield_AE",
    countryCode: "AE",
    countryName: "UAE",
    adsBlocked: "870K",
    donated: "150,000",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    username: "Void_Warden_FR",
    countryCode: "FR",
    countryName: "France",
    adsBlocked: "820K",
    donated: "140,000",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  },
  {
    username: "Pixel_Sentinel_BR",
    countryCode: "BR",
    countryName: "Brazil",
    adsBlocked: "760K",
    donated: "120,000",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
  },
] as const;

export const VOID_GUARDIANS: VoidGuardian[] = GUARDIAN_PROFILES.map((profile, index) => {
  const rank = index + 1;
  return {
    rank,
    title: GUARDIAN_TITLES[index] ?? `GUARDIAN ${rank}`,
    level: levelForRank(rank),
    ...profile,
  };
});
