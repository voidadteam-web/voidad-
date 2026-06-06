"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidButton } from "@/components/ui/VoidButton";
import { VoidStat } from "@/components/ui/VoidStat";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { CountryBadge } from "@/components/profile/CountrySelect";
import { LevelMilitaryRank, levelBadgeTitle } from "@/components/leaderboard/LevelMilitaryRank";
import { LevelProgressBridge } from "@/components/dashboard/LevelProgressBridge";
import { useUserStats } from "@/hooks/useUserStats";
import { Heart } from "lucide-react";

export function DashboardProfile() {
  const t = useTranslations("dashboard");
  const { user, profile, stats, loading, refetch } = useUserStats();

  useEffect(() => {
    const interval = window.setInterval(() => void refetch(), 5000);
    return () => window.clearInterval(interval);
  }, [refetch]);

  if (loading) {
    return (
      <VoidPanel title={t("profile")}>
        <p className="text-sm text-void-muted">{t("loading")}</p>
      </VoidPanel>
    );
  }

  if (!user) {
    return (
      <VoidPanel title={t("profile")}>
        <p className="mb-4 text-sm text-void-muted">{t("guestPrompt")}</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/login">
            <VoidButton className="py-2 text-xs">{t("signIn")}</VoidButton>
          </Link>
          <Link href="/signup">
            <VoidButton variant="ghost" className="py-2 text-xs">
              {t("createAccount")}
            </VoidButton>
          </Link>
        </div>
      </VoidPanel>
    );
  }

  const name =
    profile?.display_name ??
    user.user_metadata?.display_name ??
    user.email?.split("@")[0] ??
    "Void Guardian";

  const level = stats.level;
  const donateable = Math.max(0, stats.voidpoints - stats.voidpointsDonated);

  return (
    <VoidPanel title={t("profile")}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <ProfileAvatar name={name} avatarUrl={profile?.avatar_url} size="sm" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-void-text">{name}</p>
              <CountryBadge code={profile?.country_code} />
            </div>
            <p className="text-xs text-void-muted">{user.email}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <LevelMilitaryRank level={Math.max(level, 1)} size="sm" />
          <p className="text-center text-[11px] text-void-green">
            {level > 0
              ? `${levelBadgeTitle(level)} — ${t("level")} ${level}`
              : t("levelStarter")}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <VoidStat label={t("voidpoints")} value={stats.voidpoints} />
        <VoidStat label={t("level")} value={level} />
        <VoidStat label={t("adsBlocked")} value={stats.adsBlocked} />
        <VoidStat label={t("trackersBlocked")} value={stats.trackersBlocked} />
        <VoidStat label={t("donatedPoints")} value={stats.voidpointsDonated} />
        <VoidStat label={t("donateBalance")} value={donateable} />
      </div>

      <LevelProgressBridge level={level} voidpoints={stats.voidpoints} />

      <p className="mt-3 text-[11px] leading-relaxed text-void-muted">{t("donateHint")}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/voidpoints">
          <VoidButton variant="secondary" className="py-2 text-xs">
            <Heart className="h-3.5 w-3.5" />
            {t("quickDonate")}
          </VoidButton>
        </Link>
        <Link href="/voidpoints">
          <VoidButton variant="ghost" className="py-2 text-xs">
            {t("viewCharities")}
          </VoidButton>
        </Link>
      </div>
    </VoidPanel>
  );
}
