import { cn } from "@/lib/utils";

type DragonShieldProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

/** Winged shield badge for guardian level display */
export function DragonShield({ className, size = "md" }: DragonShieldProps) {
  const dim = size === "lg" ? 56 : size === "sm" ? 32 : 44;

  return (
    <svg
      viewBox="0 0 64 64"
      width={dim}
      height={dim}
      className={cn("shrink-0 text-void-green drop-shadow-[0_0_8px_rgba(0,255,153,0.5)]", className)}
      aria-hidden
    >
      <path
        d="M32 4 L8 18 L12 38 C14 48 22 56 32 60 C42 56 50 48 52 38 L56 18 Z"
        fill="rgba(0,255,153,0.12)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M32 14 L18 24 L20 36 C21 42 26 47 32 49 C38 47 43 42 44 36 L46 24 Z"
        fill="rgba(0,255,153,0.2)"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M4 28 C10 24 14 20 18 16"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M60 28 C54 24 50 20 46 16"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M2 34 C8 32 12 30 16 28"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.45"
      />
      <path
        d="M62 34 C56 32 52 30 48 28"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.45"
      />
    </svg>
  );
}
