import Image from "next/image";
import { HeroNetworkLines } from "@/components/voidad/HeroNetworkLines";
import { cn } from "@/lib/utils";

interface HeroWorldMapBackdropProps {
  className?: string;
}

/** Full-width transparent world map with animated routes */
export function HeroWorldMapBackdrop({ className }: HeroWorldMapBackdropProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[45%]",
        className,
      )}
      aria-hidden
    >
      <div className="relative h-[min(95vw,620px)] w-[min(140vw,1280px)] sm:h-[min(75vw,680px)]">
        <Image
          src="/world-map-net.png"
          alt=""
          width={1024}
          height={558}
          priority
          className="void-hero-map void-hero-map-large h-full w-full object-contain"
        />
        <HeroNetworkLines className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(5,10,10,0.55)_70%,rgba(5,10,10,0.92)_100%)]" />
      </div>
    </div>
  );
}
