import { GrandGuardianShield } from "@/components/leaderboard/GrandGuardianShield";
import { DragonShieldArt } from "@/components/leaderboard/DragonShieldArt";
import {
  shieldTierForLevel,
  shieldVariantIndex,
  usesGrandGuardianAsset,
} from "@/lib/level-shields";
import { cn } from "@/lib/utils";

type LevelDragonShieldProps = {
  level: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = { sm: 36, md: 44, lg: 56 } as const;

/** Auto-picks a professional dragon shield for any level */
export function LevelDragonShield({
  level,
  size = "md",
  className,
}: LevelDragonShieldProps) {
  if (usesGrandGuardianAsset(level)) {
    return (
      <GrandGuardianShield
        className={cn(size === "sm" && "h-10 sm:h-10", className)}
      />
    );
  }

  const tierMeta = shieldTierForLevel(level);
  const px = SIZES[size];

  return (
    <DragonShieldArt
      tier={tierMeta.tier}
      variant={shieldVariantIndex(level)}
      level={level}
      size={px}
      className={className}
    />
  );
}

export { levelBadgeTitle } from "@/lib/level-shields";
