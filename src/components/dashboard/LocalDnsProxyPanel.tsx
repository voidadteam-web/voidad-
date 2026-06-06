"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Activity, Router, Terminal, Wifi } from "lucide-react";

type ProxyStats = {
  dns: string;
  lan_mode?: boolean;
  lan_ip?: string | null;
  upstream_fallback?: string;
  requests?: {
    blocked?: number;
    forwarded?: number;
    rejected?: number;
  };
};

const PROXY_STATS_URL = "http://127.0.0.1:8053/api/stats";

export function LocalDnsProxyPanel() {
  const t = useTranslations("networkDns");
  const [online, setOnline] = useState(false);
  const [stats, setStats] = useState<ProxyStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(PROXY_STATS_URL, {
          signal: AbortSignal.timeout(1500),
        });
        if (!res.ok) throw new Error("offline");
        const data = (await res.json()) as ProxyStats;
        if (!cancelled) {
          setStats(data);
          setOnline(true);
        }
      } catch {
        if (!cancelled) {
          setOnline(false);
          setStats(null);
        }
      }
    }

    void poll();
    const interval = window.setInterval(poll, 5000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const lanIp = stats?.lan_ip ?? null;
  const routerPrimary = lanIp ?? "192.168.0.x";

  return (
    <div className="mt-5 rounded-xl border border-void-green/30 bg-void-black/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-bold text-void-green">
          <Wifi className="h-4 w-4" />
          {t("lanProxyTitle")}
        </p>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            online
              ? "border border-void-green/40 bg-void-green/10 text-void-green"
              : "border border-void-muted/30 bg-void-black/40 text-void-muted"
          }`}
        >
          <Activity className="h-3 w-3" />
          {online ? t("lanProxyOnline") : t("lanProxyOffline")}
        </span>
      </div>

      <p className="mt-2 text-[11px] leading-relaxed text-void-text-mint">{t("lanProxyDesc")}</p>

      <div className="mt-3 rounded-lg border border-void-green/20 bg-void-green/5 p-3">
        <p className="flex items-center gap-2 text-[11px] font-semibold text-void-green">
          <Terminal className="h-3.5 w-3.5" />
          {t("lanProxyCommand")}
        </p>
        <code className="mt-2 block overflow-x-auto rounded bg-void-black/70 px-2 py-1.5 text-[11px] text-void-green">
          cd dev/dns-proxy && VOIDAD_LAN_MODE=true ./run.sh
        </code>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-void-green/25 bg-void-black/40 p-3">
          <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-void-muted">
            <Router className="h-3 w-3" />
            {t("lanRouterPrimary")}
          </p>
          <code className="mt-1 block text-lg font-bold text-void-green">
            {online && stats?.dns ? stats.dns.split(":")[0] : routerPrimary}
          </code>
        </div>
        <div className="rounded-lg border border-void-green/25 bg-void-black/40 p-3">
          <p className="text-[10px] uppercase tracking-wide text-void-muted">{t("lanRouterFallback")}</p>
          <code className="mt-1 block text-lg font-bold text-void-text-mint">
            {stats?.upstream_fallback ?? "1.1.1.1"}
          </code>
        </div>
      </div>

      {online && stats?.requests ? (
        <p className="mt-3 text-[11px] text-void-muted">
          {t("lanProxyLiveStats", {
            blocked: stats.requests.blocked ?? 0,
            forwarded: stats.requests.forwarded ?? 0,
          })}
        </p>
      ) : (
        <p className="mt-3 text-[11px] text-void-muted">{t("lanProxyDashboardHint")}</p>
      )}

      <ol className="mt-3 list-decimal space-y-1 ps-4 text-[11px] leading-relaxed text-void-muted">
        <li>{t("lanStep1")}</li>
        <li>{t("lanStep2", { primary: routerPrimary })}</li>
        <li>{t("lanStep3", { fallback: stats?.upstream_fallback ?? "1.1.1.1" })}</li>
        <li>{t("lanStep4")}</li>
      </ol>
    </div>
  );
}
