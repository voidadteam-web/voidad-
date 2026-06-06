import { HeroBrand } from "@/components/voidad/HeroBrand";
import { HeroWorldMapBackdrop } from "@/components/voidad/HeroWorldMapBackdrop";

interface PricingHeroProps {
  title: string;
  line1: string;
  line2: string;
  line3: string;
}

export function PricingHero({ title, line1, line2, line3 }: PricingHeroProps) {
  return (
    <section className="relative min-h-[420px] overflow-hidden pb-8 pt-6 sm:min-h-[480px] sm:pb-12 sm:pt-10">
      <HeroWorldMapBackdrop />

      <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
        <div className="text-center lg:text-left">
          <h1 className="void-display text-4xl font-bold text-white sm:text-5xl">
            {title}
          </h1>
          <p className="void-display mt-5 max-w-sm text-xs leading-relaxed tracking-[0.18em] text-void-text-mint sm:text-sm">
            {line1}
            <br />
            {line2}
            <br />
            {line3}
          </p>
        </div>

        <div className="flex justify-center">
          <HeroBrand />
        </div>

        <div className="hidden lg:block" aria-hidden />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-32 overflow-hidden opacity-40">
        <div className="void-perspective-grid absolute inset-x-[-20%] bottom-0 h-64 w-[140%]" />
      </div>
    </section>
  );
}
