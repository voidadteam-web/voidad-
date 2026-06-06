"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const TRAIL_PIXELS = [
  { x: 34, y: 10, s: 2, d: 0 },
  { x: 38, y: 8, s: 2.5, d: 0.15 },
  { x: 42, y: 6, s: 2, d: 0.3 },
  { x: 46, y: 5, s: 3, d: 0.1 },
  { x: 50, y: 4, s: 2, d: 0.45 },
  { x: 54, y: 3, s: 2.5, d: 0.25 },
  { x: 58, y: 2, s: 2, d: 0.6 },
  { x: 36, y: 14, s: 2, d: 0.35 },
  { x: 44, y: 12, s: 2, d: 0.5 },
  { x: 52, y: 8, s: 2.5, d: 0.7 },
] as const;

interface VoidLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  priority?: boolean;
}

const heights = {
  sm: "h-11 min-w-[148px]",
  md: "h-[4.25rem] min-w-[200px]",
  lg: "h-[5.25rem] min-w-[248px]",
  hero: "h-auto w-full max-w-3xl sm:max-w-4xl",
} as const;

function VoidLogoSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 248 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("void-logo-svg h-full w-auto", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="voidLogoVGrad" x1="12" y1="62" x2="52" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00cc7a" />
          <stop stopColor="#00ff99" />
          <stop offset="1" stopColor="#66ffcc" />
        </linearGradient>
        <linearGradient id="voidLogoRingGrad" x1="0" y1="36" x2="72" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00ff99" stopOpacity="0.15" />
          <stop offset="0.5" stopColor="#00ff99" stopOpacity="0.55" />
          <stop offset="1" stopColor="#00ff99" stopOpacity="0.15" />
        </linearGradient>
        <filter id="voidLogoGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="voidLogoTextGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="36" cy="36" rx="34" ry="32" stroke="url(#voidLogoRingGrad)" strokeWidth="1.25" />
      <ellipse
        cx="36"
        cy="36"
        rx="28"
        ry="26"
        className="void-logo-aura"
        stroke="#00ff99"
        strokeOpacity="0.22"
        strokeWidth="1"
      />

      <path
        d="M18 54 L32 14 L40 14 L54 54 L44 54 L37 32 L29 32 L22 54 Z"
        fill="url(#voidLogoVGrad)"
        filter="url(#voidLogoGlow)"
      />
      <path
        d="M30 22 L36 14 L42 22 L39 22 L36 18 L33 22 Z"
        fill="#050a0a"
        fillOpacity="0.35"
      />
      <path d="M24 48 L30 28 L42 28 L48 48" stroke="#050a0a" strokeOpacity="0.25" strokeWidth="1.2" />

      <g filter="url(#voidLogoTextGlow)">
        <text
          x="78"
          y="46"
          fill="#eafff5"
          fontFamily="var(--font-void-display), system-ui, sans-serif"
          fontSize="34"
          fontWeight="700"
          letterSpacing="0.06em"
        >
          Void
        </text>
        <text
          x="168"
          y="46"
          fill="#00ff99"
          fontFamily="var(--font-void-display), system-ui, sans-serif"
          fontSize="34"
          fontWeight="700"
          letterSpacing="0.06em"
        >
          Ad
        </text>
      </g>

      <rect x="74" y="52" width="108" height="2" rx="1" fill="#00ff99" fillOpacity="0.35" />

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

  if (isHero) {
    return (
      <div
        className={cn("relative inline-flex items-center justify-center", className)}
        aria-label="VoidAd"
      >
        <Image
          src="/voidad-brand-hero.png"
          alt="VoidAd"
          width={949}
          height={528}
          priority={priority}
          className={cn(
            "relative z-0 w-auto object-contain",
            heights.hero,
            "drop-shadow-[0_0_40px_rgba(0,255,153,0.2)]",
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "void-logo-wrap relative inline-flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]",
        heights[size],
        className,
      )}
      aria-label="VoidAd"
    >
      <VoidLogoSvg className="relative z-10" />
    </div>
  );
}
