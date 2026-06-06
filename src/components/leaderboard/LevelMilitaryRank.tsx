import { VoidRankShield } from "@/components/leaderboard/shields/VoidRankShield";
import { shieldTierForLevel, shieldTierForRank } from "@/lib/shield-ranks";
import { cn } from "@/lib/utils";

type LevelMilitaryRankProps = {
  level: number;
  /** When set, shield follows leaderboard rank (#1 = Grand Guardian) */
  rank?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const HEIGHT = { sm: 42, md: 52, lg: 64 } as const;

/** Cyber shield badge — by rank (leaderboard) or level (profile) */
export function LevelMilitaryRank({
  level,
  rank,
  size = "md",
  className,
}: LevelMilitaryRankProps) {
  const tier = rank != null ? shieldTierForRank(rank) : shieldTierForLevel(level);
  const h = HEIGHT[size];

  return (
    <span className={cn("inline-flex shrink-0 items-center overflow-visible", className)}>
      <VoidRankShield tier={tier} size={h} />
    </span>
  );
}

export { levelBadgeTitle } from "@/lib/military-ranks";
export { shieldTitleForLevel } from "@/lib/shield-ranks";
