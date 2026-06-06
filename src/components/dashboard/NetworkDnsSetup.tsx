"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Router,
  Smartphone,
  Monitor,
  Copy,
  CheckCircle2,
  Shield,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidButton } from "@/components/ui/VoidButton";
import { Link } from "@/i18n/navigation";

type DnsProfile = {
  token: string;
  homeIps: string[];
  isActive: boolean;
  dns: {
    primary: string;
    secondary: string;
    dohUrl: string;
  };
};

const DEFAULT_PRIMARY = process.env.NEXT_PUBLIC_VOIDAD_DNS_PRIMARY ?? "127.0.0.1";
const DEFAULT_SECONDARY = process.env.NEXT_PUBLIC_VOIDAD_DNS_SECONDARY ?? "1.1.1.1";

export function NetworkDnsSetup() {
  const t = useTranslations("networkDns");
  const [profile, setProfile] = useState<DnsProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch("/api/dns/profile");
      if (res.status === 401) {
        setApiError("NOT_AUTHENTICATED");
        setProfile(null);
        return;
      }
      if (res.status === 404) {
        setApiError("NO_DNS_PROFILE");
        setProfile(null);
        return;
      }
      if (res.ok) {
        setProfile(await res.json());
      } else {
        setApiError("LOAD_FAILED");
      }
    } catch {
      setApiError("LOAD_FAILED");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!profile || loading) return;
    const primary = profile.dns.primary ?? DEFAULT_PRIMARY;
    const hasLocalhost = profile.homeIps.some(
      (ip) => ip === "127.0.0.1" || ip === "::1",
    );
    if (
      (primary === "127.0.0.1" || primary === "::1") &&
      !hasLocalhost &&
      profile.homeIps.length > 0
    ) {
      void fetch("/api/dns/register-local", { method: "POST" }).then(() =>
        loadProfile(),
      );
    }
  }, [profile, loading, loadProfile]);

  async function registerNetwork() {
    setRegistering(true);
    setMessage(null);
    try {
      const res = await fetch("/api/dns/register-network", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setMessage(t(`errors.${data.error ?? "REGISTER_FAILED"}`));
        return;
      }

      const primary = profile?.dns.primary ?? DEFAULT_PRIMARY;
      if (primary === "127.0.0.1" || primary === "::1") {
        await fetch("/api/dns/register-local", { method: "POST" });
      }

      setMessage(t("networkRegistered"));
      await loadProfile();
    } catch {
      setMessage(t("errors.INTERNAL"));
    } finally {
      setRegistering(false);
    }
  }

  async function copyText(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 2000);
  }

  const primary = profile?.dns.primary ?? DEFAULT_PRIMARY;
  const secondary = profile?.dns.secondary ?? DEFAULT_SECONDARY;
  const networkRegistered = (profile?.homeIps?.length ?? 0) > 0;

  return (
    <VoidPanel glow="strong" className="mb-6 border-2 border-void-green/50">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Router className="h-5 w-5 text-void-green" />
          <p className="text-base font-bold text-void-green">{t("title")}</p>
          {networkRegistered && (
            <span className="rounded-full border border-void-green/40 bg-void-green/10 px-2 py-0.5 text-[10px] text-void-green">
              {t("networkActive")}
            </span>
          )}
        </div>
        <VoidButton
          type="button"
          variant="ghost"
          disabled={loading}
          onClick={() => void loadProfile()}
          className="inline-flex items-center gap-1.5 text-[11px]"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {t("refresh")}
        </VoidButton>
      </div>

      <p className="text-sm text-void-text-mint">{t("subtitleShort")}</p>

      {/* DNS values — hero */}
      <div className="mt-4 rounded-xl border-2 border-void-green/40 bg-void-black/70 p-4">
        <p className="text-center text-[11px] uppercase tracking-widest text-void-muted">
          {t("yourDns")}
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <DnsValue
            label={t("primaryDns")}
            value={primary}
            copied={copied === "primary"}
            onCopy={() => copyText("primary", primary)}
            large
          />
          <DnsValue
            label={t("secondaryDns")}
            value={secondary}
            copied={copied === "secondary"}
            onCopy={() => copyText("secondary", secondary)}
            large
          />
        </div>
        <p className="mt-3 text-center text-[11px] text-void-muted">{t("whereToPut")}</p>
      </div>

      {apiError === "NOT_AUTHENTICATED" && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {t("signInRequired")}{" "}
            <Link href="/login" className="text-void-green underline">
              {t("signInLink")}
            </Link>
          </span>
        </div>
      )}

      {apiError === "NO_DNS_PROFILE" && (
        <p className="mt-2 text-[11px] text-void-muted">{t("usingDefaultDns")}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <VoidButton
          type="button"
          disabled={registering || loading || apiError === "NOT_AUTHENTICATED"}
          onClick={() => void registerNetwork()}
          className="inline-flex items-center gap-2"
        >
          <Shield className="h-4 w-4" />
          {registering ? t("registering") : t("registerNetwork")}
        </VoidButton>
        {profile?.homeIps?.length ? (
          <span className="flex items-center gap-1.5 text-[11px] text-void-text-mint">
            <CheckCircle2 className="h-3.5 w-3.5 text-void-green" />
            {t("registeredIps")}: {profile.homeIps.join(", ")}
          </span>
        ) : (
          <span className="text-[11px] text-void-muted">{t("noNetworkYet")}</span>
        )}
      </div>

      {message && <p className="mt-2 text-[11px] text-void-green">{message}</p>}

      {/* Device setup steps */}
      <div className="mt-6 border-t border-void-green/20 pt-5">
        <p className="mb-3 text-sm font-semibold text-void-green">{t("deviceStepsTitle")}</p>
        <div className="grid gap-4 lg:grid-cols-2">
          <DeviceSteps
            icon={<Smartphone className="h-4 w-4 text-void-green" />}
            title={t("phoneTitle")}
            steps={[
              t("iphoneStep1"),
              t("iphoneStep2", { primary }),
              t("iphoneStep3"),
              t("androidStep1"),
              t("androidStep2", { primary }),
              t("androidStep3"),
            ]}
          />
          <DeviceSteps
            icon={<Monitor className="h-4 w-4 text-void-green" />}
            title={t("computerTitle")}
            steps={[
              t("macStep1"),
              t("macStep2", { primary }),
              t("macStep3"),
              t("windowsStep1"),
              t("windowsStep2", { primary }),
              t("windowsStep3"),
            ]}
          />
        </div>

        <details className="mt-4 rounded-lg border border-void-green/20 bg-void-black/40 px-3 py-2">
          <summary className="cursor-pointer text-[11px] font-semibold text-void-green">
            {t("routerStepsTitle")}
          </summary>
          <ol className="mt-2 list-decimal space-y-1 ps-4 text-[11px] text-void-muted">
            <li>{t("routerStep1")}</li>
            <li>{t("routerStep2", { primary })}</li>
            <li>{t("routerStep3")}</li>
            <li>{t("routerStep4")}</li>
          </ol>
        </details>
      </div>
    </VoidPanel>
  );
}

function DeviceSteps({
  icon,
  title,
  steps,
}: {
  icon: ReactNode;
  title: string;
  steps: string[];
}) {
  return (
    <div className="rounded-lg border border-void-green/25 bg-void-green/5 p-3">
      <p className="flex items-center gap-2 text-[12px] font-semibold text-void-green">
        {icon}
        {title}
      </p>
      <ol className="mt-2 list-decimal space-y-1.5 ps-4 text-[11px] leading-relaxed text-void-muted">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  );
}

function DnsValue({
  label,
  value,
  copied,
  onCopy,
  large = false,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
  large?: boolean;
}) {
  const t = useTranslations("networkDns");
  return (
    <div className="rounded-lg border border-void-green/30 bg-void-black/50 p-3">
      <p className="text-[10px] uppercase tracking-wide text-void-muted">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <code
          className={`font-bold text-void-green ${large ? "text-xl sm:text-2xl" : "text-lg"}`}
        >
          {value}
        </code>
        <button
          type="button"
          onClick={() => void onCopy()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-void-green/50 px-3 py-1.5 text-[10px] font-semibold text-void-green transition hover:bg-void-green/10"
          aria-label={t("copy")}
        >
          {copied ? (
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden />
          )}
          <span>{copied ? t("copied") : t("copy")}</span>
        </button>
      </div>
    </div>
  );
}
