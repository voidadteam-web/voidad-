"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/** Pixels along the disintegration trail — drift up-right in sync waves */
const TRAIL_PIXELS = [
  { x: 18, y: 52, s: 2, d: 0 },
  { x: 22, y: 48, s: 2.5, d: 0.12 },
  { x: 26, y: 44, s: 2, d: 0.24 },
  { x: 30, y: 40, s: 3, d: 0.08 },
  { x: 34, y: 36, s: 2, d: 0.36 },
  { x: 38, y: 32, s: 2.5, d: 0.18 },
  { x: 42, y: 28, s: 2, d: 0.48 },
  { x: 46, y: 24, s: 3, d: 0.3 },
  { x: 50, y: 20, s: 2, d: 0.6 },
  { x: 54, y: 18, s: 2, d: 0.42 },
  { x: 58, y: 16, s: 2.5, d: 0.72 },
  { x: 62, y: 14, s: 2, d: 0.54 },
  { x: 66, y: 12, s: 3, d: 0.84 },
  { x: 70, y: 10, s: 2, d: 0.66 },
  { x: 74, y: 8, s: 2.5, d: 0.96 },
  { x: 20, y: 58, s: 2, d: 0.2 },
  { x: 28, y: 50, s: 2, d: 0.4 },
  { x: 36, y: 42, s: 2.5, d: 0.55 },
  { x: 44, y: 34, s: 2, d: 0.75 },
  { x: 52, y: 26, s: 2, d: 0.9 },
  { x: 60, y: 20, s: 2.5, d: 1.05 },
  { x: 68, y: 14, s: 2, d: 1.2 },
] as const;

interface VoidLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  priority?: boolean;
}

const heights = {
  sm: "h-10",
  md: "h-14",
  lg: "h-[4.5rem]",
  hero: "h-auto w-full max-w-3xl sm:max-w-4xl",
} as const;

export function VoidLogo({
  className,
  size = "md",
  priority = false,
}: VoidLogoProps) {
  const isHero = size === "hero";
  const src = isHero ? "/voidad-brand-hero.png" : "/voidad-brand.png";

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      aria-label="VoidAd"
    >
      {/* Animated pixel trail — hero only; logo image already includes static pixels */}
      {isHero && (
        <svg
          className="pointer-events-none absolute inset-0 z-10 overflow-visible opacity-60"
          viewBox="0 0 100 70"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          {TRAIL_PIXELS.map((p, i) => (
            <rect
              key={i}
              x={p.x}
              y={p.y}
              width={p.s}
              height={p.s}
              className={cn(
                "void-pixel-trail",
                i % 3 === 0 && "void-pixel-trail-bright",
              )}
              style={{ animationDelay: `${p.d}s` }}
            />
          ))}
        </svg>
      )}

      <Image
        src={src}
        alt="VoidAd"
        width={949}
        height={528}
        priority={priority}
        className={cn(
          "relative z-0 w-auto object-contain",
          heights[size],
          isHero && "drop-shadow-[0_0_40px_rgba(0,255,153,0.15)]",
        )}
      />
    </div>
  );
}
