import Image from "next/image";
import { cn } from "@/lib/utils";

interface VoidLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}

const sizeClasses = {
  sm: "h-9",
  md: "h-12",
  lg: "h-16",
} as const;

export function VoidLogo({
  className,
  size = "md",
  priority = false,
}: VoidLogoProps) {
  return (
    <Image
      src="/voidad-logo.jpg"
      alt="VoidAd"
      width={1024}
      height={783}
      priority={priority}
      className={cn("w-auto object-contain", sizeClasses[size], className)}
    />
  );
}
