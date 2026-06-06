import { cn } from "@/lib/utils";
import {
  shieldTierForLevel,
  shieldVariantIndex,
  type ShieldTier,
} from "@/lib/level-shields";

type DragonShieldArtProps = {
  tier: ShieldTier;
  variant: number;
  level: number;
  size: number;
  className?: string;
};

/** Procedural metallic dragon shields — tier + level pick the silhouette */
export function DragonShieldArt({
  tier,
  variant,
  level,
  size,
  className,
}: DragonShieldArtProps) {
  const meta = shieldTierForLevel(level);
  const uid = `ds-${tier}-${variant}-${level}`;

  return (
    <svg
      viewBox="0 0 80 96"
      width={size}
      height={size * 1.2}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${uid}-metal`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8eef0" />
          <stop offset="35%" stopColor="#9aa8ad" />
          <stop offset="55%" stopColor="#d4dde0" />
          <stop offset="100%" stopColor="#5c6b70" />
        </linearGradient>
        <linearGradient id={`${uid}-accent`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={meta.accent} stopOpacity="0.95" />
          <stop offset="100%" stopColor={meta.accent} stopOpacity="0.35" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={meta.glow} />
        </filter>
      </defs>

      <g filter={`url(#${uid}-glow)`}>
        {/* Shield body */}
        <path
          d="M40 4 L66 16 L62 52 C60 68 52 82 40 90 C28 82 20 68 18 52 L14 16 Z"
          fill={`url(#${uid}-metal)`}
          stroke={meta.accent}
          strokeWidth="1.2"
        />
        <path
          d="M40 12 L58 21 L55 50 C53 62 48 72 40 78 C32 72 27 62 25 50 L22 21 Z"
          fill="rgba(5,10,10,0.55)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.6"
        />

        {/* Wings — spread increases with tier */}
        <Wings tier={tier} variant={variant} accent={meta.accent} />

        {/* Dragon silhouette */}
        <DragonSilhouette tier={tier} variant={variant} accent={meta.accent} uid={uid} />

        {/* Tier ornaments */}
        {tier >= 5 && (
          <g fill={meta.accent} opacity="0.9">
            <polygon points="40,8 41.8,12.5 46.5,12.5 42.6,15.5 44.2,20 40,17.2 35.8,20 37.4,15.5 33.5,12.5 38.2,12.5" />
          </g>
        )}
        {tier >= 6 && (
          <>
            <polygon
              points="28,10 29,13 32,13 29.8,15 30.6,18 28,16.5 25.4,18 26.2,15 24,13 27,13"
              fill={meta.accent}
              opacity="0.75"
            />
            <polygon
              points="52,10 53,13 56,13 53.8,15 54.6,18 52,16.5 49.4,18 50.2,15 48,13 51,13"
              fill={meta.accent}
              opacity="0.75"
            />
          </>
        )}

        {/* Level badge */}
        <rect x="30" y="66" width="20" height="12" rx="3" fill="rgba(5,10,10,0.85)" stroke={meta.accent} strokeWidth="0.8" />
        <text
          x="40"
          y="74.5"
          textAnchor="middle"
          fill={meta.accent}
          fontSize="8"
          fontWeight="700"
          fontFamily="Rajdhani, sans-serif"
        >
          {level}
        </text>
      </g>
    </svg>
  );
}

function Wings({
  tier,
  variant,
  accent,
}: {
  tier: ShieldTier;
  variant: number;
  accent: string;
}) {
  const spread = 6 + tier * 2.5 + variant;
  const opacity = 0.35 + tier * 0.06;

  return (
    <g stroke={accent} strokeWidth="1" fill="none" opacity={opacity}>
      <path d={`M40 28 C${40 - spread} 18, ${22 - variant} 14, 12 20`} />
      <path d={`M40 28 C${40 + spread} 18, ${58 + variant} 14, 68 20`} />
      {tier >= 3 && (
        <>
          <path d={`M40 32 C${40 - spread - 2} 24, ${18 - variant} 22, 8 28`} opacity="0.6" />
          <path d={`M40 32 C${40 + spread + 2} 24, ${62 + variant} 22, 72 28`} opacity="0.6" />
        </>
      )}
    </g>
  );
}

function DragonSilhouette({
  tier,
  variant,
  accent,
  uid,
}: {
  tier: ShieldTier;
  variant: number;
  accent: string;
  uid: string;
}) {
  const y = 34 + (variant % 2);
  const horn = tier >= 4 ? 1 : 0;

  return (
    <g fill={`url(#${uid}-accent)`} stroke={accent} strokeWidth="0.5">
      {/* Head */}
      <path
        d={`M${34 + variant} ${y} C${36 + variant} ${y - 6}, ${44 - variant} ${y - 8}, ${48 + variant} ${y - 2}
           C${52 + horn} ${y + 2}, ${50 + variant} ${y + 8}, ${44 + variant} ${y + 10}
           C${38 + variant} ${y + 8}, ${32 + variant} ${y + 4}, ${34 + variant} ${y} Z`}
      />
      {/* Eye */}
      <circle cx={44 + variant * 0.3} cy={y + 1} r="1.2" fill="#050a0a" />
      {/* Neck & body */}
      <path
        d={`M${38 + variant} ${y + 10} C${34 + variant} ${y + 18}, ${36 + variant} ${y + 28}, ${40} ${y + 34}
           C${44 - variant} ${y + 28}, ${46 + variant} ${y + 18}, ${42 + variant} ${y + 10} Z`}
        opacity="0.92"
      />
      {/* Tail — longer for higher tiers */}
      <path
        d={`M${40} ${y + 34} C${36 - tier} ${y + 40}, ${34 + variant} ${y + 48 + tier}, ${40 + variant} ${y + 52 + tier * 0.5}`}
        fill="none"
        stroke={accent}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Arms / claws */}
      {tier >= 2 && (
        <>
          <path d={`M${36 + variant} ${y + 16} L${28 - tier} ${y + 20 + variant}`} strokeWidth="1.2" fill="none" />
          <path d={`M${44 - variant} ${y + 16} L${52 + tier} ${y + 18 + variant}`} strokeWidth="1.2" fill="none" />
        </>
      )}
      {/* Wings membrane for high tiers */}
      {tier >= 5 && (
        <>
          <path d="M40 26 L22 34 L28 42 L40 36 Z" opacity="0.45" />
          <path d="M40 26 L58 34 L52 42 L40 36 Z" opacity="0.45" />
        </>
      )}
      {/* Fire breath for top tiers */}
      {tier >= 6 && variant === 0 && (
        <path
          d={`M${48 + variant} ${y} C${56} ${y - 4}, ${60} ${y + 2}, ${54} ${y + 6}`}
          fill="none"
          stroke={accent}
          strokeWidth="1"
          opacity="0.8"
        />
      )}
    </g>
  );
}
