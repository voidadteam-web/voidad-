"use client";

import { useTranslations } from "next-intl";
import { Shield, Clock } from "lucide-react";
import { VoidToggle } from "@/components/ui/VoidToggle";
import { useState } from "react";

export function StatusBar() {
  const t = useTranslations("status");
  const [protectionOn, setProtectionOn] = useState(true);

  return (
    <div className="border-b border-void-green/10 bg-void-panel/50">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-2.5 sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-3">
          <Shield className="h-4 w-4 text-void-green" />
          <span className="text-xs font-semibold uppercase tracking-wider text-void-muted">
            {t("activeProtection")}:
          </span>
          <span className="text-xs font-medium text-void-green">
            {t("systemWide")}
          </span>
          <VoidToggle
            checked={protectionOn}
            onChange={setProtectionOn}
            activeLabel="ON"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-void-muted">
          <Clock className="h-3.5 w-3.5 text-void-green" />
          <span className="font-semibold uppercase tracking-wider">
            {t("focusMode")}:
          </span>
          <span className="text-void-green">[{t("unscheduled")}]</span>
        </div>
      </div>
    </div>
  );
}
