import { cn } from "@/lib/utils";

interface VoidLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function VoidLogo({ className, showText = true, size = "md" }: VoidLogoProps) {
  const sizes = {
    sm: { icon: 28, text: "text-lg" },
    md: { icon: 36, text: "text-xl" },
    lg: { icon: 48, text: "text-2xl" },
  };

  const { icon, text } = sizes[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <defs>
          <linearGradient id="voidVGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#39ff14" />
            <stop offset="100%" stopColor="#1a9930" />
          </linearGradient>
          <filter id="voidGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Pixel trail */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={4 + i * 3}
            y={8 + i * 2}
            width={3}
            height={3}
            fill="#39ff14"
            opacity={0.3 + i * 0.12}
          />
        ))}
        {/* V shape */}
        <path
          d="M12 10 L24 38 L36 10 L30 10 L24 28 L18 10 Z"
          fill="url(#voidVGrad)"
          filter="url(#voidGlow)"
        />
      </svg>
      {showText && (
        <span className={cn("font-bold tracking-tight text-white", text)}>
          Void<span className="text-void-green">Ad</span>
        </span>
      )}
    </div>
  );
}
