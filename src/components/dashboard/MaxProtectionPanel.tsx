"use client";

import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidButton } from "@/components/ui/VoidButton";
import { MAX_PROTECTION, useProtectionSettings } from "@/hooks/useProtectionSettings";

export function MaxProtectionPanel() {
  const t = useTranslations("dashboard");
  const { settings, updateSettings, saving } = useProtectionSettings();

  const isMax =
    settings?.protection_enabled &&
    settings?.anti_adware &&
    settings?.anti_tracker &&
    settings?.anti_phishing &&
    settings?.false_positive_filter &&
    settings?.geo_block &&
    settings?.enhanced_ad_blocking;

  async function enableMax() {
    await updateSettings(MAX_PROTECTION);
  }

  return (
    <VoidPanel glow="strong" className="mb-6 border-2 border-void-green/50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-void-green" />
          <div>
            <p className="text-sm font-bold text-void-green">{t("maxProtectionTitle")}</p>
            <p className="mt-1 text-xs leading-relaxed text-void-text-mint">
              {t("maxProtectionDesc")}
            </p>
            <ul className="mt-2 list-disc space-y-1 ps-4 text-[11px] text-void-muted">
              <li>{t("maxStep1")}</li>
              <li>{t("maxStep2")}</li>
              <li>{t("maxStep3")}</li>
              <li>{t("maxStep4")}</li>
            </ul>
            <p className="mt-2 text-[10px] text-amber-200/90">{t("maxLimitNote")}</p>
          </div>
        </div>
        <VoidButton
          type="button"
          disabled={saving || isMax}
          onClick={() => void enableMax()}
          className="shrink-0"
        >
          {isMax ? t("maxProtectionActive") : t("maxProtectionButton")}
        </VoidButton>
      </div>
    </VoidPanel>
  );
}
