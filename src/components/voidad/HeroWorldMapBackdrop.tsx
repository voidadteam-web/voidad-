import Image from "next/image";
import { HeroNetworkLines } from "@/components/voidad/HeroNetworkLines";
import { cn } from "@/lib/utils";

interface HeroWorldMapBackdropProps {
  className?: string;
}

/** Full-width transparent world map with neon glow and animated data routes */
export function HeroWorldMapBackdrop({ className }: HeroWorldMapBackdropProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[42%] lg:-translate-y-[40%]",
        className,
      )}
      aria-hidden
    >
      <div className="void-map-neon-wrap relative h-[min(105vw,720px)] w-[min(155vw,1400px)] sm:h-[min(85vw,780px)]">
        <div className="void-map-neon-aura absolute inset-[8%]" />
        <div className="void-map-neon-aura void-map-neon-aura-delay absolute inset-[12%]" />

        <Image
          src="/world-map-net.png"
          alt=""
          width={1024}
          height={558}
          priority
          className="void-hero-map void-hero-map-large void-hero-map-neon relative z-[1] h-full w-full object-contain"
        />

        <HeroNetworkLines className="absolute inset-0 z-[2] h-full w-full" />

        <div className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,10,10,0.35)_72%,rgba(5,10,10,0.88)_100%)]" />
      </div>
    </div>
  );
}
