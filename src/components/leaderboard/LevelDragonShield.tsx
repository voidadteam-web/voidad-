import Image from "next/image";
import { shieldImageForLevel, shieldTierForLevel } from "@/lib/level-shields";
import { cn } from "@/lib/utils";

type LevelDragonShieldProps = {
  level: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const HEIGHT = { sm: 44, md: 52, lg: 68 } as const;
/** Source cells are 256×288 */
const SHIELD_ASPECT = 256 / 288;

/** Rank shield image auto-selected by level (8 tiers) */
export function LevelDragonShield({
  level,
  size = "md",
  className,
}: LevelDragonShieldProps) {
  const tier = shieldTierForLevel(level);
  const h = HEIGHT[size];
  const w = Math.round(h * SHIELD_ASPECT);

  return (
    <span className={cn("inline-flex shrink-0 items-center overflow-visible", className)}>
      <Image
        src={shieldImageForLevel(level)}
        alt={tier.name}
        width={w}
        height={h}
        unoptimized
        className="block max-h-none max-w-none object-contain object-center"
        style={{ width: w, height: h }}
      />
    </span>
  );
}

export { levelBadgeTitle } from "@/lib/level-shields";
