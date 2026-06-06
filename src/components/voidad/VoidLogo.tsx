"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/** Disintegration trail — drifts up-right in sync waves */
const TRAIL_PIXELS = [
  { x: 14, y: 58, s: 2, d: 0 },
  { x: 18, y: 54, s: 2.5, d: 0.12 },
  { x: 22, y: 50, s: 2, d: 0.24 },
  { x: 26, y: 46, s: 3, d: 0.08 },
  { x: 30, y: 42, s: 2, d: 0.36 },
  { x: 34, y: 38, s: 2.5, d: 0.18 },
  { x: 38, y: 34, s: 2, d: 0.48 },
  { x: 42, y: 30, s: 3, d: 0.3 },
  { x: 46, y: 26, s: 2, d: 0.6 },
  { x: 50, y: 22, s: 2, d: 0.42 },
  { x: 54, y: 18, s: 2.5, d: 0.72 },
  { x: 58, y: 14, s: 2, d: 0.54 },
  { x: 62, y: 10, s: 3, d: 0.84 },
  { x: 66, y: 8, s: 2, d: 0.66 },
  { x: 70, y: 6, s: 2.5, d: 0.96 },
  { x: 16, y: 62, s: 2, d: 0.2 },
  { x: 24, y: 52, s: 2, d: 0.4 },
  { x: 32, y: 44, s: 2.5, d: 0.55 },
  { x: 40, y: 36, s: 2, d: 0.75 },
  { x: 48, y: 28, s: 2, d: 0.9 },
  { x: 56, y: 20, s: 2.5, d: 1.05 },
  { x: 64, y: 12, s: 2, d: 1.2 },
] as const;

interface VoidLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  priority?: boolean;
}

const heights = {
  sm: "h-12 w-auto min-w-[160px]",
  md: "h-[4.75rem] w-auto min-w-[220px]",
  lg: "h-[6.25rem] w-auto min-w-[280px] sm:h-[6.75rem] sm:min-w-[300px]",
  hero: "h-auto w-full max-w-3xl sm:max-w-4xl",
} as const;

function LogoParticles({ className }: { className?: string }) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 z-20 overflow-visible opacity-70", className)}
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
          className={cn("void-pixel-trail", i % 3 === 0 && "void-pixel-trail-bright")}
          style={{ animationDelay: `${p.d}s` }}
        />
      ))}
    </svg>
  );
}

export function VoidLogo({
  className,
  size = "md",
  priority = false,
}: VoidLogoProps) {
  const isHero = size === "hero";
  const src = isHero ? "/voidad-brand-hero.png" : "/voidad-brand.png";

  return (
    <div
      className={cn(
        "void-logo-wrap relative inline-flex items-center justify-center transition-transform duration-300 hover:scale-[1.015]",
        heights[size],
        className,
      )}
      aria-label="VoidAd"
    >
      <div className="void-logo-neon-halo pointer-events-none absolute inset-[-12%] rounded-full" aria-hidden />

      {!isHero && <LogoParticles />}

      <Image
        src={src}
        alt="VoidAd"
        width={949}
        height={528}
        priority={priority}
        className={cn(
          "void-logo-brand relative z-10 w-auto object-contain object-left",
          heights[size],
          isHero && "void-logo-brand-hero",
        )}
      />
    </div>
  );
}
