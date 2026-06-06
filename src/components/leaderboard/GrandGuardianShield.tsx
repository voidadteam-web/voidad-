import Image from "next/image";
import { cn } from "@/lib/utils";

type GrandGuardianShieldProps = {
  className?: string;
};

/** Local PNG with alpha — unoptimized to preserve transparency */
export function GrandGuardianShield({ className }: GrandGuardianShieldProps) {
  return (
    <Image
      src="/grand-guardian-shield.png"
      alt=""
      width={663}
      height={860}
      unoptimized
      priority
      className={cn(
        "block h-14 w-auto max-w-none shrink-0 object-contain object-left leading-[0] mix-blend-lighten sm:h-16",
        className,
      )}
    />
  );
}
