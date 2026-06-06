"use client";

import { useLocale, useTranslations } from "next-intl";
import { LevelMilitaryRank } from "@/components/leaderboard/LevelMilitaryRank";
import {
  MAX_PLAYER_LEVEL,
  nextLevelProgress,
  voidpointsEarnedInLevelBand,
  voidpointsForLevel,
  voidpointsNeededForNextLevel,
} from "@/lib/levels";

type LevelProgressBridgeProps = {
  level: number;
  voidpoints: number;
};

/** Visual bridge: current level → progress gap → next level */
export function LevelProgressBridge({ level, voidpoints }: LevelProgressBridgeProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  if (level >= MAX_PLAYER_LEVEL) {
    return (
      <div className="mt-4 rounded-lg border border-void-green/20 bg-void-black/40 p-3 text-center">
        <p className="text-[11px] font-semibold text-void-green">{t("maxLevel")}</p>
      </div>
    );
  }

  const nextLevel = level + 1;
  const progress = nextLevelProgress(voidpoints, level);
  const bandTotal = voidpointsNeededForNextLevel(level);
  const bandEarned = voidpointsEarnedInLevelBand(voidpoints, level);
  const bandRemaining = Math.max(0, bandTotal - bandEarned);
  const currentThreshold = voidpointsForLevel(level);
  const nextThreshold = voidpointsForLevel(nextLevel);

  return (
    <div className="mt-4 rounded-lg border border-void-green/20 bg-void-black/40 p-3">
      <p className="mb-3 text-center text-[10px] uppercase tracking-wider text-void-muted">
        {t("levelBridgeTitle")}
      </p>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex w-14 shrink-0 flex-col items-center gap-1 sm:w-16">
          <LevelMilitaryRank level={Math.max(level, 1)} size="sm" />
          <span className="text-[10px] font-semibold text-void-green">
            {t("level")} {level}
          </span>
          <span className="font-mono text-[9px] text-void-muted">
            {currentThreshold.toLocaleString(locale)}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between text-[10px]">
            <span className="text-void-muted">{t("levelGap")}</span>
            <span className="font-semibold text-void-green">{progress}%</span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full border border-void-green/25 bg-void-black/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-void-green/70 to-void-green shadow-[0_0_10px_rgba(0,255,153,0.45)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-center text-[10px] text-void-muted">
            {t("levelBandProgress", {
              earned: bandEarned.toLocaleString(locale),
              total: bandTotal.toLocaleString(locale),
            })}
          </p>
        </div>

        <div className="flex w-14 shrink-0 flex-col items-center gap-1 sm:w-16">
          <LevelMilitaryRank level={nextLevel} size="sm" />
          <span className="text-[10px] font-semibold text-void-green">
            {t("level")} {nextLevel}
          </span>
          <span className="font-mono text-[9px] text-void-muted">
            {nextThreshold.toLocaleString(locale)}
          </span>
        </div>
      </div>

      <p className="mt-3 text-center text-[10px] text-void-muted">
        {t("pointsToNextLevel", {
          points: bandRemaining.toLocaleString(locale),
          level: nextLevel,
        })}
      </p>
    </div>
  );
}
