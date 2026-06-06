import Image from "next/image";
import { CarbonTreeEnergyFlow } from "@/components/voidad/CarbonTreeEnergyFlow";
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
  showEnergyFlow?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
};

const HEIGHT = { sm: 140, md: 220, lg: 320 } as const;

/** Carbon tree — soft glow, roots on map, energy particles feed upward */
export function CarbonWireframeTree({
  level = 5,
  className,
  showLabel = true,
  showMap = true,
  showEnergyFlow = true,
  size = "md",
  animated = true,
}: CarbonWireframeTreeProps) {
  const treeLevel = clampCarbonTreeLevel(level);
  const h = HEIGHT[size];
  const src = carbonTreeImageForLevel(treeLevel);
  const name = carbonTreeNameForLevel(treeLevel);
  const flowIntensity = size === "lg" ? "lg" : size === "sm" ? "sm" : "md";

  return (
    <div className={cn("relative mx-auto w-full", className)}>
      <div
        className="relative mx-auto"
        style={{ minHeight: h }}
      >
        {showMap && (
          <div
            className="void-tree-map-feed void-tree-map-ground pointer-events-none absolute inset-x-[4%] bottom-0 z-[1] h-[34%]"
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

        {showEnergyFlow && animated && (
          <CarbonTreeEnergyFlow intensity={flowIntensity} />
        )}

        {animated && (
          <div
            className="void-tree-root-aura pointer-events-none absolute inset-x-[12%] bottom-[8%] z-[4] h-[28%]"
            aria-hidden
          />
        )}

        <div className="relative z-10 flex items-end justify-center" style={{ minHeight: h }}>
          <Image
            src={src}
            alt=""
            width={Math.round(h * 0.85)}
            height={h}
            unoptimized
            className={cn(
              "relative z-10 max-h-full w-auto object-contain object-bottom",
              animated && "void-tree-glow-art",
              !animated && "drop-shadow-[0_0_10px_rgba(0,255,153,0.2)]",
            )}
            style={{ height: h, width: "auto" }}
            priority={size === "lg"}
          />
        </div>
      </div>

      {showLabel && (
        <p className="void-display relative z-10 mt-2 text-center text-[10px] tracking-[0.18em] text-void-green/85 sm:text-xs">
          LEVEL {treeLevel} — {name.toUpperCase()}
        </p>
      )}
    </div>
  );
}
