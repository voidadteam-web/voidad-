"use client";

import { Shield, Download, CheckCircle2, Puzzle } from "lucide-react";
import { useTranslations } from "next-intl";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidButton } from "@/components/ui/VoidButton";
import { useExtensionStatus } from "@/components/extension/ExtensionSync";

export function ExtensionActivate() {
  const t = useTranslations("extension");
  const { installed, checking } = useExtensionStatus();

  if (checking) return null;

  if (installed) {
    return (
      <VoidPanel glow="strong" className="mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-void-green" />
          <div>
            <p className="text-sm font-semibold text-void-text">{t("activeTitle")}</p>
            <p className="mt-1 text-xs text-void-text-mint">{t("activeDesc")}</p>
          </div>
        </div>
      </VoidPanel>
    );
  }

  return (
    <VoidPanel glow="strong" className="mb-6 border-void-green/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-void-green" />
          <div>
            <p className="text-sm font-semibold text-void-text">{t("installTitle")}</p>
            <p className="mt-1 text-xs leading-relaxed text-void-text-mint">{t("installDesc")}</p>
            <ol className="mt-3 list-decimal space-y-1 ps-4 text-[11px] text-void-muted">
              <li>{t("step1")}</li>
              <li>{t("step2")}</li>
              <li>{t("step3")}</li>
            </ol>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <VoidButton
            type="button"
            className="inline-flex items-center justify-center gap-2"
            onClick={async () => {
              await navigator.clipboard.writeText("extension/");
              window.alert(t("copied"));
            }}
          >
            <Puzzle className="h-4 w-4" />
            {t("openChrome")}
          </VoidButton>
          <p className="flex items-center gap-1 text-[10px] text-void-muted">
            <Download className="h-3 w-3" />
            {t("devFolder")}: <code className="text-void-green">extension/</code>
          </p>
        </div>
      </div>
    </VoidPanel>
  );
}
