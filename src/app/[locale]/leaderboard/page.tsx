"use client";

import { useTranslations } from "next-intl";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidButton } from "@/components/ui/VoidButton";
import { VoidPageTitle } from "@/components/ui/VoidPageTitle";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const CONTRIBUTORS = [
  {
    name: "Klaus M.",
    code: "DE",
    handle: "voidman_klaus",
    level: 4,
    nextLevel: 5,
    progress: 72,
    flag: "🇩🇪",
  },
  {
    name: "Yuki T.",
    code: "JP",
    handle: "cyber_yuki",
    level: 5,
    nextLevel: 6,
    progress: 58,
    flag: "🇯🇵",
  },
  {
    name: "Sarah D.",
    code: "US",
    handle: "Sarah_Dev",
    level: 38,
    nextLevel: 39,
    progress: 85,
    flag: "🇺🇸",
  },
  {
    name: "James W.",
    code: "UK",
    handle: "net_shield_uk",
    level: 12,
    nextLevel: 13,
    progress: 44,
    flag: "🇬🇧",
  },
  {
    name: "Ahmed K.",
    code: "AE",
    handle: "void_guard_ae",
    level: 7,
    nextLevel: 8,
    progress: 63,
    flag: "🇦🇪",
  },
];

export default function LeaderboardPage() {
  const t = useTranslations("leaderboard");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <VoidPageTitle subtitle={t("pageSubtitle")}>{t("pageTitle")}</VoidPageTitle>

      <VoidPanel glow="strong" className="overflow-hidden">
        <h2 className="void-section-title mb-6 text-center text-base tracking-[0.25em]">
          {t("communityContributors")}
        </h2>

        <div className="grid gap-8 lg:grid-cols-[200px_1fr_280px]">
          {/* Badge column */}
          <div className="hidden flex-col items-center gap-4 lg:flex">
            <div className="flex h-36 w-32 flex-col items-center justify-center rounded-xl border border-void-green/40 bg-gradient-to-b from-void-green-muted to-void-black shadow-[0_0_30px_rgba(0,255,153,0.2)]">
              <span className="text-2xl">🛡️</span>
              <span className="void-display mt-2 text-xs text-void-green">Level 4</span>
            </div>
            {[4, 5, 6].map((lvl) => (
              <div
                key={lvl}
                className="flex h-12 w-24 items-center justify-center rounded-lg border border-void-green/20 bg-void-black/60 text-xs text-void-text-mint"
              >
                Level {lvl}
              </div>
            ))}
          </div>

          {/* Contributors list */}
          <div className="space-y-3">
            {CONTRIBUTORS.map((user) => (
              <div
                key={user.handle}
                className="flex flex-col gap-3 rounded-lg border border-void-green/15 bg-void-black/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-void-green/30 bg-void-panel text-lg">
                    👤
                  </div>
                  <span className="text-lg">{user.flag}</span>
                  <div>
                    <p className="text-sm font-medium text-void-text-mint">
                      {user.name} ({user.code}) — {user.handle}
                    </p>
                  </div>
                </div>

                <div className="min-w-[200px] sm:w-64">
                  <div className="flex justify-between text-[10px] text-void-muted">
                    <span>{t("nextLevel")}</span>
                    <span className="text-void-green">Level {user.nextLevel}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-void-green-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-void-green-dim to-void-green shadow-[0_0_8px_rgba(0,255,153,0.6)]"
                      style={{ width: `${user.progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-void-muted">{t("tierGoal")}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats sidebar */}
          <div className="hidden space-y-4 lg:block">
            <VoidPanel>
              <p className="void-section-title text-[10px]">{t("dataBlocked")}</p>
              <p className="void-display mt-2 text-xl text-void-green void-glow-text">
                30,000
              </p>
            </VoidPanel>
            <VoidPanel>
              <p className="void-section-title text-[10px]">{t("adsBlocked")}</p>
              <p className="void-display mt-2 text-xl text-void-green void-glow-text">
                1.5M+
              </p>
            </VoidPanel>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/signup">
            <VoidButton>{t("joinElite")}</VoidButton>
          </Link>
          <p className="mt-3 text-xs text-void-muted">{t("signupNote")}</p>
        </div>
      </VoidPanel>

      {/* Top player cards */}
      <div className="mt-12">
        <LeaderboardCards />
      </div>
    </div>
  );
}

const TOP_PLAYERS = [
  {
    rank: 1,
    title: "GRAND GUARDIAN",
    username: "VOID_CHAMPION_78",
    level: 110,
    country: "Germany",
    flag: "🇩🇪",
    ads: "1.5M",
    donated: "300,000",
    highlight: true,
  },
  {
    rank: 2,
    title: "CYBER SENTRY",
    username: "Cyber_Sentry",
    level: 105,
    country: "Japan",
    flag: "🇯🇵",
    ads: "1.2M",
    donated: "250,000",
  },
  {
    rank: 3,
    title: "TECH SENTINEL",
    username: "Tech_Sentinel",
    level: 101,
    country: "USA",
    flag: "🇺🇸",
    ads: "1.1M",
    donated: "210,000",
  },
];

function LeaderboardCards() {
  const t = useTranslations("leaderboard");

  return (
    <div className="flex flex-wrap items-end justify-center gap-4">
      {TOP_PLAYERS.map((player) => (
        <div
          key={player.rank}
          className={cn(
            "void-glow-border flex w-[180px] flex-col items-center rounded-xl bg-void-black/70 p-4 sm:w-[200px]",
            player.highlight &&
              "void-glow-border-strong w-[220px] scale-105 sm:w-[240px]",
          )}
        >
          <p className="void-display text-[10px] text-void-green">
            Rank #{player.rank} — {player.title}
          </p>
          <div className="my-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-void-green bg-void-panel text-2xl shadow-[0_0_20px_rgba(0,255,153,0.3)]">
            🛡️
          </div>
          <p className="text-xs text-void-muted">USERNAME: {player.username}</p>
          <p className="void-display mt-2 text-lg text-void-green">
            Level {player.level}
          </p>
          <p className="mt-1 text-xs text-void-text-mint">
            {player.flag} {player.country}
          </p>
          <div className="mt-3 w-full space-y-1 text-[10px] text-void-muted">
            <div className="flex justify-between">
              <span>{t("adsBlockedLabel")}</span>
              <span className="text-void-green">{player.ads}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("donated")}</span>
              <span className="text-void-green">{player.donated}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
