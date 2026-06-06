"use client";

import { useTranslations } from "next-intl";
import { StatusBar } from "@/components/layout/StatusBar";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidToggle } from "@/components/ui/VoidToggle";
import { VoidButton } from "@/components/ui/VoidButton";
import { VoidStat } from "@/components/ui/VoidStat";
import { useState } from "react";
import {
  Shield,
  Eye,
  AlertTriangle,
  Filter,
  Globe,
  Camera,
  Thermometer,
  Lightbulb,
  Refrigerator,
  Heart,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { DashboardProfile } from "@/components/dashboard/DashboardProfile";

const LIVE_FEED = [
  "TRACKER: from AdServer1 → Chrome",
  "AD-REJECT: from DoubleClick",
  "AD-REJECT: from IP_Camera",
  "IoT_ANOMALY: from SmartTV → blocked",
  "PHISHING: from suspicious-domain.net → blocked",
];

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const ts = useTranslations("stats");

  const [settings, setSettings] = useState({
    antiAdware: true,
    antiTracker: true,
    antiPhishing: true,
    falsePositive: true,
    geoBlock: true,
    homeNetwork: true,
    camera: true,
    thermostat: true,
    lights: true,
    refrigerator: false,
    keywordFilter: true,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));

  return (
    <>
      <StatusBar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="mb-8 text-center text-2xl font-bold uppercase tracking-wider text-void-green void-glow-text sm:text-3xl">
          {t("title")}
        </h1>

        <div className="mb-6">
          <DashboardProfile />
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          {/* Protection Rules */}
          <VoidPanel title={t("protectionRules")}>
            <div className="space-y-2">
              <VoidToggle
                label="Anti-Adware"
                checked={settings.antiAdware}
                onChange={() => toggle("antiAdware")}
              />
              <VoidToggle
                label="Anti-Tracker"
                checked={settings.antiTracker}
                onChange={() => toggle("antiTracker")}
              />
              <VoidToggle
                label="Anti-Phishing"
                checked={settings.antiPhishing}
                onChange={() => toggle("antiPhishing")}
              />
              <VoidToggle
                label="False Positive Filter"
                checked={settings.falsePositive}
                onChange={() => toggle("falsePositive")}
              />
              <VoidToggle
                label="Geo-Block"
                checked={settings.geoBlock}
                onChange={() => toggle("geoBlock")}
              />
            </div>
          </VoidPanel>

          {/* IoT Guard */}
          <VoidPanel title={t("iotGuard")}>
            <div className="space-y-2">
              <VoidToggle
                label={t("homeNetwork")}
                checked={settings.homeNetwork}
                onChange={() => toggle("homeNetwork")}
              />
              <div className="flex items-center gap-2 px-3 py-1 text-xs text-void-muted">
                <Camera className="h-3.5 w-3.5 text-void-green" />
                Security Cameras
              </div>
              <VoidToggle
                checked={settings.camera}
                onChange={() => toggle("camera")}
              />
              <div className="flex items-center gap-2 px-3 py-1 text-xs text-void-muted">
                <Thermometer className="h-3.5 w-3.5 text-void-green" />
                Smart Thermostat
              </div>
              <VoidToggle
                checked={settings.thermostat}
                onChange={() => toggle("thermostat")}
              />
              <div className="flex items-center gap-2 px-3 py-1 text-xs text-void-muted">
                <Lightbulb className="h-3.5 w-3.5 text-void-green" />
                Smart Lights
              </div>
              <VoidToggle
                checked={settings.lights}
                onChange={() => toggle("lights")}
              />
              <div className="flex items-center gap-2 px-3 py-1 text-xs text-void-muted">
                <Refrigerator className="h-3.5 w-3.5 text-void-muted" />
                Smart Refrigerator
              </div>
              <VoidToggle
                checked={settings.refrigerator}
                onChange={() => toggle("refrigerator")}
              />
            </div>
          </VoidPanel>

          {/* VoidPoints */}
          <VoidPanel title={t("voidpointsDonate")}>
            <VoidStat label={ts("voidpoints")} value={101230} />
            <div className="mt-4 space-y-2 text-xs text-void-muted">
              <div className="flex justify-between">
                <span>Ads Blocked</span>
                <span className="text-void-green">60,000 pts</span>
              </div>
              <div className="flex justify-between">
                <span>Data Saving</span>
                <span className="text-void-green">41,230 pts</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/voidpoints">
                <VoidButton variant="secondary" className="w-full text-xs">
                  <Heart className="h-3.5 w-3.5" />
                  {t("quickDonate")}
                </VoidButton>
              </Link>
              <Link href="/voidpoints">
                <VoidButton variant="ghost" className="w-full text-xs">
                  {t("viewCharities")}
                </VoidButton>
              </Link>
            </div>
            <p className="mt-3 text-center text-xs text-void-green">
              Level 4 — Dragon Shield
            </p>
          </VoidPanel>

          {/* Mental Health Filter */}
          <VoidPanel title={t("mentalHealth")}>
            <p className="mb-3 text-xs text-void-muted">{t("focusScheduler")}</p>
            <FocusGrid />
            <div className="mt-4">
              <VoidToggle
                label={t("keywordFilter")}
                checked={settings.keywordFilter}
                onChange={() => toggle("keywordFilter")}
              />
            </div>
          </VoidPanel>
        </div>

        {/* Bottom row: live feed + stats */}
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <VoidPanel title={t("liveFeed")} className="lg:col-span-1">
            <ul className="space-y-2">
              {LIVE_FEED.map((entry) => (
                <li
                  key={entry}
                  className="rounded-lg border border-void-green/15 bg-void-black/50 px-3 py-2 font-mono text-[11px] text-void-green"
                >
                  {entry}
                </li>
              ))}
            </ul>
          </VoidPanel>

          <VoidPanel className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <VoidStat label={ts("adsBlocked")} value={1280} />
              <VoidStat label={ts("trackersBlocked")} value={374} />
              <VoidStat label="Malicious Domains" value={330} />
              <VoidStat label={ts("carbonOffset")} value={415} unit="KG" />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {[Shield, Eye, AlertTriangle, Filter, Globe].map((Icon, i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-void-green/20 bg-void-black/40"
                >
                  <Icon className="h-4 w-4 text-void-green" />
                </div>
              ))}
            </div>
          </VoidPanel>
        </div>

        <div className="mt-8 text-center">
          <VoidButton>{t("saveChanges")}</VoidButton>
        </div>
      </div>
    </>
  );
}

function FocusGrid() {
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const hours = [0, 6, 12, 18];
  const active = new Set(["Mo-0", "Tu-0", "We-12", "Th-18", "Fr-0", "Sa-12"]);

  return (
    <div className="overflow-x-auto">
      <div className="inline-grid grid-cols-8 gap-1 text-[10px]">
        <div />
        {days.map((d) => (
          <div key={d} className="text-center text-void-muted">
            {d}
          </div>
        ))}
        {hours.flatMap((h) => [
          <div key={`h-${h}`} className="text-void-muted">
            {h}h
          </div>,
          ...days.map((d) => (
            <div
              key={`${d}-${h}`}
              className={`h-5 w-5 rounded-sm ${
                active.has(`${d}-${h}`)
                  ? "bg-void-green shadow-[0_0_6px_rgba(57,255,20,0.6)]"
                  : "bg-void-black/60 border border-void-green/10"
              }`}
            />
          )),
        ])}
      </div>
    </div>
  );
}
