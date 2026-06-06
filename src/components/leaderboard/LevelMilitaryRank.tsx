import Image from "next/image";
import { rankForLevel, rankImageForLevel } from "@/lib/military-ranks";
import { cn } from "@/lib/utils";

type LevelMilitaryRankProps = {
  level: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const HEIGHT = { sm: 36, md: 44, lg: 52 } as const;
const ASPECT = 75 / 106;

/** Military insignia auto-selected by level (1–57) */
export function LevelMilitaryRank({
  level,
  size = "md",
  className,
}: LevelMilitaryRankProps) {
  const rank = rankForLevel(level);
  const h = HEIGHT[size];
  const w = Math.round(h * ASPECT);

  return (
    <span className={cn("inline-flex shrink-0 items-center overflow-visible", className)}>
      <Image
        src={rankImageForLevel(level)}
        alt={rank.name}
        width={w}
        height={h}
        unoptimized
        className="block max-h-none max-w-none object-contain object-center"
        style={{ width: w, height: h }}
      />
    </span>
  );
}

export { levelBadgeTitle } from "@/lib/military-ranks";
