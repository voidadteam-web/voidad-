import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { VoidButton } from "@/components/ui/VoidButton";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidStat } from "@/components/ui/VoidStat";
import { StatusBar } from "@/components/layout/StatusBar";
import {
  Shield,
  Eye,
  Lock,
  Users,
  Zap,
  Router,
  ChevronRight,
} from "lucide-react";
import { LeaderboardPreview } from "@/components/voidad/LeaderboardPreview";
import { HeroBrand } from "@/components/voidad/HeroBrand";
import { HeroWorldMapBackdrop } from "@/components/voidad/HeroWorldMapBackdrop";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const features = [
    { icon: Shield, label: t("features.antiAdware") },
    { icon: Eye, label: t("features.antiTracker") },
    { icon: Lock, label: t("features.antiPhishing") },
    { icon: Users, label: t("features.parentalControl") },
    { icon: Zap, label: t("features.voidpoints") },
    { icon: Router, label: t("features.iotGuard") },
  ];

  return (
    <>
      <StatusBar />

      {/* Hero — mockup 3-column layout */}
      <section className="relative mx-auto min-h-[420px] max-w-7xl overflow-hidden px-4 py-10 sm:min-h-[480px] sm:px-6 sm:py-16">
        <HeroWorldMapBackdrop />

        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
          {/* Left copy */}
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <p className="void-display text-xs tracking-[0.25em] text-void-green void-glow-text">
              {t("hero.badge")}
            </p>
            <h1 className="void-display mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
              {t("hero.titleLine1")}
            </h1>
            <p className="void-display mt-3 text-sm leading-relaxed tracking-[0.12em] text-void-text-mint sm:text-base">
              {t("hero.titleLine2")}
              <br />
              {t("hero.titleLine3")}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/signup">
                <VoidButton className="w-full min-w-[220px] sm:w-auto">
                  {t("hero.ctaPrimary")}
                  <ChevronRight className="h-4 w-4" />
                </VoidButton>
              </Link>
              <Link href="/pricing">
                <VoidButton variant="secondary" className="w-full min-w-[220px] sm:w-auto">
                  {t("hero.ctaSecondary")}
                </VoidButton>
              </Link>
            </div>
          </div>

          {/* Center logo + world map */}
          <div className="order-1 lg:order-2">
            <HeroBrand />
          </div>

          {/* Spacer for 3-column balance on desktop */}
          <div className="order-3 hidden lg:block" aria-hidden />
        </div>

        {/* Stats row */}
        <div className="relative z-10 mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <VoidPanel className="text-center">
            <VoidStat label={t("stats.adsBlocked")} value="1.5M+" />
          </VoidPanel>
          <VoidPanel className="text-center">
            <VoidStat label={t("stats.trackersBlocked")} value="890K+" />
          </VoidPanel>
          <VoidPanel className="text-center">
            <VoidStat label={t("stats.voidpoints")} value="12M+" />
          </VoidPanel>
          <VoidPanel className="text-center">
            <VoidStat label={t("stats.carbonOffset")} value="350" unit="KG CO₂" />
          </VoidPanel>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <VoidPanel title={t("features.title")}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 rounded-lg border border-void-green/10 bg-void-black/50 p-4 text-center transition-all hover:border-void-green/35 hover:shadow-[0_0_16px_rgba(0,255,153,0.08)]"
              >
                <Icon className="h-6 w-6 text-void-green" />
                <span className="text-xs font-medium text-void-text-mint">{label}</span>
              </div>
            ))}
          </div>
        </VoidPanel>
      </section>

      {/* Leaderboard preview */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <LeaderboardPreview />
      </section>
    </>
  );
}
