"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { VoidButton } from "@/components/ui/VoidButton";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { HorizontalScrollStrip } from "@/components/ui/HorizontalScrollStrip";
import { VoidRankShield } from "@/components/leaderboard/shields/VoidRankShield";
import { TOP_CONTRIBUTORS } from "@/components/leaderboard/guardians-data";
import { countryFlag } from "@/lib/countries";
import {
  MILITARY_RANKS,
  MAX_MILITARY_LEVEL,
  type MilitaryRank,
} from "@/lib/military-ranks";
import { shieldTierForLevel, SHIELD_TIER_COUNT, SHIELD_TIER_NAMES, type ShieldTier } from "@/lib/shield-ranks";
import { cn } from "@/lib/utils";

/** Full ranks page — all 57 military ranks + community contributors (mockup layout) */
export function AllRanksLeaderboard() {
  const t = useTranslations("leaderboard");

  const ranksDescending = [...MILITARY_RANKS].sort((a, b) => b.level - a.level);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="void-display void-glow-text text-2xl tracking-[0.14em] text-void-green sm:text-3xl md:text-4xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-2 text-sm uppercase tracking-[0.2em] text-void-text-mint sm:text-base">
          {t("pageSubtitle")}
        </p>
      </div>

      <VoidPanel glow="strong" className="overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Community contributors */}
          <div>
            <h2 className="void-display mb-4 text-sm tracking-[0.18em] text-void-green sm:text-base">
              {t("communityContributors")}
            </h2>
            <ul className="space-y-3">
              {TOP_CONTRIBUTORS.map((player) => (
                <li
                  key={player.rank}
                  className="flex items-center gap-3 rounded-lg border border-void-green/15 bg-void-black/50 px-3 py-2.5"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-void-green/35">
                    <Image
                      src={player.avatarUrl}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <span className="text-lg leading-none">{countryFlag(player.countryCode)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-void-text-mint">
                      {player.username}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-void-muted">
                      {t("rank")} #{player.rank} · {t("level")} {player.level}
                    </p>
                  </div>
                  <VoidRankShield tier={shieldTierForLevel(player.level)} size={36} />
                </li>
              ))}
            </ul>
          </div>

          {/* Next level progress */}
          <div className="space-y-4">
            <h2 className="void-display text-sm tracking-[0.18em] text-void-green sm:text-base">
              {t("nextLevel")}
            </h2>
            {TOP_CONTRIBUTORS.slice(0, 3).map((player) => (
              <div key={player.rank} className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-void-muted">
                  <span className="truncate pr-2">{player.username}</span>
                  <span className="text-void-green">{player.nextLevelProgress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-void-black/80">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-void-green/60 to-void-green shadow-[0_0_8px_rgba(0,255,153,0.5)]"
                    style={{ width: `${player.nextLevelProgress}%` }}
                  />
                </div>
              </div>
            ))}
            <p className="border-t border-void-green/15 pt-4 text-[10px] uppercase leading-relaxed tracking-wider text-void-muted">
              {t("tierGoal")}
            </p>
          </div>
        </div>

        {/* All 57 military ranks */}
        <div className="mt-10 border-t border-void-green/15 pt-8">
          <h2 className="void-display mb-5 text-center text-sm tracking-[0.18em] text-void-green sm:text-base">
            {t("allRanksTitle")}
          </h2>
          <HorizontalScrollStrip hint={t("scrollAllRanks")}>
            {ranksDescending.map((rank) => (
              <MilitaryRankBadge key={rank.index} rank={rank} levelLabel={t("level")} />
            ))}
          </HorizontalScrollStrip>
        </div>

        {/* 10 cyber shield tiers */}
        <div className="mt-10 border-t border-void-green/15 pt-8">
          <h2 className="void-display mb-5 text-center text-sm tracking-[0.18em] text-void-green sm:text-base">
            {t("shieldTiersTitle")}
          </h2>
          <HorizontalScrollStrip hint={t("scrollShieldTiers")}>
            {Array.from({ length: SHIELD_TIER_COUNT }, (_, tier) => {
              const shieldTier = tier as ShieldTier;
              const level = Math.round(
                1 + (tier / (SHIELD_TIER_COUNT - 1)) * (MAX_MILITARY_LEVEL - 1),
              );
              return (
                <div
                  key={tier}
                  className="flex w-[100px] shrink-0 snap-start flex-col items-center gap-2 rounded-lg border border-void-green/15 bg-void-black/40 px-3 py-3 sm:w-[110px]"
                >
                  <VoidRankShield tier={shieldTier} size={64} />
                  <p className="void-display text-[10px] tracking-wider text-void-green">
                    {t("level")} {level}
                  </p>
                  <p className="text-center text-[8px] uppercase leading-tight tracking-wide text-void-muted">
                    {SHIELD_TIER_NAMES[shieldTier]}
                  </p>
                </div>
              );
            })}
          </HorizontalScrollStrip>
        </div>
      </VoidPanel>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/signup">
          <VoidButton className="min-w-[240px]">
            {t("joinElite")}
            <ChevronRight className="h-4 w-4" />
          </VoidButton>
        </Link>
        <p className="text-center text-xs text-void-muted">{t("signupNote")}</p>
      </div>
    </div>
  );
}

function MilitaryRankBadge({
  rank,
  levelLabel,
}: {
  rank: MilitaryRank;
  levelLabel: string;
}) {
  return (
    <article
      className={cn(
        "flex w-[88px] shrink-0 snap-start flex-col items-center gap-2 rounded-lg",
        "border border-void-green/20 bg-void-black/60 px-2 py-3 sm:w-[96px]",
      )}
    >
      <Image
        src={rank.image}
        alt={rank.name}
        width={52}
        height={74}
        unoptimized
        className="h-[74px] w-[52px] object-contain object-center drop-shadow-[0_0_8px_rgba(0,255,153,0.25)]"
      />
      <p className="void-display text-center text-[9px] leading-tight tracking-wide text-void-green">
        {levelLabel} {rank.level}
      </p>
      <p className="line-clamp-2 text-center text-[8px] uppercase leading-tight tracking-wide text-void-muted">
        {rank.grade}
      </p>
      <p className="text-[8px] uppercase text-void-text-mint/80">{rank.metal}</p>
    </article>
  );
}
