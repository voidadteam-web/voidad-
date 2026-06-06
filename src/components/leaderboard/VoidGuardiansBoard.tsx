"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { LevelMilitaryRank } from "@/components/leaderboard/LevelMilitaryRank";
import {
  getLeaderboardDisplayOrder,
  type VoidGuardian,
} from "@/components/leaderboard/guardians-data";
import { countryFlag } from "@/lib/countries";
import { cn } from "@/lib/utils";

type VoidGuardianCardProps = {
  player: VoidGuardian;
  labels: {
    rank: string;
    username: string;
    level: string;
    country: string;
    adsBlocked: string;
    donated: string;
  };
};

export function VoidGuardianCard({ player, labels }: VoidGuardianCardProps) {
  const featured = player.rank === 1;

  return (
    <article
      className={cn(
        "void-glow-border flex shrink-0 flex-col overflow-visible rounded-xl bg-void-black/75 backdrop-blur-sm transition-transform",
        featured
          ? "void-glow-border-strong z-10 w-[200px] scale-105 sm:w-[220px]"
          : "w-[160px] shrink-0 opacity-95 sm:w-[175px]",
      )}
    >
      <header className="border-b border-void-green/20 px-3 py-2.5 text-center">
        <p className="void-display text-[9px] leading-tight tracking-[0.12em] text-void-green sm:text-[10px]">
          {labels.rank} #{player.rank} — {player.title}
        </p>
      </header>

      <div className={cn("p-3", featured && "px-4 pt-4")}>
        <div
          className={cn(
            "relative mx-auto overflow-hidden rounded-lg border border-void-green/35 bg-void-panel",
            featured ? "aspect-[4/5] w-full" : "aspect-square w-full",
          )}
        >
          <Image
            src={player.avatarUrl}
            alt={player.username}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void-black/50 via-transparent to-transparent" />
        </div>
      </div>

      <div className={cn("flex flex-1 flex-col gap-2 px-3 pb-4", featured && "px-4 pb-5")}>
        <p className="text-[9px] uppercase tracking-wider text-void-muted sm:text-[10px]">
          {labels.username}:{" "}
          <span className="font-semibold normal-case text-void-text-mint">
            {player.username}
          </span>
        </p>

        <div className="flex min-w-0 items-center gap-1 overflow-visible leading-none">
          <LevelMilitaryRank
            level={player.level}
            size={featured ? "lg" : "md"}
          />
          <p
            className={cn(
              "void-display leading-none text-void-green void-glow-text",
              featured ? "text-xl sm:text-2xl" : "text-lg",
            )}
          >
            {labels.level}: {player.level}
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-void-text-mint sm:text-xs">
          <span className="text-base leading-none">{countryFlag(player.countryCode)}</span>
          <span className="uppercase tracking-wide text-void-muted">
            {labels.country}:{" "}
            <span className="normal-case text-void-text-mint">{player.countryName}</span>
          </span>
        </div>

        <div className="mt-auto space-y-1.5 border-t border-void-green/15 pt-3 text-[9px] uppercase tracking-wider text-void-muted sm:text-[10px]">
          <div className="flex items-center justify-between gap-2">
            <span>{labels.adsBlocked}:</span>
            <span className="void-display text-void-green">{player.adsBlocked}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>{labels.donated}:</span>
            <span className="void-display text-void-green">{player.donated}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

type VoidGuardiansBoardProps = {
  players?: VoidGuardian[];
  variant?: "full" | "preview";
  className?: string;
};

export function VoidGuardiansBoard({
  players,
  variant = "full",
  className,
}: VoidGuardiansBoardProps) {
  const t = useTranslations("leaderboard");

  const labels = {
    rank: t("rankLabel"),
    username: t("usernameLabel"),
    level: t("levelLabel"),
    country: t("countryLabel"),
    adsBlocked: t("adsBlockedLabel"),
    donated: t("donatedPoints"),
  };

  const list = getLeaderboardDisplayOrder(players ?? []);

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-8 text-center">
        <h1
          className={cn(
            "void-display void-glow-text text-void-green",
            variant === "full"
              ? "text-xl leading-snug tracking-[0.14em] sm:text-2xl md:text-3xl"
              : "void-page-title text-xl sm:text-2xl",
          )}
        >
          {t("fullTitle")}
          {variant === "full" && (
            <>
              <span className="mx-2 hidden text-void-green/60 sm:inline">:</span>
              <br className="sm:hidden" />
              <span className="mt-1 block text-lg tracking-[0.18em] text-void-green sm:mt-0 sm:inline sm:text-2xl md:text-3xl">
                {t("fullSubtitle")}
              </span>
            </>
          )}
        </h1>
        {variant === "preview" && (
          <p className="mt-2 text-sm text-void-text-mint">{t("subtitle")}</p>
        )}
        {variant === "full" && (
          <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.2em] text-void-muted sm:text-xs">
            <span className="text-void-green">{t("subNavFeatures")}</span>
            <span className="text-void-green/30">|</span>
            <span>{t("subNavLeaderboard")}</span>
            <span className="text-void-green/30">|</span>
            <span>{t("subNavVoidFeatures")}</span>
          </nav>
        )}
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-void-black/90 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-void-black/90 to-transparent" />
        <div className="flex items-end justify-start gap-2 overflow-x-auto pb-3 scroll-smooth sm:gap-3 [scrollbar-width:thin]">
          {list.map((player) => (
            <VoidGuardianCard key={player.rank} player={player} labels={labels} />
          ))}
        </div>
        <p className="mt-2 text-center text-[10px] uppercase tracking-widest text-void-muted">
          {t("scrollRanks")}
        </p>
      </div>
    </div>
  );
}
