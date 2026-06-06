import { cn } from "@/lib/utils";

type CarbonWireframeTreeProps = {
  /** 1–10 — tree size and canopy complexity */
  level?: number;
  className?: string;
  showMap?: boolean;
  idPrefix?: string;
};

const NEON = "#00ff99";

/** Wireframe carbon tree — roots absorb from world map (VoidPoints mockup) */
export function CarbonWireframeTree({
  level = 5,
  className,
  showMap = true,
  idPrefix = "cwt",
}: CarbonWireframeTreeProps) {
  const tier = Math.min(10, Math.max(1, level));
  const scale = 0.72 + tier * 0.028;
  const canopyR = 48 + tier * 4;
  const pixelCount = Math.min(12, 3 + tier);

  return (
    <div className={cn("relative mx-auto w-full max-w-md", className)}>
      {showMap && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] opacity-35"
          aria-hidden
        >
          <svg viewBox="0 0 400 120" className="h-full w-full" preserveAspectRatio="xMidYMax meet">
            <defs>
              <linearGradient id={`${idPrefix}-mapGlow`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={NEON} stopOpacity="0.15" />
                <stop offset="100%" stopColor={NEON} stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path
              d="M30 90 Q80 70 120 85 T200 80 T280 88 T370 75 L370 120 L30 120 Z"
              fill={`url(#${idPrefix}-mapGlow)`}
              stroke={NEON}
              strokeOpacity="0.25"
              strokeWidth="0.8"
            />
            <path
              d="M60 95 L90 78 L130 92 L170 76 L210 90 L250 74 L290 88 L330 72"
              fill="none"
              stroke={NEON}
              strokeOpacity="0.35"
              strokeWidth="0.6"
            />
            {[80, 140, 200, 260, 320].map((x) => (
              <circle key={x} cx={x} cy={82 + (x % 3) * 4} r="2" fill={NEON} opacity="0.5" />
            ))}
          </svg>
        </div>
      )}

      <svg
        viewBox="0 0 400 340"
        className="relative z-10 h-auto w-full drop-shadow-[0_0_18px_rgba(0,255,153,0.25)]"
        aria-hidden
        style={{ transform: `scale(${scale})`, transformOrigin: "center bottom" }}
      >
        <defs>
          <linearGradient id={`${idPrefix}-treeGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={NEON} stopOpacity="0.95" />
            <stop offset="100%" stopColor="#2d5a4c" stopOpacity="0.45" />
          </linearGradient>
          <filter id={`${idPrefix}-glow`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g stroke={NEON} strokeWidth="1.2" fill="none" opacity="0.65" filter={`url(#${idPrefix}-glow)`}>
          <path d="M200 268 L200 300" />
          <path d="M200 285 L165 310 L140 328" />
          <path d="M200 285 L235 310 L260 328" />
          <path d="M200 278 L180 302 L155 318" />
          <path d="M200 278 L220 302 L245 318" />
          {tier >= 5 && (
            <>
              <path d="M200 290 L175 315 L148 330" opacity="0.5" />
              <path d="M200 290 L225 315 L252 330" opacity="0.5" />
            </>
          )}
        </g>

        <path
          d="M200 268 L200 195"
          stroke={`url(#${idPrefix}-treeGrad)`}
          strokeWidth="3"
          fill="none"
          filter={`url(#${idPrefix}-glow)`}
        />

        <g stroke={NEON} strokeWidth="1.4" fill="none" opacity="0.85" filter={`url(#${idPrefix}-glow)`}>
          <path d="M200 210 L165 175 L130 145" />
          <path d="M200 210 L235 175 L270 145" />
          <path d="M200 225 L170 200 L148 178" />
          <path d="M200 225 L230 200 L252 178" />
          {tier >= 4 && (
            <>
              <path d="M200 198 L178 168 L158 148" opacity="0.7" />
              <path d="M200 198 L222 168 L242 148" opacity="0.7" />
            </>
          )}
          {tier >= 7 && (
            <>
              <path d="M200 188 L185 155 L172 130" opacity="0.55" />
              <path d="M200 188 L215 155 L228 130" opacity="0.55" />
            </>
          )}
        </g>

        <g stroke={NEON} strokeWidth="0.9" fill="none" opacity="0.55" filter={`url(#${idPrefix}-glow)`}>
          <polygon
            points={`200,${120 - tier} 140,${180 - tier * 0.5} 260,${180 - tier * 0.5}`}
            fill={NEON}
            fillOpacity="0.06"
          />
          <polygon points={`200,${95 - tier} 155,${155 - tier * 0.4} 245,${155 - tier * 0.4}`} />
          <polygon points={`200,${130 - tier * 0.5} 165,${190 - tier * 0.3} 235,${190 - tier * 0.3}`} />
          <circle cx="200" cy={140 - tier * 0.5} r={canopyR} strokeOpacity="0.35" />
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={`h-${i}`}
              x1={160 + i * 20}
              y1={150 - tier + i * 8}
              x2={240 - i * 20}
              y2={170 - tier + i * 6}
              opacity="0.4"
            />
          ))}
        </g>

        {[
          [200, 118 - tier],
          [160, 165 - tier * 0.4],
          [240, 165 - tier * 0.4],
          [175, 140 - tier * 0.5],
          [225, 140 - tier * 0.5],
          [200, 155 - tier * 0.3],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.5" fill={NEON} opacity="0.75" />
        ))}

        {Array.from({ length: pixelCount }, (_, i) => (
          <rect
            key={i}
            x={268 + (i % 4) * 11}
            y={58 + Math.floor(i / 4) * 14 + (i % 2) * 6}
            width="7"
            height="7"
            fill={NEON}
            opacity={0.25 + (i / pixelCount) * 0.55}
            className="void-pixel-trail"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </svg>

      <p className="void-display relative z-10 mt-1 text-center text-[10px] tracking-[0.2em] text-void-green/80">
        CARBON TREE · LVL {tier}
      </p>
    </div>
  );
}
