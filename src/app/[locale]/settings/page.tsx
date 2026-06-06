"use client";

import { useTranslations } from "next-intl";
import { StatusBar } from "@/components/layout/StatusBar";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidToggle } from "@/components/ui/VoidToggle";
import { VoidButton } from "@/components/ui/VoidButton";
import { VoidPageTitle } from "@/components/ui/VoidPageTitle";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useProfile } from "@/hooks/useProfile";
import { Link } from "@/i18n/navigation";
import { User, Shield, Globe } from "lucide-react";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const { user, loading: authLoading } = useUser();
  const { profile, loading: profileLoading } = useProfile();
  const [settings, setSettings] = useState({
    charityAlerts: true,
    levelUp: true,
    profilePublic: true,
    hideLeaderboard: false,
    twoFactor: false,
    notifications: true,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));

  const displayName =
    profile?.display_name ??
    user?.user_metadata?.display_name ??
    user?.email?.split("@")[0] ??
    "Guest";

  return (
    <>
      <StatusBar />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <VoidPageTitle>{t("title")}</VoidPageTitle>

        {!authLoading && !user ? (
          <VoidPanel className="text-center">
            <p className="text-void-text-mint">{t("guestPrompt")}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/login">
                <VoidButton variant="secondary">{t("signIn")}</VoidButton>
              </Link>
              <Link href="/signup">
                <VoidButton>{t("createAccount")}</VoidButton>
              </Link>
            </div>
          </VoidPanel>
        ) : (
          <VoidPanel glow="strong">
            <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
              {/* Profile sidebar */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-void-green bg-void-panel shadow-[0_0_30px_rgba(0,255,153,0.25)]">
                  <User className="h-12 w-12 text-void-green" />
                </div>
                <p className="void-display mt-4 text-xl text-void-green void-glow-text">
                  {displayName}
                </p>
                {!profileLoading && profile && (
                  <>
                    <p className="mt-2 text-sm text-void-text-mint">
                      {t("voidpoints")}:{" "}
                      <span className="text-void-green">
                        {profile.voidpoints_total?.toLocaleString() ?? "0"}
                      </span>
                    </p>
                    <p className="text-sm text-void-muted">
                      {t("level")}: {profile.level ?? 1}
                    </p>
                  </>
                )}
                <VoidButton variant="secondary" className="mt-4 w-full text-xs">
                  {t("changeAvatar")}
                </VoidButton>
                <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-lg border border-void-green/30 text-2xl">
                  🐉
                </div>
                <p className="mt-2 text-xs text-void-green">Level {profile?.level ?? 38}</p>
              </div>

              {/* Settings grid */}
              <div className="space-y-6">
                <VoidPanel title={t("accountDetails")}>
                  <div className="space-y-3">
                    <SettingsField label={t("username")} value={displayName} />
                    <SettingsField
                      label={t("email")}
                      value={user?.email ?? "—"}
                    />
                    <SettingsField label={t("country")} value="🇩🇪 Germany" />
                  </div>
                </VoidPanel>

                <VoidPanel title={t("privacySecurity")}>
                  <div className="space-y-2">
                    <VoidToggle
                      label={t("twoFactor")}
                      checked={settings.twoFactor}
                      onChange={() => toggle("twoFactor")}
                    />
                    <div className="flex items-center gap-2 rounded-lg border border-void-green/15 bg-void-black/40 px-3 py-2.5">
                      <Shield className="h-4 w-4 text-void-green" />
                      <span className="text-sm text-void-text-mint">
                        {t("zeroLog")}{" "}
                        <span className="text-xs text-void-green">[CERTIFIED]</span>
                      </span>
                    </div>
                  </div>
                </VoidPanel>

                <VoidPanel title={t("notifications")}>
                  <div className="space-y-2">
                    <VoidToggle
                      label={t("charityAlerts")}
                      checked={settings.charityAlerts}
                      onChange={() => toggle("charityAlerts")}
                    />
                    <VoidToggle
                      label={t("levelUpAlerts")}
                      checked={settings.levelUp}
                      onChange={() => toggle("levelUp")}
                    />
                  </div>
                </VoidPanel>

                <VoidPanel title={t("community")}>
                  <div className="space-y-2">
                    <VoidToggle
                      label={t("profilePublic")}
                      checked={settings.profilePublic}
                      onChange={() => toggle("profilePublic")}
                    />
                    <VoidToggle
                      label={t("hideLeaderboard")}
                      checked={settings.hideLeaderboard}
                      onChange={() => toggle("hideLeaderboard")}
                    />
                    <div className="flex items-center gap-2 rounded-lg border border-void-green/15 bg-void-black/40 px-3 py-2.5">
                      <Globe className="h-4 w-4 text-void-green" />
                      <span className="text-sm text-void-text-mint">
                        {t("language")}: English (Global)
                      </span>
                    </div>
                  </div>
                </VoidPanel>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <VoidButton className="min-w-[200px]">{t("saveChanges")}</VoidButton>
              <VoidButton variant="ghost">{t("cancel")}</VoidButton>
            </div>
          </VoidPanel>
        )}
      </div>
    </>
  );
}

function SettingsField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-void-green/15 bg-void-black/40 px-3 py-2.5">
      <div>
        <p className="text-[10px] uppercase tracking-wider text-void-muted">{label}</p>
        <p className="text-sm text-void-text-mint">{value}</p>
      </div>
      <VoidButton variant="ghost" className="py-1 text-[10px]">
        EDIT
      </VoidButton>
    </div>
  );
}
