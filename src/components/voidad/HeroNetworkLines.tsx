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
  { id: "us-ca", d: "M 268,188 Q 262,162 255,135", delay: 0.2, dur: 2.2 },
  { id: "ca-uk", d: "M 255,135 Q 380,80 492,162", delay: 0.5, dur: 3.8 },
  { id: "us-mx", d: "M 268,188 Q 245,210 225,225", delay: 0.9, dur: 2.6 },
  { id: "mx-br", d: "M 225,225 Q 278,275 332,318", delay: 1.1, dur: 3.4 },
  { id: "uk-fr", d: "M 492,162 Q 484,163 475,165", delay: 0.3, dur: 2 },
  { id: "fr-de", d: "M 475,165 Q 496,158 518,152", delay: 0.55, dur: 2.1 },
  { id: "fr-es", d: "M 475,165 Q 465,172 455,178", delay: 0.7, dur: 2.3 },
  { id: "es-br", d: "M 455,178 Q 390,260 332,318", delay: 1.4, dur: 4.2 },
  { id: "de-ru", d: "M 518,152 Q 550,145 585,138", delay: 0.85, dur: 2.8 },
  { id: "ru-jp", d: "M 585,138 Q 690,115 798,188", delay: 1.3, dur: 4.8 },
  { id: "uk-eg", d: "M 492,162 Q 520,195 545,225", delay: 1.05, dur: 3.1 },
  { id: "eg-ae", d: "M 545,225 Q 570,215 598,208", delay: 1.25, dur: 2.5 },
  { id: "eg-za", d: "M 545,225 Q 542,290 538,352", delay: 1.55, dur: 3.5 },
  { id: "de-ng", d: "M 518,152 Q 508,210 495,265", delay: 1.35, dur: 3.3 },
  { id: "ng-za", d: "M 495,265 Q 516,310 538,352", delay: 1.65, dur: 3 },
  { id: "ae-sg", d: "M 598,208 Q 660,245 728,275", delay: 1.15, dur: 3.2 },
  { id: "in-sg", d: "M 668,242 Q 698,260 728,275", delay: 1.45, dur: 2.7 },
  { id: "sg-au", d: "M 728,275 Q 795,320 862,368", delay: 1.85, dur: 4 },
  { id: "cn-jp", d: "M 745,215 Q 770,200 798,188", delay: 1.75, dur: 2.4 },
  { id: "kr-jp", d: "M 775,195 Q 786,192 798,188", delay: 1.95, dur: 2 },
  { id: "cn-in", d: "M 745,215 Q 706,230 668,242", delay: 2.05, dur: 2.9 },
  { id: "in-au", d: "M 668,242 Q 765,310 862,368", delay: 2.15, dur: 4.4 },
  { id: "br-ar", d: "M 332,318 Q 318,350 305,385", delay: 2.25, dur: 2.6 },
  { id: "ar-za", d: "M 305,385 Q 420,370 538,352", delay: 2.35, dur: 3.7 },
  { id: "us-br", d: "M 268,188 Q 300,260 332,318", delay: 2.45, dur: 3.9 },
  { id: "uk-ru", d: "M 492,162 Q 535,150 585,138", delay: 2.55, dur: 3.4 },
  { id: "us-de", d: "M 268,188 Q 390,130 518,152", delay: 2.65, dur: 4.2 },
  { id: "za-au", d: "M 538,352 Q 700,360 862,368", delay: 2.75, dur: 4.6 },
] as const;

const NODES = [
  { id: "ca", cx: 255, cy: 135 },
  { id: "us", cx: 268, cy: 188 },
  { id: "mx", cx: 225, cy: 225 },
  { id: "uk", cx: 492, cy: 162 },
  { id: "fr", cx: 475, cy: 165 },
  { id: "es", cx: 455, cy: 178 },
  { id: "de", cx: 518, cy: 152 },
  { id: "ru", cx: 585, cy: 138 },
  { id: "eg", cx: 545, cy: 225 },
  { id: "ae", cx: 598, cy: 208 },
  { id: "ng", cx: 495, cy: 265 },
  { id: "in", cx: 668, cy: 242 },
  { id: "cn", cx: 745, cy: 215 },
  { id: "kr", cx: 775, cy: 195 },
  { id: "jp", cx: 798, cy: 188 },
  { id: "sg", cx: 728, cy: 275 },
  { id: "br", cx: 332, cy: 318 },
  { id: "ar", cx: 305, cy: 385 },
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
        <filter id="routeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="particleGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {ROUTES.map(({ id, d, delay, dur }) => (
        <g key={id}>
          <path d={d} className="void-route-base" pathLength={100} />
          <path
            d={d}
            className="void-route-flow"
            pathLength={100}
            style={{ animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
          />
          <circle r="4" fill="#00ff99" filter="url(#particleGlow)" className="void-route-particle">
            <animateMotion
              dur={`${dur}s`}
              repeatCount="indefinite"
              begin={`${delay}s`}
              path={d}
            />
            <animate
              attributeName="opacity"
              values="0.2;1;0.2"
              dur={`${dur}s`}
              repeatCount="indefinite"
              begin={`${delay}s`}
            />
            <animate
              attributeName="r"
              values="3;5;3"
              dur={`${dur}s`}
              repeatCount="indefinite"
              begin={`${delay}s`}
            />
          </circle>
          <circle r="3" fill="#66ffcc" filter="url(#particleGlow)" className="void-route-particle">
            <animateMotion
              dur={`${dur * 1.15}s`}
              repeatCount="indefinite"
              begin={`${delay + dur * 0.45}s`}
              path={d}
            />
            <animate
              attributeName="opacity"
              values="0.1;0.85;0.1"
              dur={`${dur * 1.15}s`}
              repeatCount="indefinite"
              begin={`${delay + dur * 0.45}s`}
            />
          </circle>
        </g>
      ))}

      {NODES.map(({ id, cx, cy }, i) => (
        <g key={id}>
          <circle
            cx={cx}
            cy={cy}
            r="14"
            className="void-route-node-halo"
            style={{ animationDelay: `${i * 0.22}s` }}
          />
          <circle
            cx={cx}
            cy={cy}
            r="8"
            className="void-route-node-ring"
            style={{ animationDelay: `${i * 0.22 + 0.12}s` }}
          />
          <circle
            cx={cx}
            cy={cy}
            r="5"
            className="void-route-node"
            filter="url(#nodeGlow)"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        </g>
      ))}
    </svg>
  );
}
