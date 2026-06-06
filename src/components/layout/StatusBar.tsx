"use client";

import { useTranslations } from "next-intl";
import { Shield, Clock } from "lucide-react";
import { VoidToggle } from "@/components/ui/VoidToggle";
import { useProtectionSettings } from "@/hooks/useProtectionSettings";

export function StatusBar() {
  const t = useTranslations("status");
  const { settings, updateSettings, loading } = useProtectionSettings();

  const protectionOn = settings?.protection_enabled ?? true;
  const focusOn = settings?.focus_mode_enabled ?? false;

  return (
    <div className="border-b border-void-green/15 bg-void-panel/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-2.5 sm:flex-row sm:items-center sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <Shield className="h-4 w-4 text-void-green" />
          <span className="void-section-title text-[10px] text-void-muted">
            {t("activeProtection")}:
          </span>
          <span className="text-xs font-medium text-void-text-mint">
            {t("systemWide")}
          </span>
          <VoidToggle
            checked={protectionOn}
            disabled={loading}
            onChange={(checked) => {
              void updateSettings({ protection_enabled: checked });
            }}
            activeLabel="ON"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-void-muted">
          <Clock className="h-3.5 w-3.5 text-void-green" />
          <span className="void-section-title text-[10px]">{t("focusMode")}:</span>
          <span className="font-mono text-void-green">
            [{focusOn ? t("scheduled") : t("unscheduled")}]
          </span>
        </div>
      </div>
    </div>
  );
}
