"use client";

import { useTranslations } from "next-intl";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidButton } from "@/components/ui/VoidButton";
import { VoidStat } from "@/components/ui/VoidStat";
import { VoidPageTitle } from "@/components/ui/VoidPageTitle";
import { Heart, Leaf, TreePine } from "lucide-react";
import { CarbonWireframeTree } from "@/components/voidad/CarbonWireframeTree";

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
        <CarbonWireframeTree level={7} idPrefix="voidpoints-hero" className="max-w-lg" />
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
