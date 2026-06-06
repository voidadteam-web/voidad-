"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { StatusBar } from "@/components/layout/StatusBar";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidToggle } from "@/components/ui/VoidToggle";
import { VoidButton } from "@/components/ui/VoidButton";
import { VoidPageTitle } from "@/components/ui/VoidPageTitle";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { CountrySelect } from "@/components/profile/CountrySelect";
import { useUser } from "@/hooks/useUser";
import { useProfile } from "@/hooks/useProfile";
import { useUserSettings } from "@/hooks/useUserSettings";
import { Link } from "@/i18n/navigation";
import { Shield, Heart } from "lucide-react";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const { user, loading: authLoading } = useUser();
  const { profile, loading: profileLoading, updateProfile, uploadAvatar } =
    useProfile();
  const {
    settings: userSettings,
    loading: settingsLoading,
    updateSettings,
  } = useUserSettings();

  const fileRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [bio, setBio] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [hideLeaderboard, setHideLeaderboard] = useState(false);
  const [charityAlerts, setCharityAlerts] = useState(true);
  const [levelUp, setLevelUp] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [enhancedBlocking, setEnhancedBlocking] = useState(false);
  const [dataCompression, setDataCompression] = useState(false);
  const [zeroDayDiscovery, setZeroDayDiscovery] = useState(false);
  const [shareVoidpoints, setShareVoidpoints] = useState(false);
  const [showLeaderboardRank, setShowLeaderboardRank] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name ?? "");
    setUsername(profile.username ?? "");
    setCountryCode(profile.country_code ?? "");
    setBio(profile.bio ?? "");
    setIsPublic(profile.is_public);
    setHideLeaderboard(profile.hide_leaderboard);
  }, [profile]);

  useEffect(() => {
    if (!userSettings) return;
    setCharityAlerts(userSettings.notify_charity);
    setLevelUp(userSettings.notify_level_up);
    setTwoFactor(userSettings.two_factor_enabled);
    setEnhancedBlocking(userSettings.enhanced_ad_blocking);
    setDataCompression(userSettings.data_compression);
    setZeroDayDiscovery(userSettings.zero_day_discovery);
    setShareVoidpoints(userSettings.share_voidpoints);
    setShowLeaderboardRank(userSettings.show_leaderboard_rank);
  }, [userSettings]);

  const loading = authLoading || profileLoading || settingsLoading;

  const resolvedName =
    displayName ||
    profile?.display_name ||
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "Guest";

  const voidpoints = profile?.voidpoints_total ?? 0;
  const level = profile?.level ?? 0;
  const communityRank = voidpoints > 0 ? t("ranked") : t("unranked");

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);
    try {
      await uploadAvatar(file);
      setMessage(t("avatarSaved"));
    } catch {
      setMessage(t("avatarFailed"));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      await Promise.all([
        updateProfile({
          display_name: displayName.trim() || null,
          username: username.trim() || null,
          country_code: countryCode || null,
          bio: bio.trim() || null,
          is_public: isPublic,
          hide_leaderboard: hideLeaderboard,
        }),
        updateSettings({
          notify_charity: charityAlerts,
          notify_level_up: levelUp,
          two_factor_enabled: twoFactor,
          enhanced_ad_blocking: enhancedBlocking,
          data_compression: dataCompression,
          zero_day_discovery: zeroDayDiscovery,
          share_voidpoints: shareVoidpoints,
          show_leaderboard_rank: showLeaderboardRank,
        }),
      ]);
      setMessage(t("saved"));
    } catch {
      setMessage(t("saveFailed"));
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setUsername(profile.username ?? "");
      setCountryCode(profile.country_code ?? "");
      setBio(profile.bio ?? "");
      setIsPublic(profile.is_public);
      setHideLeaderboard(profile.hide_leaderboard);
    }
    if (userSettings) {
      setCharityAlerts(userSettings.notify_charity);
      setLevelUp(userSettings.notify_level_up);
      setTwoFactor(userSettings.two_factor_enabled);
      setEnhancedBlocking(userSettings.enhanced_ad_blocking);
      setDataCompression(userSettings.data_compression);
      setZeroDayDiscovery(userSettings.zero_day_discovery);
      setShareVoidpoints(userSettings.share_voidpoints);
      setShowLeaderboardRank(userSettings.show_leaderboard_rank);
    }
    setMessage(null);
  }

  return (
    <>
      <StatusBar />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <VoidPageTitle>{t("title")}</VoidPageTitle>

        {!loading && !user ? (
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
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left — profile photo */}
              <div className="flex flex-col items-center text-center">
                <ProfileAvatar
                  name={resolvedName}
                  avatarUrl={profile?.avatar_url}
                  size="lg"
                />
                <p className="void-display mt-4 text-xl text-void-green void-glow-text">
                  {resolvedName}
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <VoidButton
                  variant="secondary"
                  className="mt-4 w-full text-xs"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                >
                  {uploading ? t("uploading") : t("changeAvatar")}
                </VoidButton>
                <div
                  className={`mt-6 flex h-16 w-16 items-center justify-center rounded-lg border border-void-green/30 text-2xl ${
                    level > 0 ? "opacity-100" : "opacity-40"
                  }`}
                >
                  🐉
                </div>
                <p className="mt-2 text-xs text-void-green">
                  {level > 0 ? t("levelBadge", { level }) : t("levelStarter")}
                </p>
              </div>

              {/* Middle — profile fields */}
              <div className="space-y-4">
                <VoidPanel title={t("yourProfile")}>
                  <div className="space-y-3">
                    <SettingsInput
                      label={t("usernameVisible")}
                      value={displayName}
                      onChange={setDisplayName}
                      placeholder={t("usernamePlaceholder")}
                    />
                    <SettingsInput
                      label={t("username")}
                      value={username}
                      onChange={setUsername}
                      placeholder="@username"
                    />
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-void-muted">
                        {t("country")}
                      </label>
                      <CountrySelect
                        value={countryCode}
                        onChange={setCountryCode}
                        placeholder={t("selectCountry")}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-void-muted">
                        {t("bio")}
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        placeholder={t("bioPlaceholder")}
                        className="w-full resize-none rounded-lg border border-void-green/20 bg-void-black/60 px-3 py-2.5 text-sm text-void-text-mint outline-none focus:border-void-green/50"
                      />
                    </div>
                  </div>
                </VoidPanel>

                <VoidPanel title={t("privacySecurity")}>
                  <div className="space-y-2">
                    <SettingsField label={t("password")} value="••••••••" />
                    <VoidToggle
                      label={t("twoFactor")}
                      checked={twoFactor}
                      onChange={() => setTwoFactor(!twoFactor)}
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
              </div>

              {/* Right — VoidPoints & community */}
              <div className="space-y-4">
                <VoidPanel title={t("voidpointsCommunity")}>
                  <div className="space-y-2 text-sm">
                    <StatRow label={t("voidpoints")} value={voidpoints.toLocaleString()} />
                    <StatRow label={t("level")} value={String(level)} />
                    <StatRow label={t("communityRank")} value={communityRank} />
                  </div>
                  <div className="mt-4 space-y-2">
                    <VoidToggle
                      label={t("enhancedBlocking")}
                      checked={enhancedBlocking}
                      onChange={() => setEnhancedBlocking(!enhancedBlocking)}
                    />
                    <VoidToggle
                      label={t("dataCompression")}
                      checked={dataCompression}
                      onChange={() => setDataCompression(!dataCompression)}
                    />
                    <VoidToggle
                      label={t("zeroDayDiscovery")}
                      checked={zeroDayDiscovery}
                      onChange={() => setZeroDayDiscovery(!zeroDayDiscovery)}
                    />
                  </div>
                  <Link href="/voidpoints" className="mt-4 block">
                    <VoidButton variant="secondary" className="w-full text-xs">
                      <Heart className="h-3.5 w-3.5" />
                      {t("viewCharities")}
                    </VoidButton>
                  </Link>
                </VoidPanel>

                <VoidPanel title={t("notifications")}>
                  <div className="space-y-2">
                    <VoidToggle
                      label={t("charityAlerts")}
                      checked={charityAlerts}
                      onChange={() => setCharityAlerts(!charityAlerts)}
                    />
                    <VoidToggle
                      label={t("levelUpAlerts")}
                      checked={levelUp}
                      onChange={() => setLevelUp(!levelUp)}
                    />
                  </div>
                </VoidPanel>

                <VoidPanel title={t("community")}>
                  <div className="space-y-2">
                    <VoidToggle
                      label={t("showLeaderboardRank")}
                      checked={showLeaderboardRank}
                      onChange={() => setShowLeaderboardRank(!showLeaderboardRank)}
                    />
                    <VoidToggle
                      label={t("shareVoidpoints")}
                      checked={shareVoidpoints}
                      onChange={() => setShareVoidpoints(!shareVoidpoints)}
                    />
                    <VoidToggle
                      label={t("profilePublic")}
                      checked={isPublic}
                      onChange={() => setIsPublic(!isPublic)}
                    />
                    <VoidToggle
                      label={t("hideLeaderboard")}
                      checked={hideLeaderboard}
                      onChange={() => setHideLeaderboard(!hideLeaderboard)}
                    />
                  </div>
                </VoidPanel>
              </div>
            </div>

            {message && (
              <p className="mt-6 text-center text-sm text-void-green">{message}</p>
            )}

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <VoidButton
                className="min-w-[200px]"
                disabled={saving}
                onClick={handleSave}
              >
                {saving ? t("saving") : t("saveChanges")}
              </VoidButton>
              <VoidButton variant="ghost" onClick={handleCancel}>
                {t("cancel")}
              </VoidButton>
            </div>
          </VoidPanel>
        )}
      </div>
    </>
  );
}

function SettingsInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-void-muted">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-void-green/20 bg-void-black/60 px-3 py-2.5 text-sm text-void-text-mint outline-none focus:border-void-green/50"
      />
    </div>
  );
}

function SettingsField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-void-green/15 bg-void-black/40 px-3 py-2.5">
      <div>
        <p className="text-[10px] uppercase tracking-wider text-void-muted">{label}</p>
        <p className="text-sm text-void-text-mint">{value}</p>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-void-green/15 bg-void-black/40 px-3 py-2">
      <span className="text-xs text-void-muted">{label}</span>
      <span className="text-sm font-medium text-void-green">{value}</span>
    </div>
  );
}
