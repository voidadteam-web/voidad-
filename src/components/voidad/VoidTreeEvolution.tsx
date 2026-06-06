"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  CARBON_TREE_LEVEL_COUNT,
  CARBON_TREE_NAMES,
  carbonTreeImageForLevel,
} from "@/lib/carbon-trees";
import { cn } from "@/lib/utils";

type VoidTreeEvolutionProps = {
  currentLevel?: number;
  className?: string;
  onSelectLevel?: (level: number) => void;
};

/** 10-level carbon tree evolution grid — Void Tree Evolution mockup */
export function VoidTreeEvolution({
  currentLevel = 7,
  className,
  onSelectLevel,
}: VoidTreeEvolutionProps) {
  const t = useTranslations("voidpoints");
  const active = Math.min(CARBON_TREE_LEVEL_COUNT, Math.max(1, currentLevel));

  return (
    <div className={className}>
      <h2 className="void-display mb-2 text-center text-lg tracking-[0.14em] text-void-green void-glow-text sm:text-xl">
        {t("treeEvolutionTitle")}
      </h2>
      <p className="mb-6 text-center text-xs uppercase tracking-[0.2em] text-void-muted">
        {t("treeEvolutionSubtitle")}
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
        {Array.from({ length: CARBON_TREE_LEVEL_COUNT }, (_, i) => {
          const level = i + 1;
          const isActive = level === active;
          const name = CARBON_TREE_NAMES[level]!;

          return (
            <button
              key={level}
              type="button"
              onClick={() => onSelectLevel?.(level)}
              className={cn(
                "flex flex-col items-center rounded-xl border bg-void-black/60 p-2 transition sm:p-3",
                isActive
                  ? "void-glow-border-strong border-void-green/50 shadow-[0_0_24px_rgba(0,255,153,0.2)]"
                  : "border-void-green/15 hover:border-void-green/35 hover:bg-void-black/80",
              )}
            >
              <div className="relative mb-2 flex h-[100px] w-full items-end justify-center sm:h-[120px]">
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[35%] opacity-25">
                  <Image
                    src="/world-map-net.png"
                    alt=""
                    fill
                    className="object-contain object-bottom void-hero-map"
                    unoptimized
                  />
                </div>
                <Image
                  src={carbonTreeImageForLevel(level)}
                  alt=""
                  width={90}
                  height={110}
                  unoptimized
                  className={cn(
                    "relative z-10 object-contain object-bottom",
                    isActive && "drop-shadow-[0_0_16px_rgba(0,255,153,0.5)]",
                  )}
                  style={{ height: isActive ? 110 : 95, width: "auto" }}
                />
              </div>
              <p className="void-display text-[9px] leading-tight tracking-wider text-void-green sm:text-[10px]">
                {t("level")} {level}
              </p>
              <p className="mt-0.5 line-clamp-2 text-center text-[8px] uppercase leading-tight tracking-wide text-void-muted">
                {name}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
