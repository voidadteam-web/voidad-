"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { StatusBar } from "@/components/layout/StatusBar";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidToggle } from "@/components/ui/VoidToggle";
import { VoidButton } from "@/components/ui/VoidButton";
import { VoidStat } from "@/components/ui/VoidStat";
import {
  Shield,
  Eye,
  AlertTriangle,
  Filter,
  Globe,
  Camera,
  Thermometer,
  Lightbulb,
  Refrigerator,
  Heart,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { VoidPageTitle } from "@/components/ui/VoidPageTitle";
import { DashboardProfile } from "@/components/dashboard/DashboardProfile";
import { ExtensionActivate } from "@/components/extension/ExtensionActivate";
import { NetworkDnsSetup } from "@/components/dashboard/NetworkDnsSetup";
import { MaxProtectionPanel } from "@/components/dashboard/MaxProtectionPanel";
import { FamilyFilterPanel } from "@/components/dashboard/FamilyFilterPanel";
import { LevelMilitaryRank, levelBadgeTitle } from "@/components/leaderboard/LevelMilitaryRank";
import { useUserStats } from "@/hooks/useUserStats";
import { useProtectionSettings } from "@/hooks/useProtectionSettings";
import { useDnsActivity } from "@/hooks/useDnsActivity";
import { formatCarbonKg } from "@/lib/user-stats";
import { useLocale } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const ts = useTranslations("stats");
  const locale = useLocale();
  const { stats, refetch } = useUserStats();
  const { settings, updateSettings, saving } = useProtectionSettings();
  const { entries: activity } = useDnsActivity();

  useEffect(() => {
    const interval = window.setInterval(() => void refetch(), 5000);
    return () => window.clearInterval(interval);
  }, [refetch]);

  const voidpoints = stats.voidpoints;
  const level = stats.level;
  const adsBlocked = stats.adsBlocked;
  const donateable = Math.max(0, stats.voidpoints - stats.voidpointsDonated);
  const isNewAccount = voidpoints === 0 && adsBlocked === 0;

  async function toggleSetting(
    key: "anti_adware" | "anti_tracker" | "anti_phishing" | "false_positive_filter" | "geo_block" | "focus_mode_enabled",
  ) {
    if (!settings) return;
    await updateSettings({ [key]: !settings[key] });
  }

  return (
    <RequireAuth>
      <>
      <StatusBar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <VoidPageTitle>{t("title")}</VoidPageTitle>

        <div className="mb-6">
          <DashboardProfile />
        </div>

        <NetworkDnsSetup />

        <ExtensionActivate />

        <MaxProtectionPanel />

        <FamilyFilterPanel />

        <div className="grid gap-4 lg:grid-cols-4">
          <VoidPanel title={t("protectionRules")}>
            <div className="space-y-2">
              <VoidToggle
                label={t("antiAdware")}
                checked={settings?.anti_adware ?? true}
                disabled={saving}
                onChange={() => void toggleSetting("anti_adware")}
              />
              <VoidToggle
                label={t("antiTracker")}
                checked={settings?.anti_tracker ?? true}
                disabled={saving}
                onChange={() => void toggleSetting("anti_tracker")}
              />
              <VoidToggle
                label={t("antiPhishing")}
                checked={settings?.anti_phishing ?? true}
                disabled={saving}
                onChange={() => void toggleSetting("anti_phishing")}
              />
              <VoidToggle
                label={t("falsePositive")}
                checked={settings?.false_positive_filter ?? true}
                disabled={saving}
                onChange={() => void toggleSetting("false_positive_filter")}
              />
              <VoidToggle
                label={t("geoBlock")}
                checked={settings?.geo_block ?? false}
                disabled={saving}
                onChange={() => void toggleSetting("geo_block")}
              />
            </div>
          </VoidPanel>

          <VoidPanel title={t("iotGuard")}>
            <div className="space-y-2">
              <VoidToggle
                label={t("homeNetwork")}
                checked={settings?.protection_enabled ?? true}
                disabled={saving}
                onChange={() => void updateSettings({ protection_enabled: !settings?.protection_enabled })}
              />
              <div className="flex items-center gap-2 px-3 py-1 text-xs text-void-muted">
                <Camera className="h-3.5 w-3.5 text-void-green" />
                {t("securityCameras")}
              </div>
              <div className="flex items-center gap-2 px-3 py-1 text-xs text-void-muted">
                <Thermometer className="h-3.5 w-3.5 text-void-green" />
                {t("smartThermostat")}
              </div>
              <div className="flex items-center gap-2 px-3 py-1 text-xs text-void-muted">
                <Lightbulb className="h-3.5 w-3.5 text-void-green" />
                {t("smartLights")}
              </div>
              <div className="flex items-center gap-2 px-3 py-1 text-xs text-void-muted">
                <Refrigerator className="h-3.5 w-3.5 text-void-muted" />
                {t("smartRefrigerator")}
              </div>
            </div>
          </VoidPanel>

          <VoidPanel title={t("voidpointsDonate")}>
            <VoidStat label={ts("voidpoints")} value={voidpoints} />
            <div className="mt-4 space-y-2 text-xs text-void-muted">
              <div className="flex justify-between">
                <span>{t("donateBalance")}</span>
                <span className="text-void-green">
                  {donateable.toLocaleString(locale)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{ts("adsBlocked")}</span>
                <span className="text-void-green">
                  {adsBlocked.toLocaleString(locale)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("donatedPoints")}</span>
                <span className="text-void-green">
                  {stats.voidpointsDonated.toLocaleString(locale)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("dataSaving")}</span>
                <span className="text-void-green">
                  {stats.bandwidthGb.toLocaleString(locale)} GB
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/voidpoints">
                <VoidButton variant="secondary" className="w-full text-xs">
                  <Heart className="h-3.5 w-3.5" />
                  {t("quickDonate")}
                </VoidButton>
              </Link>
              <Link href="/voidpoints">
                <VoidButton variant="ghost" className="w-full text-xs">
                  {t("viewCharities")}
                </VoidButton>
              </Link>
            </div>
            <div className="mt-3 flex flex-col items-center gap-1">
              {level > 0 && (
                <LevelMilitaryRank level={Math.min(level, 57)} size="sm" />
              )}
              <p className="text-center text-xs text-void-green">
                {level > 0
                  ? `${levelBadgeTitle(level)} — Level ${level}`
                  : t("levelStarter")}
              </p>
            </div>
          </VoidPanel>

          <VoidPanel title={t("mentalHealth")}>
            <p className="mb-3 text-xs text-void-muted">{t("focusScheduler")}</p>
            <FocusGrid
              empty={isNewAccount}
              enabled={settings?.focus_mode_enabled ?? false}
              onToggle={() => void toggleSetting("focus_mode_enabled")}
            />
          </VoidPanel>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <VoidPanel title={t("liveFeed")} className="lg:col-span-1">
            <div className="rounded-lg border border-void-green/30 bg-void-black/50 p-2">
              <div className="mb-2 flex items-center justify-between border-b border-void-green/15 px-2 pb-2">
                <span className="text-[10px] uppercase tracking-wider text-void-muted">
                  {t("liveFeedBox")}
                </span>
                <span className="font-mono text-[10px] text-void-green">
                  {activity.length.toLocaleString(locale)}
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto overscroll-contain rounded-md border border-void-green/15 bg-void-black/60 p-2 sm:max-h-72">
                {activity.length === 0 ? (
                  <p className="flex min-h-32 items-center justify-center px-2 text-center text-xs text-void-muted">
                    {t("noActivity")}
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {activity.map((entry) => (
                      <li
                        key={`${entry.created_at}-${entry.domain}`}
                        className="rounded-md border border-void-green/15 bg-void-black/50 px-2.5 py-1.5 font-mono text-[10px] leading-relaxed text-void-green sm:text-[11px]"
                      >
                        {formatActivityLine(entry, t)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </VoidPanel>

          <VoidPanel className="lg:col-span-2" title={t("impactStats")}>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <VoidStat label={ts("adsBlocked")} value={adsBlocked} />
              <VoidStat label={ts("trackersBlocked")} value={stats.trackersBlocked} />
              <VoidStat label={t("maliciousDomains")} value={stats.maliciousBlocked} />
              <VoidStat
                label={ts("carbonOffset")}
                value={formatCarbonKg(stats.carbonOffsetKg, locale)}
              />
            </div>
            <p className="mt-4 text-xs text-void-muted">
              {formatCarbonKg(stats.carbonOffsetKg, locale)} · {t("statsNote")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {[Shield, Eye, AlertTriangle, Filter, Globe].map((Icon, i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-void-green/20 bg-void-black/40"
                >
                  <Icon className="h-4 w-4 text-void-green" />
                </div>
              ))}
            </div>
          </VoidPanel>
        </div>
      </div>
      </>
    </RequireAuth>
  );
}

function formatActivityLine(
  entry: { domain: string; block_type: string; client_ip: string | null },
  t: (
    key:
      | "feedAd"
      | "feedTracker"
      | "feedPhishing"
      | "feedSocial"
      | "feedAdult"
      | "feedGambling"
      | "feedKeyword",
  ) => string,
) {
  const prefix =
    entry.block_type === "tracker"
      ? t("feedTracker")
      : entry.block_type === "phishing"
        ? t("feedPhishing")
        : entry.block_type === "social"
          ? t("feedSocial")
          : entry.block_type === "adult"
            ? t("feedAdult")
            : entry.block_type === "gambling"
              ? t("feedGambling")
              : entry.block_type === "keyword"
                ? t("feedKeyword")
                : t("feedAd");
  const source = entry.client_ip ? ` → ${entry.client_ip}` : "";
  return `${prefix}: ${entry.domain}${source}`;
}

function FocusGrid({
  empty,
  enabled,
  onToggle,
}: {
  empty: boolean;
  enabled: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations("dashboard");
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const hours = [0, 6, 12, 18];
  const active = empty || !enabled
    ? new Set<string>()
    : new Set(["Mo-0", "Tu-0", "We-12", "Th-18", "Fr-0", "Sa-12"]);

  return (
    <div>
      <VoidToggle
        label={t("keywordFilter")}
        checked={enabled}
        onChange={onToggle}
      />
      <div className="mt-4 overflow-x-auto">
        <div className="inline-grid grid-cols-8 gap-1 text-[10px]">
          <div />
          {days.map((d) => (
            <div key={d} className="text-center text-void-muted">
              {d}
            </div>
          ))}
          {hours.flatMap((h) => [
            <div key={`h-${h}`} className="text-void-muted">
              {h}h
            </div>,
            ...days.map((d) => (
              <div
                key={`${d}-${h}`}
                className={`h-5 w-5 rounded-sm ${
                  active.has(`${d}-${h}`)
                    ? "bg-void-green shadow-[0_0_6px_rgba(0,255,153,0.6)]"
                    : "bg-void-black/60 border border-void-green/10"
                }`}
              />
            )),
          ])}
        </div>
      </div>
    </div>
  );
}
