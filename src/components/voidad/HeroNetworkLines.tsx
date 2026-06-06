"use client";

import { cn } from "@/lib/utils";

/** Routes aligned to world-map-net.png (viewBox 1024×558) */
const ROUTES = [
  { id: "us-uk", d: "M 268,188 Q 370,110 492,162", delay: 0, dur: 3.2 },
  { id: "uk-de", d: "M 492,162 Q 505,148 518,152", delay: 0.4, dur: 2.4 },
  { id: "de-ae", d: "M 518,152 Q 560,175 598,208", delay: 0.8, dur: 3 },
  { id: "ae-in", d: "M 598,208 Q 635,228 668,242", delay: 1.2, dur: 2.8 },
  { id: "us-jp", d: "M 248,182 Q 520,60 798,188", delay: 0.6, dur: 4.5 },
  { id: "br-za", d: "M 332,318 Q 440,360 538,352", delay: 1.6, dur: 3.6 },
  { id: "jp-au", d: "M 798,188 Q 840,280 862,368", delay: 2, dur: 3.8 },
  { id: "uk-in", d: "M 492,162 Q 590,200 668,242", delay: 2.4, dur: 4 },
] as const;

const NODES = [
  { id: "us", cx: 268, cy: 188 },
  { id: "uk", cx: 492, cy: 162 },
  { id: "de", cx: 518, cy: 152 },
  { id: "ae", cx: 598, cy: 208 },
  { id: "in", cx: 668, cy: 242 },
  { id: "jp", cx: 798, cy: 188 },
  { id: "br", cx: 332, cy: 318 },
  { id: "za", cx: 538, cy: 352 },
  { id: "au", cx: 862, cy: 368 },
] as const;

interface HeroNetworkLinesProps {
  className?: string;
}

export function HeroNetworkLines({ className }: HeroNetworkLinesProps) {
  return (
    <svg
      className={cn("pointer-events-none", className)}
      viewBox="0 0 1024 558"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <filter id="routeGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {ROUTES.map(({ id, d, delay, dur }) => (
        <g key={id}>
          <path
            d={d}
            className="void-route-base"
            pathLength={100}
          />
          <path
            d={d}
            className="void-route-flow"
            pathLength={100}
            style={{ animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
          />
          <circle r="3" fill="#00ff99" filter="url(#routeGlow)">
            <animateMotion
              dur={`${dur}s`}
              repeatCount="indefinite"
              begin={`${delay}s`}
              path={d}
            />
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur={`${dur}s`}
              repeatCount="indefinite"
              begin={`${delay}s`}
            />
          </circle>
        </g>
      ))}

      {NODES.map(({ id, cx, cy }, i) => (
        <circle
          key={id}
          cx={cx}
          cy={cy}
          r="4"
          className="void-route-node"
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
    </svg>
  );
}
