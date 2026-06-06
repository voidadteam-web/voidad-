interface SpyRadarProps {
  title: string;
}

export function SpyRadar({ title }: SpyRadarProps) {
  const nodes = [
    [60, 45],
    [120, 70],
    [180, 50],
    [240, 80],
    [300, 55],
    [90, 100],
    [200, 110],
    [280, 95],
  ];

  return (
    <div className="void-pricing-card h-full p-4">
      <p className="void-section-title mb-3 text-center text-[10px]">{title}</p>
      <svg viewBox="0 0 360 140" className="h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,255,153,0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="360" height="140" fill="url(#radarGlow)" rx="8" />
        <ellipse
          cx="180"
          cy="70"
          rx="140"
          ry="50"
          stroke="rgba(0,255,153,0.2)"
          fill="none"
          strokeWidth="0.8"
        />
        <path
          d="M40 70 Q180 30 320 70"
          stroke="rgba(0,255,153,0.12)"
          fill="none"
        />
        <path
          d="M40 70 Q180 110 320 70"
          stroke="rgba(0,255,153,0.12)"
          fill="none"
        />
        {nodes.map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="3" fill="#00ff99" opacity="0.7">
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur={`${2 + i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx={cx}
              cy={cy}
              r="8"
              stroke="rgba(0,255,153,0.25)"
              fill="none"
            />
          </g>
        ))}
        {/* Connection arcs */}
        <path
          d="M60 45 Q120 20 180 50"
          stroke="rgba(0,255,153,0.2)"
          fill="none"
          strokeWidth="0.6"
        />
        <path
          d="M180 50 Q240 30 300 55"
          stroke="rgba(0,255,153,0.2)"
          fill="none"
          strokeWidth="0.6"
        />
      </svg>
    </div>
  );
}
