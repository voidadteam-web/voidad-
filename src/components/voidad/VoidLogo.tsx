"use client";

import { cn } from "@/lib/utils";
import { VoidLogoEmblem } from "@/components/voidad/VoidLogoEmblem";

interface VoidLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  priority?: boolean;
}

const heights = {
  sm: "h-11 w-auto min-w-[168px]",
  md: "h-14 w-auto min-w-[210px]",
  lg: "h-[5.5rem] w-auto min-w-[280px] sm:h-[6rem] sm:min-w-[300px]",
  hero: "h-[8rem] w-auto min-w-[360px] sm:h-[9.5rem] sm:min-w-[420px]",
} as const;

function VoidLogoGlobal({ showTagline = false }: { showTagline?: boolean }) {
  return (
    <svg
      viewBox={showTagline ? "0 0 340 88" : "0 0 340 72"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="void-logo-global h-full w-auto overflow-visible"
      aria-hidden
    >
      <defs>
        <linearGradient id="voidWordGrad" x1="88" y1="20" x2="320" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="0.72" stopColor="#e8fff5" />
          <stop offset="1" stopColor="#00ff99" />
        </linearGradient>
      </defs>

      <VoidLogoEmblem />

      <text
        x="88"
        y="46"
        fill="url(#voidWordGrad)"
        fontFamily="var(--font-rajdhani), var(--font-inter), system-ui, sans-serif"
        fontSize="38"
        fontWeight="700"
        letterSpacing="0.14em"
      >
        VOIDAD
      </text>

      <rect x="88" y="52" width="132" height="2.5" rx="1.25" fill="#00ff99" fillOpacity="0.45" />

      {showTagline && (
        <text
          x="88"
          y="72"
          fill="#6b8f7a"
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontSize="9.5"
          fontWeight="600"
          letterSpacing="0.32em"
        >
          GLOBAL NETWORK SECURITY
        </text>
      )}
    </svg>
  );
}

export function VoidLogo({ className, size = "md" }: VoidLogoProps) {
  const isHero = size === "hero";

  return (
    <div
      className={cn(
        "void-logo-pro relative inline-flex shrink-0 items-center justify-start",
        heights[size],
        className,
      )}
      aria-label="VoidAd — Global Network Security"
    >
      <div className="void-logo-pro-halo pointer-events-none absolute inset-[-8%] rounded-full" aria-hidden />
      <VoidLogoGlobal showTagline={isHero} />
    </div>
  );
}
