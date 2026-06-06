export type CommunityContributor = {
  rank: number;
  displayName: string;
  username: string;
  level: number;
  countryCode: string;
  avatarUrl: string;
  nextLevelProgress: number;
};

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

/** Mock contributors — includes multiple users at the same level */
const RAW: Omit<CommunityContributor, "rank">[] = [
  {
    displayName: "Klaus M.",
    username: "voidman_klaus",
    level: 57,
    countryCode: "DE",
    avatarUrl: AVATARS[0]!,
    nextLevelProgress: 95,
  },
  {
    displayName: "Anna S.",
    username: "cyber_anna_de",
    level: 57,
    countryCode: "AT",
    avatarUrl: AVATARS[1]!,
    nextLevelProgress: 92,
  },
  {
    displayName: "James R.",
    username: "net_shield_us",
    level: 55,
    countryCode: "US",
    avatarUrl: AVATARS[2]!,
    nextLevelProgress: 88,
  },
  {
    displayName: "Yuki T.",
    username: "void_sentry_jp",
    level: 55,
    countryCode: "JP",
    avatarUrl: AVATARS[3]!,
    nextLevelProgress: 85,
  },
  {
    displayName: "Sophie L.",
    username: "pixel_guard_fr",
    level: 52,
    countryCode: "FR",
    avatarUrl: AVATARS[4]!,
    nextLevelProgress: 79,
  },
  {
    displayName: "Marco B.",
    username: "cipher_knight_it",
    level: 50,
    countryCode: "IT",
    avatarUrl: AVATARS[5]!,
    nextLevelProgress: 74,
  },
  {
    displayName: "Erik N.",
    username: "nord_void_se",
    level: 50,
    countryCode: "SE",
    avatarUrl: AVATARS[6]!,
    nextLevelProgress: 71,
  },
  {
    displayName: "Liam O.",
    username: "tech_scout_ie",
    level: 48,
    countryCode: "IE",
    avatarUrl: AVATARS[7]!,
    nextLevelProgress: 68,
  },
  {
    displayName: "Hans W.",
    username: "void_hunter_ch",
    level: 48,
    countryCode: "CH",
    avatarUrl: AVATARS[0]!,
    nextLevelProgress: 65,
  },
  {
    displayName: "Olivia K.",
    username: "darknet_warden_gb",
    level: 45,
    countryCode: "GB",
    avatarUrl: AVATARS[1]!,
    nextLevelProgress: 61,
  },
];

/** Sorted by level desc, then username — rank assigned by position */
export const COMMUNITY_CONTRIBUTORS: CommunityContributor[] = [...RAW]
  .sort((a, b) => b.level - a.level || a.username.localeCompare(b.username))
  .map((c, i) => ({ ...c, rank: i + 1 }));

/** Group consecutive contributors by level (all same-level users shown together) */
export function groupContributorsByLevel(
  contributors: CommunityContributor[],
): { level: number; members: CommunityContributor[] }[] {
  const groups: { level: number; members: CommunityContributor[] }[] = [];
  for (const c of contributors) {
    const last = groups[groups.length - 1];
    if (last && last.level === c.level) {
      last.members.push(c);
    } else {
      groups.push({ level: c.level, members: [c] });
    }
  }
  return groups;
}

/** Top 3 for sidebar progress bars */
export const TOP_CONTRIBUTORS_FOR_PROGRESS = COMMUNITY_CONTRIBUTORS.slice(0, 3);
