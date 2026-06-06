"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { CarbonWireframeTree } from "@/components/voidad/CarbonWireframeTree";
import { LevelMilitaryRank } from "@/components/leaderboard/LevelMilitaryRank";
import { CyberFlag } from "@/components/leaderboard/CyberFlag";
import type { VoidGuardian } from "@/components/leaderboard/guardians-data";
import {
  buildGuardianContributions,
  contributionMetrics,
} from "@/lib/guardian-contributions";
import { countryFlag } from "@/lib/countries";
import { cn } from "@/lib/utils";

type GuardianProfileModalProps = {
  player: VoidGuardian | null;
  onClose: () => void;
};

export function GuardianProfileModal({ player, onClose }: GuardianProfileModalProps) {
  const t = useTranslations("leaderboard");

  useEffect(() => {
    if (!player) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [player, onClose]);

  if (!player) return null;

  const contributions = buildGuardianContributions(player.rank, player.level);
  const labels = {
    adsBlockedLabel: t("adsBlockedLabel"),
    donatedPoints: t("donatedPoints"),
    trackersBlocked: t("trackersBlocked"),
    bandwidthSaved: t("bandwidthSaved"),
    carbonOffset: t("carbonOffset"),
    voidpointsEarned: t("voidpointsEarned"),
  };
  const metrics = contributionMetrics(contributions, labels);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guardian-profile-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-void-black/92 backdrop-blur-md"
        onClick={onClose}
        aria-label={t("closeProfile")}
      />

      <div
        className={cn(
          "relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl",
          "border border-void-green/40 bg-void-black/95 shadow-[0_0_48px_rgba(0,255,153,0.2)]",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-void-green/30 text-void-green transition hover:border-void-green/60 hover:bg-void-green/10"
          aria-label={t("closeProfile")}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="overflow-y-auto p-5 sm:p-8">
          {/* Header */}
          <div className="mb-6 flex items-start gap-4 pr-8">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-void-green/45 sm:h-20 sm:w-20">
              <Image src={player.avatarUrl} alt="" fill className="object-cover" unoptimized />
            </div>
            <div className="min-w-0 flex-1">
              <h2
                id="guardian-profile-title"
                className="void-display truncate text-lg tracking-[0.12em] text-void-green void-glow-text sm:text-xl"
              >
                {player.username}
              </h2>
              <p className="mt-1 text-xs uppercase tracking-wider text-void-muted">
                {t("rank")} #{player.rank} — {player.title}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <CyberFlag code={player.countryCode} size="sm" />
                <span className="text-sm text-void-text-mint">
                  {countryFlag(player.countryCode)} {player.countryName}
                </span>
              </div>
            </div>
            <div className="hidden shrink-0 flex-col items-center gap-1 sm:flex">
              <LevelMilitaryRank level={player.level} size="lg" />
              <p className="void-display text-sm text-void-green">
                {t("level")} {player.level}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Carbon tree */}
            <div className="rounded-xl border border-void-green/20 bg-void-black/50 p-4">
              <h3 className="void-display mb-3 text-center text-xs tracking-[0.18em] text-void-green">
                {t("carbonTreeTitle")}
              </h3>
              <CarbonWireframeTree
                level={contributions.carbonTreeLevel}
                size="md"
                className="min-h-[220px]"
              />
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-void-muted">
                    {t("bandwidthSaved")}
                  </p>
                  <p className="void-display text-sm text-void-green void-glow-text">
                    {contributions.bandwidthGb.toLocaleString()} GB
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-void-muted">
                    {t("carbonOffset")}
                  </p>
                  <p className="void-display text-sm text-void-green void-glow-text">
                    {contributions.carbonOffsetKg} KG CO₂
                  </p>
                </div>
              </div>
              <p className="mt-3 text-center text-[10px] uppercase tracking-wider text-void-muted">
                {t("carbonTreeLevel")}: {contributions.carbonTreeLevel}/10
              </p>
            </div>

            {/* Level contributors */}
            <div className="rounded-xl border border-void-green/20 bg-void-black/50 p-4">
              <h3 className="void-display mb-4 text-xs tracking-[0.18em] text-void-green">
                {t("levelContributors")}
              </h3>
              <ul className="space-y-3">
                {metrics.map((metric) => (
                  <li key={metric.key}>
                    <div className="mb-1 flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider">
                      <span className="text-void-muted">{metric.label}</span>
                      <span className="shrink-0 font-medium text-void-green">{metric.display}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-void-black/80">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-void-green/50 to-void-green shadow-[0_0_6px_rgba(0,255,153,0.4)]"
                        style={{ width: `${metric.progress}%` }}
                      />
                    </div>
                    <p className="mt-0.5 text-right text-[9px] text-void-muted">
                      {metric.progress}% {t("contributionShare")}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t border-void-green/15 pt-4">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-void-muted">
                  <span>{t("protectionDays")}</span>
                  <span className="text-void-green">{contributions.protectionDays} {t("days")}</span>
                </div>
                {player.nextLevelProgress != null && (
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-[10px] uppercase tracking-wider text-void-muted">
                      <span>{t("nextLevel")}</span>
                      <span className="text-void-green">{player.nextLevelProgress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-void-black/80">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-void-green/60 to-void-green"
                        style={{ width: `${player.nextLevelProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
