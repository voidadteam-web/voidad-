import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { VoidButton } from "@/components/ui/VoidButton";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidPageTitle } from "@/components/ui/VoidPageTitle";
import { VoidStat } from "@/components/ui/VoidStat";
import { cn } from "@/lib/utils";
import {
  Shield,
  Monitor,
  Globe,
  Lock,
  Wifi,
  Heart,
  Check,
} from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

const tierIcons = [Shield, Monitor, Globe, Lock];

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");

  const tiers = ["trial", "free", "pro", "ultimate"] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <VoidPageTitle subtitle={t("subtitle")}>{t("title")}</VoidPageTitle>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier, i) => {
          const isPopular = tier === "pro";
          const Icon = tierIcons[i] ?? Shield;
          const features = t.raw(`tiers.${tier}.features`) as string[];

          return (
            <VoidPanel
              key={tier}
              glow={isPopular ? "strong" : "default"}
              className={cn(
                "relative flex flex-col",
                isPopular && "void-pricing-popular lg:-mt-2 lg:mb-2",
              )}
            >
              {isPopular && (
                <span className="void-display absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-void-green px-3 py-0.5 text-[10px] font-bold text-void-black">
                  {t("mostPopular")}
                </span>
              )}

              <div className="mb-4 flex items-center gap-2">
                <Icon className="h-5 w-5 text-void-green" />
                <h3 className="void-display text-lg text-white">
                  {t(`tiers.${tier}.name`)}
                </h3>
              </div>

              <p className="void-display text-2xl font-bold text-void-green void-glow-text">
                {t(`tiers.${tier}.price`)}
              </p>
              <p className="mt-1 text-xs text-void-muted">
                {t(`tiers.${tier}.period`)}
              </p>

              <ul className="mt-6 flex-1 space-y-2.5">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-xs text-void-text-mint"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-void-green" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/signup" className="mt-6 block">
                <VoidButton
                  variant={isPopular ? "primary" : "secondary"}
                  className="w-full text-xs"
                >
                  {t(`tiers.${tier}.cta`)}
                </VoidButton>
              </Link>
            </VoidPanel>
          );
        })}
      </div>

      {/* Stats bar */}
      <div className="mt-12 grid grid-cols-1 divide-y divide-void-green/10 border border-void-green/20 rounded-xl sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <VoidPanel glow="none" className="rounded-none border-0 text-center shadow-none">
          <VoidStat label={t("stats.adsBlocked")} value="2.4M" />
        </VoidPanel>
        <VoidPanel glow="none" className="rounded-none border-0 text-center shadow-none">
          <VoidStat label={t("stats.trackers")} value="890K" />
        </VoidPanel>
        <VoidPanel glow="none" className="rounded-none border-0 text-center shadow-none">
          <VoidStat label={t("stats.dataSaved")} value="1.2" unit="PB" />
        </VoidPanel>
      </div>

      {/* Feature highlights */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Wifi, label: t("highlights.network") },
          { icon: Heart, label: t("highlights.voidpoints") },
          { icon: Shield, label: t("highlights.zeroLog") },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-lg border border-void-green/15 bg-void-panel/50 px-4 py-3"
          >
            <Icon className="h-5 w-5 text-void-green" />
            <span className="text-sm text-void-text-mint">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
