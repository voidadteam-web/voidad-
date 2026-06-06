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
};

const HEIGHT = { sm: 140, md: 220, lg: 320 } as const;

/** Carbon tree evolution art — wireframe PNG series, roots on world map */
export function CarbonWireframeTree({
  level = 5,
  className,
  showLabel = true,
  showMap = true,
  size = "md",
}: CarbonWireframeTreeProps) {
  const treeLevel = clampCarbonTreeLevel(level);
  const h = HEIGHT[size];
  const src = carbonTreeImageForLevel(treeLevel);
  const name = carbonTreeNameForLevel(treeLevel);

  return (
    <div className={cn("relative mx-auto w-full", className)}>
      {showMap && (
        <div
          className="pointer-events-none absolute inset-x-[8%] bottom-[2%] z-0 h-[28%] opacity-30"
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
        <Image
          src={src}
          alt=""
          width={Math.round(h * 0.85)}
          height={h}
          unoptimized
          className="max-h-full w-auto object-contain object-bottom drop-shadow-[0_0_20px_rgba(0,255,153,0.35)]"
          style={{ height: h, width: "auto" }}
          priority={size === "lg"}
        />
      </div>

      {showLabel && (
        <p className="void-display relative z-10 mt-2 text-center text-[10px] tracking-[0.18em] text-void-green/90 sm:text-xs">
          LEVEL {treeLevel} — {name.toUpperCase()}
        </p>
      )}
    </div>
  );
}
