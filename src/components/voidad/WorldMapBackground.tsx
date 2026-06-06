export function WorldMapBackground() {
  const nodes = [
    [180, 180],
    [320, 140],
    [480, 200],
    [620, 160],
    [780, 220],
    [900, 180],
    [260, 320],
    [420, 360],
    [580, 340],
    [720, 380],
    [860, 320],
    [540, 260],
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-void-black via-transparent to-void-black opacity-80" />
      <svg
        className="absolute inset-0 h-full w-full opacity-25"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="rgba(0,255,153,0.12)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="1200" height="600" fill="url(#mapGlow)" />

        {/* Dotted world map silhouette */}
        <g fill="rgba(0,255,153,0.25)">
          {Array.from({ length: 40 }, (_, row) =>
            Array.from({ length: 80 }, (_, col) => {
              const x = col * 15 + 60;
              const y = row * 12 + 40;
              const inMap =
                Math.sin(col * 0.15) * 80 +
                  Math.cos(row * 0.2) * 60 +
                  300 <
                  y &&
                y < 480 &&
                x > 100 &&
                x < 1100;
              if (!inMap) return null;
              return <circle key={`${row}-${col}`} cx={x} cy={y} r="1.2" />;
            }),
          )}
        </g>

        {/* Wireframe arcs */}
        <g stroke="rgba(0,255,153,0.12)" strokeWidth="0.8" fill="none">
          <ellipse cx="600" cy="300" rx="460" ry="200" />
          <path d="M140 300 Q600 160 1060 300" />
          <path d="M140 300 Q600 440 1060 300" />
          <path d="M600 100 L600 500" />
        </g>

        {/* Glowing nodes */}
        {nodes.map(([cx, cy], i) => (
          <g key={i}>
            <circle
              cx={cx}
              cy={cy}
              r="3"
              fill="rgba(0,255,153,0.5)"
              className="animate-pulse-glow"
            />
            <circle
              cx={cx}
              cy={cy}
              r="10"
              stroke="rgba(0,255,153,0.15)"
              fill="none"
            />
          </g>
        ))}
      </svg>
      <div className="absolute inset-0 void-grid-bg opacity-30" />
    </div>
  );
}
