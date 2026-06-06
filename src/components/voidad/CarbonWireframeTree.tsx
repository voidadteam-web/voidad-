import Image from "next/image";
import {
  carbonTreeImageForLevel,
  carbonTreeNameForLevel,
  clampCarbonTreeLevel,
} from "@/lib/carbon-trees";
import { cn } from "@/lib/utils";

type CarbonWireframeTreeProps = {
  /** 1–10 — tree evolution stage */
  level?: number;
  className?: string;
  showLabel?: boolean;
  showMap?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
};

const HEIGHT = { sm: 140, md: 220, lg: 320 } as const;

/** Carbon tree evolution — neon bloom glow, roots absorb from world map */
export function CarbonWireframeTree({
  level = 5,
  className,
  showLabel = true,
  showMap = true,
  size = "md",
  animated = true,
}: CarbonWireframeTreeProps) {
  const treeLevel = clampCarbonTreeLevel(level);
  const h = HEIGHT[size];
  const src = carbonTreeImageForLevel(treeLevel);
  const name = carbonTreeNameForLevel(treeLevel);

  return (
    <div className={cn("relative mx-auto w-full", className)}>
      {showMap && (
        <div
          className="void-tree-map-feed pointer-events-none absolute inset-x-[6%] bottom-[0%] z-0 h-[32%]"
          aria-hidden
        >
          <Image
            src="/world-map-net.png"
            alt=""
            fill
            className="object-contain object-bottom void-hero-map"
            unoptimized
          />
        </div>
      )}

      <div
        className="relative z-10 mx-auto flex items-end justify-center"
        style={{ minHeight: h }}
      >
        {animated && (
          <div
            className="void-tree-root-aura pointer-events-none absolute inset-x-[10%] bottom-0 top-[35%]"
            aria-hidden
          />
        )}
        <Image
          src={src}
          alt=""
          width={Math.round(h * 0.85)}
          height={h}
          unoptimized
          className={cn(
            "relative z-10 max-h-full w-auto object-contain object-bottom",
            animated && "void-tree-glow-art",
            !animated && "drop-shadow-[0_0_24px_rgba(0,255,153,0.45)]",
          )}
          style={{ height: h, width: "auto" }}
          priority={size === "lg"}
        />
      </div>

      {showLabel && (
        <p className="void-display relative z-10 mt-2 text-center text-[10px] tracking-[0.18em] text-void-green void-glow-text sm:text-xs">
          LEVEL {treeLevel} — {name.toUpperCase()}
        </p>
      )}
    </div>
  );
}
