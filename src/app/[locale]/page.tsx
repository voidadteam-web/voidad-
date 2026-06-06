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

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <HeroBrand />

        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-void-green/30 bg-void-green/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-void-green">
            {t("hero.badge")}
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {t("hero.title")}
            <br />
            <span className="text-void-green void-glow-text">
              {t("hero.titleHighlight")}
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-void-muted">
            {t("hero.subtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <VoidButton className="w-full min-w-[240px] sm:w-auto">
                {t("hero.ctaPrimary")}
                <ChevronRight className="h-4 w-4" />
              </VoidButton>
            </Link>
            <Link href="/dashboard">
              <VoidButton variant="secondary" className="w-full min-w-[240px] sm:w-auto">
                {t("hero.ctaSecondary")}
              </VoidButton>
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <VoidPanel title={t("features.title")}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 rounded-xl border border-void-green/10 bg-void-black/40 p-4 text-center transition-colors hover:border-void-green/30"
              >
                <Icon className="h-6 w-6 text-void-green" />
                <span className="text-xs font-medium text-void-text">{label}</span>
              </div>
            ))}
          </div>
        </VoidPanel>
      </section>

      {/* Leaderboard preview */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <LeaderboardPreview />
      </section>
    </>
  );
}

