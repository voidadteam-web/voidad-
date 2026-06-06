import Image from "next/image";
import { shieldImageForLevel, shieldTierForLevel } from "@/lib/level-shields";
import { cn } from "@/lib/utils";

type LevelDragonShieldProps = {
  level: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const HEIGHT = { sm: 40, md: 48, lg: 64 } as const;

/** Rank shield image auto-selected by level (8 tiers) */
export function LevelDragonShield({
  level,
  size = "md",
  className,
}: LevelDragonShieldProps) {
  const tier = shieldTierForLevel(level);
  const h = HEIGHT[size];

  return (
    <Image
      src={shieldImageForLevel(level)}
      alt={tier.name}
      width={h}
      height={h}
      unoptimized
      className={cn(
        "block w-auto max-w-none shrink-0 object-contain object-left leading-[0]",
        className,
      )}
      style={{ height: h }}
    />
  );
}

export { levelBadgeTitle } from "@/lib/level-shields";
