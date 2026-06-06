import Image from "next/image";
import { cn } from "@/lib/utils";

interface VoidLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  priority?: boolean;
}

const sizeClasses = {
  sm: "h-10 max-w-[140px]",
  md: "h-14 max-w-[200px]",
  lg: "h-20 max-w-[280px]",
  hero: "h-auto w-full max-w-4xl",
} as const;

export function VoidLogo({
  className,
  size = "md",
  priority = false,
}: VoidLogoProps) {
  const isHero = size === "hero";

  return (
    <Image
      src={isHero ? "/voidad-logo-hero.png" : "/voidad-logo.png"}
      alt="VoidAd"
      width={1536}
      height={1024}
      priority={priority}
      className={cn(
        "object-contain object-left",
        sizeClasses[size],
        isHero &&
          "drop-shadow-[0_0_80px_rgba(45,212,191,0.18)]",
        className,
      )}
    />
  );
}
