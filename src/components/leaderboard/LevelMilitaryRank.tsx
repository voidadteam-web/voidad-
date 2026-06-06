import { VoidRankShield } from "@/components/leaderboard/shields/VoidRankShield";
import { shieldTierForLevel } from "@/lib/shield-ranks";
import { cn } from "@/lib/utils";

type LevelMilitaryRankProps = {
  level: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const HEIGHT = { sm: 42, md: 52, lg: 64 } as const;

/** Cyber shield badge — selected by player level */
export function LevelMilitaryRank({
  level,
  size = "md",
  className,
}: LevelMilitaryRankProps) {
  const tier = shieldTierForLevel(level);
  const h = HEIGHT[size];

  return (
    <span className={cn("inline-flex shrink-0 items-center overflow-visible", className)}>
      <VoidRankShield tier={tier} size={h} />
    </span>
  );
}

export { shieldTitleForLevel as levelBadgeTitle } from "@/lib/shield-ranks";
export { shieldTitleForLevel } from "@/lib/shield-ranks";
