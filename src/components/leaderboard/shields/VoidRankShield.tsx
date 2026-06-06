import Image from "next/image";
import type { ShieldTier } from "@/lib/shield-ranks";
import { shieldImageForTier } from "@/lib/shield-ranks";
import { cn } from "@/lib/utils";

type VoidRankShieldProps = {
  tier: ShieldTier;
  size?: number;
  className?: string;
};

const ASPECT = 4 / 5;

/** High-fidelity cyber shield badge — PNG art, neon-on-dark-metal */
export function VoidRankShield({ tier, size = 48, className }: VoidRankShieldProps) {
  const h = Math.round(size * ASPECT);
  const src = shieldImageForTier(tier);

  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={h}
      unoptimized
      aria-hidden
      className={cn(
        "block max-h-none max-w-none object-contain object-center",
        "drop-shadow-[0_0_12px_rgba(0,255,153,0.4)]",
        className,
      )}
      style={{ width: size, height: h }}
    />
  );
}
