"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidButton } from "@/components/ui/VoidButton";
import { VoidStat } from "@/components/ui/VoidStat";
import { VoidPageTitle } from "@/components/ui/VoidPageTitle";
import { Heart, Leaf, TreePine } from "lucide-react";
import { CarbonWireframeTree } from "@/components/voidad/CarbonWireframeTree";
import { VoidTreeEvolution } from "@/components/voidad/VoidTreeEvolution";
import { useUserStats } from "@/hooks/useUserStats";
import { useRecentDonations } from "@/hooks/useRecentDonations";
import {
  formatBandwidthGb,
  formatCarbonKg,
  formatEuro,
} from "@/lib/user-stats";
import { Link } from "@/i18n/navigation";

const CHARITIES = [
  { slug: "green-servers", icon: Leaf, nameEn: "Green Servers Alliance" },
  { slug: "plant-a-bit", icon: TreePine, nameEn: "Plant-A-Bit Initiative" },
  { slug: "digital-freedom", icon: Heart, nameEn: "Digital Freedom Foundation" },
];

export default function VoidPointsPage() {
  const t = useTranslations("voidpoints");
  const locale = useLocale();
  const { stats, loading, isAuthenticated } = useUserStats();
  const { donations, loading: donationsLoading } = useRecentDonations(5);
  const [previewTreeLevel, setPreviewTreeLevel] = useState<number | null>(null);

  const unlockedTreeLevel = stats.carbonTreeLevel;
  const treeLevel =
    previewTreeLevel !== null && previewTreeLevel <= unlockedTreeLevel
      ? previewTreeLevel
      : unlockedTreeLevel;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <VoidPageTitle>{t("title")}</VoidPageTitle>

      <div className="relative mb-10 flex flex-col items-center">
        <CarbonWireframeTree level={treeLevel} size="md" className="max-w-md" />
        <div className="mt-6 flex flex-wrap justify-center gap-8 text-center">
          <div>
            <p className="void-section-title text-[10px] text-void-muted">
              {t("totalBandwidth")}
            </p>
            <p className="void-display text-xl text-void-green void-glow-text">
              {loading ? "—" : formatBandwidthGb(stats.bandwidthGb, locale)}
            </p>
          </div>
          <div>
            <p className="void-section-title text-[10px] text-void-muted">
              {t("carbonOffset")}
            </p>
            <p className="void-display text-xl text-void-green void-glow-text">
              {loading ? "—" : formatCarbonKg(stats.carbonOffsetKg, locale)}
            </p>
          </div>
        </div>
      </div>

      <VoidPanel glow="strong" className="mb-10">
        <VoidTreeEvolution
          currentLevel={treeLevel}
          unlockedLevel={unlockedTreeLevel}
          onSelectLevel={(level) => {
            if (level <= unlockedTreeLevel) setPreviewTreeLevel(level);
          }}
        />
        <div className="mt-8 flex justify-center">
          <VoidButton variant="secondary" onClick={() => setPreviewTreeLevel(null)}>
            {t("viewCurrentLevel", { level: unlockedTreeLevel })}
          </VoidButton>
        </div>
      </VoidPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <VoidPanel glow="strong">
            <VoidStat
              label={t("estimatedSavings")}
              value={loading ? "—" : formatEuro(stats.estimatedSavingsEur, locale)}
            />
            <p className="mt-2 text-center text-xs text-void-muted">{t("savingsNote")}</p>
            <VoidButton className="mt-6 w-full">{t("convert")}</VoidButton>
            <p className="mt-2 text-center text-[10px] text-void-muted">
              {t("convertRate")}
            </p>
          </VoidPanel>

          <VoidPanel title={t("recentActivity")}>
            {!isAuthenticated ? (
              <p className="text-center text-xs text-void-muted">
                {t("signInForActivity")}{" "}
                <Link href="/login" className="text-void-green hover:underline">
                  {t("signIn")}
                </Link>
              </p>
            ) : donationsLoading ? (
              <p className="text-center text-xs text-void-muted">{t("loadingActivity")}</p>
            ) : donations.length === 0 ? (
              <p className="text-center text-xs text-void-muted">{t("noRecentDonations")}</p>
            ) : (
              <ul className="space-y-2 text-xs">
                {donations.map((donation) => {
                  const charityName =
                    locale === "de" ? donation.charityNameDe : donation.charityNameEn;
                  return (
                    <li
                      key={donation.id}
                      className="rounded-lg border border-void-green/15 bg-void-black/40 px-3 py-2.5 text-void-text-mint"
                    >
                      {t("donationEntry", {
                        points: donation.points.toLocaleString(locale),
                        charity: charityName,
                      })}
                    </li>
                  );
                })}
              </ul>
            )}
          </VoidPanel>
        </div>

        <VoidPanel glow="strong">
          <VoidStat
            label={t("yourBalance")}
            value={loading ? "—" : stats.voidpoints.toLocaleString(locale)}
          />
          <div className="mt-4 grid grid-cols-2 gap-3 text-center text-xs">
            <div className="rounded-lg border border-void-green/15 bg-void-black/40 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider text-void-muted">
                {t("playerLevel")}
              </p>
              <p className="void-display mt-1 text-sm text-void-green">
                {loading ? "—" : stats.level}
              </p>
            </div>
            <div className="rounded-lg border border-void-green/15 bg-void-black/40 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider text-void-muted">
                {t("treeLevel")}
              </p>
              <p className="void-display mt-1 text-sm text-void-green">
                {loading ? "—" : stats.carbonTreeLevel}
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {CHARITIES.map(({ slug, icon: Icon, nameEn }) => (
              <div
                key={slug}
                className="flex items-center justify-between rounded-lg border border-void-green/15 bg-void-black/40 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-void-green/25 bg-void-panel">
                    <Icon className="h-4 w-4 text-void-green" />
                  </div>
                  <span className="text-sm font-medium text-void-text-mint">{nameEn}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Amount"
                    className="w-16 rounded border border-void-green/20 bg-void-black px-2 py-1 text-xs text-void-green outline-none focus:border-void-green/50"
                  />
                  <VoidButton variant="secondary" className="py-1.5 text-[10px]">
                    {t("donate")}
                  </VoidButton>
                </div>
              </div>
            ))}
          </div>
        </VoidPanel>
      </div>
    </div>
  );
}
