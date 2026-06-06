import Image from "next/image";
import { HeroNetworkLines } from "@/components/voidad/HeroNetworkLines";
import { cn } from "@/lib/utils";

type LeaderboardMapBackdropProps = {
  className?: string;
};

/** Glowing world map behind leaderboard — matches hero mockup */
export function LeaderboardMapBackdrop({ className }: LeaderboardMapBackdropProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-50">
        <div className="relative h-full w-[140%] max-w-[1400px] sm:w-full">
          <Image
            src="/world-map-net.png"
            alt=""
            fill
            priority
            className="void-hero-map object-contain object-center"
          />
          <HeroNetworkLines className="absolute inset-0 h-full w-full opacity-80" />
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,10,10,0.65)_55%,rgba(5,10,10,0.95)_100%)]" />
      <div className="absolute inset-0 void-grid-bg opacity-20" />
    </div>
  );
}
