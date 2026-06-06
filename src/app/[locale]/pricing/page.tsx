import { getTranslations, setRequestLocale } from "next-intl/server";
import { PricingHero } from "@/components/pricing/PricingHero";
import { PricingTierCard } from "@/components/pricing/PricingTierCard";
import { PricingStatsBar } from "@/components/pricing/PricingStatsBar";
import { SpyRadar } from "@/components/pricing/SpyRadar";
import {
  Monitor,
  Shield,
  Globe,
  Lock,
  Wifi,
  Users,
  Fingerprint,
  Smartphone,
  Home,
  Router,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

type TierKey = "trial" | "free" | "pro" | "ultimate";

const tierIcons: Record<TierKey, LucideIcon[]> = {
  trial: [Monitor, Shield, Wifi],
  free: [Monitor, Shield, Globe, Lock],
  pro: [Home, Monitor, Globe, Shield, Fingerprint, Users],
  ultimate: [Router, Monitor, Globe, Shield, Fingerprint, Smartphone, Lock],
};

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");

  const tiers: TierKey[] = ["trial", "free", "pro", "ultimate"];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <PricingHero
        title={t("heroTitle")}
        line1={t("heroLine1")}
        line2={t("heroLine2")}
        line3={t("heroLine3")}
      />

      {/* Pricing cards — 4-column mockup layout */}
      <section className="relative z-10 -mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
        {tiers.map((tier) => {
          const featureTexts = t.raw(`tiers.${tier}.features`) as string[];
          const icons = tierIcons[tier];
          const features = featureTexts.map((text, i) => ({
            icon: icons[i] ?? Shield,
            text,
          }));

          return (
            <PricingTierCard
              key={tier}
              name={t(`tiers.${tier}.name`)}
              price={t(`tiers.${tier}.price`)}
              period={t(`tiers.${tier}.period`)}
              features={features}
              cta={t(`tiers.${tier}.cta`)}
              href={tier === "trial" ? "/signup" : "/signup"}
              highlighted={tier === "pro"}
              badge={tier === "pro" ? t("mostPopular") : undefined}
            />
          );
        })}
      </section>

      {/* Stats + Spy-Radar — mockup bottom row */}
      <section className="mt-10 grid gap-4 lg:grid-cols-[1fr_280px]">
        <PricingStatsBar
          adsBlocked={t("stats.adsBlockedValue")}
          adsBlockedLabel={t("stats.adsBlocked")}
          trackers={t("stats.trackersValue")}
          trackersLabel={t("stats.trackers")}
          dataSaved={t("stats.dataSavedValue")}
          dataSavedLabel={t("stats.dataSaved")}
        />
        <SpyRadar title={t("spyRadar")} />
      </section>
    </div>
  );
}
