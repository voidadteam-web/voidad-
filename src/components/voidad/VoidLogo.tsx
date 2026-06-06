"use client";

import { cn } from "@/lib/utils";

interface VoidLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  priority?: boolean;
}

const heights = {
  sm: "h-11 w-auto min-w-[152px]",
  md: "h-14 w-auto min-w-[196px]",
  lg: "h-[5.25rem] w-auto min-w-[260px] sm:h-[5.75rem] sm:min-w-[280px]",
  hero: "h-[7.5rem] w-auto min-w-[340px] sm:h-[9rem] sm:min-w-[400px]",
} as const;

/** Professional global mark — globe grid + shield + wordmark */
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
        <linearGradient id="voidGlobeFill" x1="8" y1="8" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0d2818" />
          <stop stopColor="#143d2a" />
          <stop offset="1" stopColor="#0a1410" />
        </linearGradient>
        <linearGradient id="voidShieldFill" x1="36" y1="10" x2="36" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00ff99" />
          <stop offset="0.55" stopColor="#00cc7a" />
          <stop offset="1" stopColor="#00995c" />
        </linearGradient>
        <linearGradient id="voidWordGrad" x1="88" y1="20" x2="320" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="0.72" stopColor="#e8fff5" />
          <stop offset="1" stopColor="#00ff99" />
        </linearGradient>
        <filter id="voidLogoSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Globe grid */}
      <g className="void-logo-globe-spin">
        <circle cx="36" cy="36" r="33" stroke="#00ff99" strokeOpacity="0.28" strokeWidth="1.2" />
        <circle cx="36" cy="36" r="33" fill="url(#voidGlobeFill)" fillOpacity="0.85" />
        <ellipse cx="36" cy="36" rx="33" ry="11" stroke="#00ff99" strokeOpacity="0.22" strokeWidth="0.9" />
        <ellipse cx="36" cy="36" rx="33" ry="22" stroke="#00ff99" strokeOpacity="0.18" strokeWidth="0.9" />
        <ellipse cx="36" cy="36" rx="14" ry="33" stroke="#00ff99" strokeOpacity="0.2" strokeWidth="0.9" />
        <ellipse cx="36" cy="36" rx="24" ry="33" stroke="#00ff99" strokeOpacity="0.14" strokeWidth="0.8" />
        <path d="M3 36 H69" stroke="#00ff99" strokeOpacity="0.16" strokeWidth="0.8" />
        <path d="M36 3 V69" stroke="#00ff99" strokeOpacity="0.12" strokeWidth="0.8" />
      </g>

      {/* Shield */}
      <path
        d="M36 9 L57 18.5 V37.5 C57 51.5 47.5 59.5 36 63 C24.5 59.5 15 51.5 15 37.5 V18.5 L36 9 Z"
        fill="url(#voidShieldFill)"
        fillOpacity="0.92"
        stroke="#66ffcc"
        strokeWidth="1.25"
        filter="url(#voidLogoSoftGlow)"
      />

      {/* V mark */}
      <path
        d="M36 19 L29.5 44.5 H33 L36 33.5 L39 44.5 H42.5 L36 19 Z"
        fill="#04100c"
        fillOpacity="0.55"
      />
      <path
        d="M36 22 L31 42 H34 L36 35 L38 42 H41 L36 22 Z"
        fill="#ffffff"
        fillOpacity="0.92"
      />

      {/* Node accents — global network */}
      <circle cx="12" cy="28" r="2" fill="#00ff99" fillOpacity="0.75" />
      <circle cx="60" cy="24" r="2" fill="#00ff99" fillOpacity="0.65" />
      <circle cx="58" cy="48" r="1.75" fill="#00ff99" fillOpacity="0.55" />

      {/* Wordmark */}
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
