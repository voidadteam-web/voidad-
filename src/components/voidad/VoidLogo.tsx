"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

const PIXELS = [
  { x: 8, y: 14, size: 3, delay: 0, dur: 2.1 },
  { x: 14, y: 8, size: 2, delay: 0.3, dur: 1.8 },
  { x: 20, y: 18, size: 2, delay: 0.6, dur: 2.4 },
  { x: 26, y: 10, size: 3, delay: 0.15, dur: 1.6 },
  { x: 32, y: 22, size: 2, delay: 0.9, dur: 2.2 },
  { x: 38, y: 6, size: 2, delay: 0.45, dur: 1.9 },
  { x: 44, y: 16, size: 3, delay: 0.75, dur: 2.5 },
  { x: 50, y: 26, size: 2, delay: 0.2, dur: 1.7 },
  { x: 56, y: 12, size: 2, delay: 1.1, dur: 2.3 },
  { x: 62, y: 20, size: 3, delay: 0.55, dur: 2.0 },
  { x: 68, y: 8, size: 2, delay: 0.85, dur: 1.5 },
  { x: 74, y: 18, size: 2, delay: 0.35, dur: 2.6 },
  { x: 80, y: 28, size: 3, delay: 1.2, dur: 1.8 },
  { x: 86, y: 14, size: 2, delay: 0.65, dur: 2.1 },
  { x: 92, y: 6, size: 2, delay: 0.95, dur: 2.4 },
] as const;

interface VoidLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "hero";
}

const sizes = {
  sm: { box: 40, text: "text-lg", gap: "gap-2" },
  md: { box: 52, text: "text-xl", gap: "gap-2.5" },
  lg: { box: 68, text: "text-2xl", gap: "gap-3" },
  hero: { box: 120, text: "text-5xl sm:text-6xl", gap: "gap-4" },
} as const;

export function VoidLogo({
  className,
  showText = true,
  size = "md",
}: VoidLogoProps) {
  const { box, text, gap } = sizes[size];
  const isHero = size === "hero";
  const uid = useId().replace(/:/g, "");
  const metalId = `voidVMetal-${uid}`;
  const shineId = `voidVShine-${uid}`;
  const glowId = `voidVGlow-${uid}`;

  return (
    <div className={cn("flex items-center", gap, className)}>
      <div
        className="relative shrink-0"
        style={{ width: box, height: box }}
        aria-hidden
      >
        {/* Pixel trail — flash & scatter */}
        <svg
          className="absolute inset-0 overflow-visible"
          viewBox="0 0 100 100"
          fill="none"
        >
          {PIXELS.map((p, i) => (
            <rect
              key={i}
              x={p.x}
              y={p.y}
              width={p.size}
              height={p.size}
              className="void-pixel"
              style={{
                animationDuration: `${p.dur}s`,
                animationDelay: `${p.delay}s`,
                opacity: 0.35 + (i % 3) * 0.15,
              }}
            />
          ))}
          {isHero &&
            PIXELS.map((p, i) => (
              <rect
                key={`b-${i}`}
                x={p.x + 4}
                y={p.y + 12}
                width={p.size - 0.5}
                height={p.size - 0.5}
                className="void-pixel void-pixel-alt"
                style={{
                  animationDuration: `${p.dur + 0.4}s`,
                  animationDelay: `${p.delay + 0.5}s`,
                }}
              />
            ))}
        </svg>

        {/* Metallic V */}
        <svg
          viewBox="0 0 48 48"
          width={box}
          height={box}
          className="relative z-10"
          aria-hidden
        >
          <defs>
            <linearGradient id={metalId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5eead4" />
              <stop offset="45%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
            <linearGradient id={shineId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ccfbf1" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#042f2e" stopOpacity="0.6" />
            </linearGradient>
            <filter id={glowId}>
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M10 8 L24 40 L38 8 L32 8 L24 30 L16 8 Z"
            fill={`url(#${metalId})`}
            filter={`url(#${glowId})`}
          />
          <path
            d="M10 8 L24 40 L38 8 L32 8 L24 30 L16 8 Z"
            fill={`url(#${shineId})`}
            opacity="0.45"
          />
          <path
            d="M12 10 L24 36 L36 10 L31 10 L24 26 L17 10 Z"
            fill="none"
            stroke="#99f6e4"
            strokeWidth="0.6"
            opacity="0.5"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight text-white",
            text,
            isHero && "void-glow-text",
          )}
        >
          oid<span className="text-void-green">Ad</span>
        </span>
      )}
    </div>
  );
}
