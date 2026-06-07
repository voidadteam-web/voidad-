"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Baby,
  Ban,
  Dice5,
  Hash,
  Shield,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidToggle } from "@/components/ui/VoidToggle";
import { VoidButton } from "@/components/ui/VoidButton";
import {
  CHILD_PROFILE,
  STRICT_PROFILE,
  useProtectionSettings,
  type ProfileMode,
} from "@/hooks/useProtectionSettings";
import { cn } from "@/lib/utils";

const PROFILE_MODES: ProfileMode[] = ["default", "child", "strict"];

function parseKeywords(raw: string): string[] {
  return raw
    .split(/[,;\n]+/)
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k.length >= 3)
    .slice(0, 30);
}

export function FamilyFilterPanel() {
  const t = useTranslations("dashboard.familyFilters");
  const { settings, updateSettings, saving, loading } = useProtectionSettings();
  const [keywordDraft, setKeywordDraft] = useState("");
  const [localKeywords, setLocalKeywords] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setLocalKeywords(settings.blocked_keywords ?? []);
    setKeywordDraft("");
    setDirty(false);
  }, [settings]);

  const activeProfile = settings?.profile_mode ?? "default";

  const profileCards = useMemo(
    () =>
      PROFILE_MODES.map((mode) => ({
        mode,
        icon:
          mode === "child" ? Baby : mode === "strict" ? Shield : Sparkles,
        active: activeProfile === mode,
      })),
    [activeProfile],
  );

  const applyProfile = useCallback(
    async (mode: ProfileMode) => {
      if (mode === "child") {
        await updateSettings(CHILD_PROFILE);
        return;
      }
      if (mode === "strict") {
        await updateSettings(STRICT_PROFILE);
        return;
      }
      await updateSettings({
        profile_mode: "default",
        block_tiktok: false,
        block_social_media: false,
        block_adult_content: false,
        block_gambling: true,
        safe_search: false,
      });
    },
    [updateSettings],
  );

  async function toggleFilter(
    key:
      | "block_tiktok"
      | "block_social_media"
      | "block_adult_content"
      | "block_gambling"
      | "safe_search",
  ) {
    if (!settings) return;
    await updateSettings({
      [key]: !settings[key],
      profile_mode: "default",
    });
  }

  function addKeyword() {
    const next = parseKeywords(keywordDraft);
    if (!next.length) return;
    const merged = Array.from(new Set([...localKeywords, ...next])).slice(0, 30);
    setLocalKeywords(merged);
    setKeywordDraft("");
    setDirty(true);
  }

  function removeKeyword(word: string) {
    setLocalKeywords((prev) => prev.filter((k) => k !== word));
    setDirty(true);
  }

  async function saveKeywords() {
    await updateSettings({
      blocked_keywords: localKeywords,
      profile_mode: activeProfile === "default" ? "default" : activeProfile,
    });
    setDirty(false);
  }

  const filtersOn =
    settings?.block_tiktok ||
    settings?.block_social_media ||
    settings?.block_adult_content ||
    settings?.safe_search ||
    (settings?.blocked_keywords?.length ?? 0) > 0;

  return (
    <VoidPanel glow="strong" className="mb-6 border border-void-green/30">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-void-green">{t("title")}</p>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-void-text-mint">
            {t("subtitle")}
          </p>
        </div>
        {filtersOn && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-void-green/40 bg-void-green/10 px-3 py-1 text-[11px] font-semibold text-void-green">
            <Ban className="h-3.5 w-3.5" />
            {t("activeBadge")}
          </span>
        )}
      </div>

      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-void-muted">
        {t("profileLabel")}
      </p>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {profileCards.map(({ mode, icon: Icon, active }) => (
          <button
            key={mode}
            type="button"
            disabled={saving || loading}
            onClick={() => void applyProfile(mode)}
            className={cn(
              "rounded-xl border p-4 text-start transition-all",
              active
                ? "border-void-green bg-void-green/15 shadow-[0_0_20px_rgba(0,255,153,0.15)]"
                : "border-white/10 bg-black/20 hover:border-void-green/40",
            )}
          >
            <Icon
              className={cn(
                "mb-2 h-5 w-5",
                active ? "text-void-green" : "text-void-muted",
              )}
            />
            <p className="text-sm font-bold text-white">{t(`profiles.${mode}.title`)}</p>
            <p className="mt-1 text-[11px] leading-snug text-void-text-mint">
              {t(`profiles.${mode}.desc`)}
            </p>
          </button>
        ))}
      </div>

      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-void-muted">
        {t("filtersLabel")}
      </p>
      <div className="mb-6 grid gap-2 sm:grid-cols-2">
        <VoidToggle
          label={t("blockTiktok")}
          description={t("blockTiktokHint")}
          checked={settings?.block_tiktok ?? false}
          disabled={saving || loading}
          onChange={() => void toggleFilter("block_tiktok")}
        />
        <VoidToggle
          label={t("blockSocial")}
          description={t("blockSocialHint")}
          checked={settings?.block_social_media ?? false}
          disabled={saving || loading}
          onChange={() => void toggleFilter("block_social_media")}
        />
        <VoidToggle
          label={t("blockAdult")}
          description={t("blockAdultHint")}
          checked={settings?.block_adult_content ?? false}
          disabled={saving || loading}
          onChange={() => void toggleFilter("block_adult_content")}
        />
        <VoidToggle
          label={t("blockGambling")}
          description={t("blockGamblingHint")}
          checked={settings?.block_gambling ?? true}
          disabled={saving || loading}
          onChange={() => void toggleFilter("block_gambling")}
        />
        <VoidToggle
          label={t("safeSearch")}
          description={t("safeSearchHint")}
          checked={settings?.safe_search ?? false}
          disabled={saving || loading}
          onChange={() => void toggleFilter("safe_search")}
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-black/25 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Hash className="h-4 w-4 text-void-green" />
          <p className="text-sm font-semibold text-white">{t("keywordsTitle")}</p>
        </div>
        <p className="mb-3 text-[11px] text-void-text-mint">{t("keywordsHint")}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={keywordDraft}
            onChange={(e) => {
              setKeywordDraft(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addKeyword();
              }
            }}
            placeholder={t("keywordsPlaceholder")}
            className="flex-1 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-void-muted focus:border-void-green/50 focus:outline-none"
          />
          <VoidButton type="button" disabled={saving} onClick={addKeyword}>
            {t("addKeyword")}
          </VoidButton>
        </div>
        {localKeywords.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {localKeywords.map((word) => (
              <span
                key={word}
                className="inline-flex items-center gap-1 rounded-full border border-void-green/30 bg-void-green/10 px-2.5 py-1 text-xs text-void-green"
              >
                {word}
                <button
                  type="button"
                  aria-label={t("removeKeyword", { word })}
                  onClick={() => removeKeyword(word)}
                  className="rounded-full p-0.5 hover:bg-void-green/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        {dirty && (
          <div className="mt-3 flex justify-end">
            <VoidButton type="button" disabled={saving} onClick={() => void saveKeywords()}>
              {t("saveKeywords")}
            </VoidButton>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] text-amber-100/90">
        <Smartphone className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{t("dnsNote")}</p>
      </div>

      <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/5 p-3">
        <p className="text-[11px] font-semibold text-red-200">{t("edgeDnsTitle")}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-red-100/80">{t("edgeDnsSteps")}</p>
      </div>

      {activeProfile === "child" && (
        <div className="mt-3 flex items-center gap-2 text-[11px] text-void-green">
          <Dice5 className="h-4 w-4" />
          <span>{t("childActiveNote")}</span>
        </div>
      )}
    </VoidPanel>
  );
}
