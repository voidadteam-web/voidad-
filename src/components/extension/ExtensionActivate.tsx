"use client";

import {
  Shield,
  Download,
  ExternalLink,
  Copy,
  Check,
  PlayCircle,
  Tv,
  Ban,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidButton } from "@/components/ui/VoidButton";
import { useExtensionRuntimeState, useExtensionStatus } from "@/components/extension/ExtensionSync";
import Image from "next/image";

const EXTENSION_DOWNLOAD = "/downloads/voidad-extension.zip";
const CHROME_EXTENSIONS_URL = "chrome://extensions";
const GITHUB_EXTENSION_URL =
  "https://github.com/voidadteam-web/voidad-/tree/main/extension";

const FEATURE_KEYS = [
  "featureYoutube",
  "featureStreaming",
  "featurePopups",
  "featureDnsSync",
  "featureVoidpoints",
  "featureBrowser",
] as const;

const FEATURE_ICONS = [PlayCircle, Tv, Ban, RefreshCw, Zap, Shield] as const;

const STEP_KEYS = ["step1", "step2", "step3", "step4", "step5", "step6"] as const;

export function ExtensionActivate() {
  const t = useTranslations("extension");
  const { installed, checking } = useExtensionStatus();
  const runtime = useExtensionRuntimeState();
  const [copied, setCopied] = useState(false);

  if (checking) return null;

  async function copyChromeUrl() {
    try {
      await navigator.clipboard.writeText(CHROME_EXTENSIONS_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(t("copyPrompt"), CHROME_EXTENSIONS_URL);
    }
  }

  return (
    <VoidPanel
      glow="strong"
      className={`mb-6 ${installed ? "border-void-green/40" : "border-2 border-void-green/50"}`}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <Image
              src="/extension/icon48.png"
              alt=""
              width={40}
              height={40}
              className="mt-0.5 shrink-0 rounded-lg"
            />
            <div>
              <p className="text-sm font-bold text-void-green">
                {installed ? t("activeTitle") : t("installTitle")}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-void-text-mint">
                {installed ? t("activeDesc") : t("installDesc")}
              </p>
              {installed && runtime ? (
                <p className="mt-2 inline-flex items-center gap-2 rounded-md border border-void-green/30 bg-void-green/10 px-2 py-1 text-[11px] font-bold text-void-green">
                  <span className="rounded bg-void-green px-1.5 py-0.5 text-[10px] text-void-black">
                    {runtime.blockedCount > 999 ? "999+" : runtime.blockedCount}
                  </span>
                  {runtime.protectionEnabled
                    ? t("liveBlocked", { count: runtime.blockedCount })
                    : t("protectionOff")}
                </p>
              ) : null}
              {installed ? (
                <p className="mt-1 text-[10px] text-void-muted">{t("pinHint")}</p>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <a href={EXTENSION_DOWNLOAD} download="voidad-extension.zip">
              <VoidButton type="button" className="inline-flex items-center gap-2">
                <Download className="h-4 w-4" />
                {t("downloadExtension")}
              </VoidButton>
            </a>
            <VoidButton
              type="button"
              variant="secondary"
              className="inline-flex items-center gap-2"
              onClick={() => void copyChromeUrl()}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? t("copiedChrome") : t("openChrome")}
            </VoidButton>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[12px] font-semibold text-void-green">{t("featuresTitle")}</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURE_KEYS.map((key, i) => {
              const Icon = FEATURE_ICONS[i]!;
              return (
                <div
                  key={key}
                  className="flex items-start gap-2 rounded-lg border border-void-green/20 bg-void-black/40 px-3 py-2"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-void-green" />
                  <p className="text-[11px] leading-relaxed text-void-muted">{t(key)}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-void-green/25 bg-void-green/5 p-4">
          <p className="mb-3 text-[12px] font-semibold text-void-green">{t("installStepsTitle")}</p>
          <ol className="list-decimal space-y-2 ps-4 text-[11px] leading-relaxed text-void-muted">
            {STEP_KEYS.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ol>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[10px] text-void-muted">
          <span>{t("worksOn")}</span>
          <a
            href={GITHUB_EXTENSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-void-green hover:underline"
          >
            {t("viewSource")}
            <ExternalLink className="h-3 w-3" />
          </a>
          <span className="text-void-green/40">·</span>
          <code className="rounded border border-void-green/20 bg-void-black/50 px-1.5 py-0.5 text-void-green">
            v0.5.4
          </code>
        </div>
      </div>
    </VoidPanel>
  );
}
