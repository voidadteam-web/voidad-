import Image from "next/image";
import { VoidLogo } from "@/components/voidad/VoidLogo";
import { HeroNetworkLines } from "@/components/voidad/HeroNetworkLines";

export function HeroBrand() {
  return (
    <div className="relative mx-auto mb-10 flex w-full max-w-2xl items-center justify-center px-2 sm:mb-14">
      {/* Transparent world map + animated routes — behind logo */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
        aria-hidden
      >
        <div className="relative h-[min(52vw,280px)] w-full max-w-xl sm:h-[min(44vw,320px)]">
          <Image
            src="/world-map-net.png"
            alt=""
            width={1024}
            height={558}
            priority
            className="void-hero-map h-full w-full object-contain"
          />
          <HeroNetworkLines className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,10,10,0.75)_100%)]" />
        </div>
      </div>

      <VoidLogo size="hero" priority />
    </div>
  );
}
