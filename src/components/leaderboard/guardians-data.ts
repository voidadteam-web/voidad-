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
  featured?: boolean;
};

/** Podium layout — rank #1 centered, others by rank descending outward */
export function getLeaderboardDisplayOrder(players: VoidGuardian[]): VoidGuardian[] {
  const sorted = [...players].sort((a, b) => a.rank - b.rank);
  if (sorted.length <= 1) return sorted;

  const byRank = new Map(sorted.map((p) => [p.rank, p]));
  const center = byRank.get(1);
  const rest = sorted.filter((p) => p.rank !== 1);

  const left: VoidGuardian[] = [];
  const right: VoidGuardian[] = [];
  rest.forEach((p, i) => {
    if (i % 2 === 0) left.push(p);
    else right.push(p);
  });

  left.sort((a, b) => b.rank - a.rank);
  right.sort((a, b) => a.rank - b.rank);

  return [...left, ...(center ? [center] : []), ...right];
}

export const VOID_GUARDIANS: VoidGuardian[] = [
  {
    rank: 1,
    title: "GRAND GUARDIAN",
    username: "Void_Reclaimer_01",
    level: 110,
    countryCode: "DE",
    countryName: "Germany",
    adsBlocked: "1.5M",
    donated: "300,000",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    featured: true,
  },
  {
    rank: 2,
    title: "CYBER SENTRY",
    username: "Cyber_Sentry",
    level: 105,
    countryCode: "JP",
    countryName: "Japan",
    adsBlocked: "1.2M",
    donated: "250,000",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
  },
  {
    rank: 3,
    title: "TECH SENTINEL",
    username: "Tech_Sentinel",
    level: 101,
    countryCode: "US",
    countryName: "USA",
    adsBlocked: "1.1M",
    donated: "210,000",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    rank: 4,
    title: "DIGITAL GUARDIAN",
    username: "Digital_Guardian",
    level: 98,
    countryCode: "GB",
    countryName: "United Kingdom",
    adsBlocked: "980K",
    donated: "180,000",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
  {
    rank: 5,
    title: "NET SHIELD",
    username: "Net_Shield_AE",
    level: 95,
    countryCode: "AE",
    countryName: "UAE",
    adsBlocked: "870K",
    donated: "150,000",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    rank: 6,
    title: "VOID WARDEN",
    username: "Void_Warden_FR",
    level: 92,
    countryCode: "FR",
    countryName: "France",
    adsBlocked: "820K",
    donated: "140,000",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  },
  {
    rank: 7,
    title: "PIXEL SENTINEL",
    username: "Pixel_Sentinel_BR",
    level: 88,
    countryCode: "BR",
    countryName: "Brazil",
    adsBlocked: "760K",
    donated: "120,000",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
  },
];
