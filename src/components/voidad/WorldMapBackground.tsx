export function WorldMapBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden opacity-30"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(57,255,20,0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="1200" height="600" fill="url(#mapGlow)" />
        {/* Simplified world wireframe */}
        <g
          stroke="rgba(57,255,20,0.15)"
          strokeWidth="0.8"
          fill="none"
        >
          <ellipse cx="600" cy="300" rx="480" ry="220" />
          <path d="M120 300 Q600 180 1080 300" />
          <path d="M120 300 Q600 420 1080 300" />
          <path d="M600 80 L600 520" />
          <path d="M200 200 Q400 250 600 220 T1000 200" />
          <path d="M200 400 Q400 350 600 380 T1000 400" />
        </g>
        {/* Network nodes */}
        {[
          [280, 220],
          [420, 180],
          [580, 240],
          [720, 200],
          [880, 260],
          [340, 340],
          [520, 380],
          [760, 360],
          [640, 280],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle
              cx={cx}
              cy={cy}
              r="4"
              fill="rgba(57,255,20,0.4)"
              className="animate-pulse-glow"
            />
            <circle cx={cx} cy={cy} r="8" stroke="rgba(57,255,20,0.2)" />
          </g>
        ))}
      </svg>
      <div className="absolute inset-0 void-grid-bg opacity-40" />
    </div>
  );
}
