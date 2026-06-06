"use client";

import { useTranslations } from "next-intl";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidButton } from "@/components/ui/VoidButton";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const LEADERBOARD = [
  {
    rank: 1,
    username: "Void_Reclaimer_01",
    level: 110,
    country: "DE",
    adsBlocked: "1.5M",
    donated: "300,000",
    highlight: true,
  },
  {
    rank: 2,
    username: "Cyber_Sentry",
    level: 105,
    country: "JP",
    adsBlocked: "1.2M",
    donated: "250,000",
  },
  {
    rank: 3,
    username: "Tech_Sentinel",
    level: 101,
    country: "US",
    adsBlocked: "1.1M",
    donated: "210,000",
  },
  {
    rank: 4,
    username: "Digital_Guardian",
    level: 98,
    country: "UK",
    adsBlocked: "980K",
    donated: "180,000",
  },
  {
    rank: 5,
    username: "Net_Shield_AE",
    level: 95,
    country: "AE",
    adsBlocked: "870K",
    donated: "150,000",
  },
];

const FLAG: Record<string, string> = {
  DE: "🇩🇪",
  JP: "🇯🇵",
  US: "🇺🇸",
  UK: "🇬🇧",
  AE: "🇦🇪",
};

export function LeaderboardPreview() {
  const t = useTranslations("leaderboard");

  return (
    <VoidPanel>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold uppercase tracking-wider text-void-green void-glow-text sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-2 text-sm text-void-muted">{t("subtitle")}</p>
      </div>

      <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-4">
        {LEADERBOARD.map((player) => (
          <div
            key={player.rank}
            className={cn(
              "void-glow-border flex flex-col items-center rounded-2xl bg-void-black/60 p-4 transition-transform hover:scale-105",
              player.highlight
                ? "w-full max-w-[200px] sm:max-w-[220px] scale-100 sm:scale-110"
                : "w-[140px] sm:w-[160px] opacity-90",
            )}
          >
            <div
              className={cn(
                "mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-void-green bg-void-panel text-2xl",
                player.highlight && "h-20 w-20 border-void-green shadow-[0_0_20px_rgba(57,255,20,0.4)]",
              )}
            >
              🛡️
            </div>
            <span className="text-xs text-void-muted">
              {t("rank")} #{player.rank}
            </span>
            <p className="mt-1 text-sm font-bold text-void-green">
              {player.username}
            </p>
            <p className="text-xs text-void-muted">
              {FLAG[player.country]} {t("level")} {player.level}
            </p>
            <div className="mt-2 space-y-0.5 text-center text-[10px] text-void-muted">
              <p>{player.adsBlocked} ads</p>
              <p>
                {t("donated")}: {player.donated}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/signup">
          <VoidButton>{t("joinElite")}</VoidButton>
        </Link>
      </div>
    </VoidPanel>
  );
}
