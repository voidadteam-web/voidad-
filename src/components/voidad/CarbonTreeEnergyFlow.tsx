import { cn } from "@/lib/utils";

type CarbonTreeEnergyFlowProps = {
  className?: string;
  intensity?: "sm" | "md" | "lg";
};

const FEED_NODES = [
  { x: 72, delay: 0 },
  { x: 128, delay: 0.6 },
  { x: 200, delay: 1.2 },
  { x: 272, delay: 0.9 },
  { x: 328, delay: 0.3 },
];

/** Data particles rising from world map into tree roots */
export function CarbonTreeEnergyFlow({
  className,
  intensity = "md",
}: CarbonTreeEnergyFlowProps) {
  const particleCount = intensity === "sm" ? 6 : intensity === "lg" ? 14 : 10;

  return (
    <svg
      viewBox="0 0 400 340"
      className={cn("pointer-events-none absolute inset-0 z-[5] h-full w-full", className)}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
    >
      <defs>
        <linearGradient id="energy-stream" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#00ff99" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#00ff99" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Map grid pulse lines — roots merge into ground */}
      <g stroke="#00ff99" strokeWidth="0.5" fill="none" opacity="0.18">
        <path d="M40 318 H360 M60 308 Q200 298 340 308" />
        {[100, 160, 200, 240, 300].map((x) => (
          <path key={x} d={`M${x} 318 L${200 + (x - 200) * 0.15} 268`} opacity="0.35" />
        ))}
      </g>

      {/* Energy streams map → root base */}
      {FEED_NODES.map(({ x, delay }) => (
        <g key={x}>
          <line
            x1={x}
            y1={312}
            x2={200}
            y2={268}
            stroke="url(#energy-stream)"
            strokeWidth="1"
            opacity="0.35"
            className="void-tree-stream"
            style={{ animationDelay: `${delay}s` }}
          />
          <circle
            cx={x}
            cy={312}
            r="2.5"
            fill="#00ff99"
            className="void-tree-feed-node"
            style={{ animationDelay: `${delay}s` }}
          />
        </g>
      ))}

      {/* Rising data particles */}
      {Array.from({ length: particleCount }, (_, i) => {
        const x = 60 + ((i * 37) % 280);
        const startY = 300 + (i % 4) * 8;
        return (
          <rect
            key={i}
            x={x}
            y={startY}
            width="2"
            height="2"
            fill="#00ff99"
            className="void-tree-energy-particle"
            style={{ animationDelay: `${(i * 0.45) % 3}s` }}
          />
        );
      })}
    </svg>
  );
}
