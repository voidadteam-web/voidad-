"use client";

import { useTranslations } from "next-intl";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidButton } from "@/components/ui/VoidButton";
import { VoidStat } from "@/components/ui/VoidStat";
import { Heart, Leaf, TreePine } from "lucide-react";

const CHARITIES = [
  {
    slug: "green-servers",
    icon: Leaf,
    nameEn: "Green Servers Alliance",
    nameDe: "Green Servers Alliance",
  },
  {
    slug: "plant-a-bit",
    icon: TreePine,
    nameEn: "Plant-A-Bit Initiative",
    nameDe: "Plant-A-Bit Initiative",
  },
  {
    slug: "digital-freedom",
    icon: Heart,
    nameEn: "Digital Freedom Foundation",
    nameDe: "Digital Freedom Foundation",
  },
];

export default function VoidPointsPage() {
  const t = useTranslations("voidpoints");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="mb-10 text-center text-2xl font-bold uppercase tracking-wider text-void-green void-glow-text sm:text-3xl">
        {t("title")}
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: savings + activity */}
        <div className="space-y-4">
          <VoidPanel>
            <VoidStat label={t("estimatedSavings")} value="€35.40" />
            <p className="mt-2 text-center text-xs text-void-muted">
              {t("savingsNote")}
            </p>
          </VoidPanel>

          <VoidPanel>
            <div className="grid grid-cols-2 gap-4">
              <VoidStat label={t("totalBandwidth")} value="1,280" unit="GB" />
              <VoidStat label={t("carbonOffset")} value="350" unit="KG CO₂" />
            </div>
          </VoidPanel>

          <VoidPanel title="Recent Activity">
            <ul className="space-y-2 text-xs text-void-muted">
              <li className="rounded-lg border border-void-green/10 px-3 py-2">
                <span className="text-void-green">USER_7841</span> donated 5,000
                VoidPoints to Green Servers Alliance
              </li>
              <li className="rounded-lg border border-void-green/10 px-3 py-2">
                <span className="text-void-green">USER_7849</span> donated 1,000
                VoidPoints to Plant-A-Bit Initiative
              </li>
            </ul>
          </VoidPanel>
        </div>

        {/* Right: balance + charities */}
        <div className="space-y-4">
          <VoidPanel>
            <VoidStat label={t("yourBalance")} value={45210} />
            <VoidButton className="mt-6 w-full">
              {t("convert")} ({t("convertRate")})
            </VoidButton>
          </VoidPanel>

          <VoidPanel title={t("charitiesTitle")}>
            <div className="space-y-3">
              {CHARITIES.map(({ slug, icon: Icon, nameEn }) => (
                <div
                  key={slug}
                  className="flex items-center justify-between rounded-xl border border-void-green/15 bg-void-black/40 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-void-green" />
                    <span className="text-sm font-medium">{nameEn}</span>
                  </div>
                  <VoidButton variant="secondary" className="py-1.5 text-xs">
                    {t("donate")}
                  </VoidButton>
                </div>
              ))}
            </div>
          </VoidPanel>
        </div>
      </div>

      {/* Tree visual */}
      <div className="mt-12 flex justify-center">
        <svg
          viewBox="0 0 400 300"
          className="h-48 w-full max-w-md opacity-60"
          aria-hidden
        >
          <defs>
            <linearGradient id="treeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#39ff14" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1a9930" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <ellipse cx="200" cy="280" rx="160" ry="20" stroke="#39ff14" strokeOpacity="0.2" fill="none" />
          <path d="M200 280 L200 180" stroke="#39ff14" strokeWidth="2" fill="none" />
          <circle cx="200" cy="120" r="70" stroke="url(#treeGrad)" strokeWidth="1.5" fill="none" />
          <circle cx="240" cy="100" r="40" stroke="#39ff14" strokeOpacity="0.4" fill="none" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={260 + i * 8}
              y={80 + (i % 3) * 10}
              width={6}
              height={6}
              fill="#39ff14"
              opacity={0.3 + i * 0.1}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
