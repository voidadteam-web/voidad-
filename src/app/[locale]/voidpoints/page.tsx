"use client";

import { useTranslations } from "next-intl";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidButton } from "@/components/ui/VoidButton";
import { VoidStat } from "@/components/ui/VoidStat";
import { VoidPageTitle } from "@/components/ui/VoidPageTitle";
import { Heart, Leaf, TreePine } from "lucide-react";

const CHARITIES = [
  { slug: "green-servers", icon: Leaf, nameEn: "Green Servers Alliance" },
  { slug: "plant-a-bit", icon: TreePine, nameEn: "Plant-A-Bit Initiative" },
  { slug: "digital-freedom", icon: Heart, nameEn: "Digital Freedom Foundation" },
];

export default function VoidPointsPage() {
  const t = useTranslations("voidpoints");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <VoidPageTitle>{t("title")}</VoidPageTitle>

      {/* Hero tree visual */}
      <div className="relative mb-10 flex flex-col items-center">
        <WireframeTree />
        <div className="mt-6 flex flex-wrap justify-center gap-8 text-center">
          <div>
            <p className="void-section-title text-[10px] text-void-muted">
              {t("totalBandwidth")}
            </p>
            <p className="void-display text-xl text-void-green void-glow-text">
              1,280 GB
            </p>
          </div>
          <div>
            <p className="void-section-title text-[10px] text-void-muted">
              {t("carbonOffset")}
            </p>
            <p className="void-display text-xl text-void-green void-glow-text">
              350 KG CO₂
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <VoidPanel glow="strong">
            <VoidStat label={t("estimatedSavings")} value="€35.40" />
            <p className="mt-2 text-center text-xs text-void-muted">{t("savingsNote")}</p>
            <VoidButton className="mt-6 w-full">{t("convert")}</VoidButton>
            <p className="mt-2 text-center text-[10px] text-void-muted">
              {t("convertRate")}
            </p>
          </VoidPanel>

          <VoidPanel title={t("recentActivity")}>
            <ul className="space-y-2 text-xs">
              <li className="rounded-lg border border-void-green/15 bg-void-black/40 px-3 py-2.5 text-void-text-mint">
                <span className="font-medium text-void-green">USER_7841</span> donated
                5,000 VoidPoints to{" "}
                <span className="text-void-green">Green Servers Alliance</span>
              </li>
              <li className="rounded-lg border border-void-green/15 bg-void-black/40 px-3 py-2.5 text-void-text-mint">
                <span className="font-medium text-void-green">USER_7849</span> donated
                1,000 VoidPoints to{" "}
                <span className="text-void-green">Plant-A-Bit Initiative</span>
              </li>
            </ul>
          </VoidPanel>
        </div>

        <VoidPanel glow="strong">
          <VoidStat label={t("yourBalance")} value={45210} />
          <div className="mt-6 space-y-3">
            {CHARITIES.map(({ slug, icon: Icon, nameEn }) => (
              <div
                key={slug}
                className="flex items-center justify-between rounded-lg border border-void-green/15 bg-void-black/40 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-void-green/25 bg-void-panel">
                    <Icon className="h-4 w-4 text-void-green" />
                  </div>
                  <span className="text-sm font-medium text-void-text-mint">{nameEn}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Amount"
                    className="w-16 rounded border border-void-green/20 bg-void-black px-2 py-1 text-xs text-void-green outline-none focus:border-void-green/50"
                  />
                  <VoidButton variant="secondary" className="py-1.5 text-[10px]">
                    {t("donate")}
                  </VoidButton>
                </div>
              </div>
            ))}
          </div>
        </VoidPanel>
      </div>
    </div>
  );
}

function WireframeTree() {
  return (
    <svg
      viewBox="0 0 400 320"
      className="h-56 w-full max-w-lg"
      aria-hidden
    >
      <defs>
        <linearGradient id="treeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff99" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#2d5a4c" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path
        d="M200 300 L200 200 M200 200 L160 140 M200 200 L240 140 M160 140 L130 100 M240 140 L270 100 M130 100 L110 70 M270 100 L290 70"
        stroke="url(#treeGrad)"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="200" cy="120" r="60" stroke="#00ff99" strokeOpacity="0.3" fill="none" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect
          key={i}
          x={270 + i * 10}
          y={60 + (i % 3) * 12}
          width={7}
          height={7}
          fill="#00ff99"
          opacity={0.3 + i * 0.1}
          className="void-pixel-trail"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </svg>
  );
}
