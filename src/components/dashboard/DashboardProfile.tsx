"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidButton } from "@/components/ui/VoidButton";
import { VoidStat } from "@/components/ui/VoidStat";
import { useProfile } from "@/hooks/useProfile";

export function DashboardProfile() {
  const t = useTranslations("dashboard");
  const { user, profile, loading } = useProfile();

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

  return (
    <VoidPanel title={t("profile")}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-void-green/40 bg-void-black/60 text-lg font-bold text-void-green">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-void-text">{name}</p>
          <p className="text-xs text-void-muted">{user.email}</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <VoidStat
          label={t("voidpoints")}
          value={profile?.voidpoints_total ?? 0}
        />
        <VoidStat label={t("level")} value={profile?.level ?? 1} />
        <VoidStat label={t("adsBlocked")} value={profile?.ads_blocked ?? 0} />
      </div>
    </VoidPanel>
  );
}
