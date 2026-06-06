"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import { CarbonTreeEnergyFlow } from "@/components/voidad/CarbonTreeEnergyFlow";
import {
  CARBON_TREE_LEVEL_COUNT,
  CARBON_TREE_NAMES,
  carbonTreeImageForLevel,
} from "@/lib/carbon-trees";
import { cn } from "@/lib/utils";

type VoidTreeEvolutionProps = {
  /** Highlighted / preview level */
  currentLevel?: number;
  /** Highest level the user has unlocked (from profile) */
  unlockedLevel?: number;
  className?: string;
  onSelectLevel?: (level: number) => void;
};

/** 10-level carbon tree evolution grid — locked until user reaches each stage */
export function VoidTreeEvolution({
  currentLevel = 1,
  unlockedLevel,
  className,
  onSelectLevel,
}: VoidTreeEvolutionProps) {
  const t = useTranslations("voidpoints");
  const active = Math.min(CARBON_TREE_LEVEL_COUNT, Math.max(1, currentLevel));
  const unlocked = Math.min(
    CARBON_TREE_LEVEL_COUNT,
    Math.max(1, unlockedLevel ?? currentLevel),
  );

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
          const isUnlocked = level <= unlocked;
          const isLocked = !isUnlocked;
          const name = CARBON_TREE_NAMES[level]!;

          return (
            <button
              key={level}
              type="button"
              disabled={isLocked}
              aria-disabled={isLocked}
              aria-label={
                isLocked ? t("levelLockedAria", { level }) : t("levelUnlockedAria", { level, name })
              }
              onClick={() => {
                if (isUnlocked) onSelectLevel?.(level);
              }}
              className={cn(
                "relative flex flex-col items-center rounded-xl border bg-void-black/60 p-2 transition sm:p-3",
                isLocked && "cursor-not-allowed opacity-55",
                isActive && isUnlocked
                  ? "void-glow-border-strong border-void-green/50 shadow-[0_0_24px_rgba(0,255,153,0.2)]"
                  : isUnlocked
                    ? "border-void-green/15 hover:border-void-green/35 hover:bg-void-black/80"
                    : "border-void-green/10 bg-void-black/40",
              )}
            >
              <div className="relative mb-2 flex h-[100px] w-full items-end justify-center sm:h-[120px]">
                <div
                  className={cn(
                    "void-tree-map-feed void-tree-map-ground pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[40%]",
                    isLocked && "opacity-40",
                  )}
                >
                  <Image
                    src="/world-map-net.png"
                    alt=""
                    fill
                    className="object-contain object-bottom void-hero-map"
                    unoptimized
                  />
                </div>
                {isActive && isUnlocked && (
                  <>
                    <CarbonTreeEnergyFlow intensity="sm" className="z-[5]" />
                    <div
                      className="void-tree-root-aura pointer-events-none absolute inset-x-[8%] bottom-[6%] z-[4] h-[30%]"
                      aria-hidden
                    />
                  </>
                )}
                <Image
                  src={carbonTreeImageForLevel(level)}
                  alt=""
                  width={90}
                  height={110}
                  unoptimized
                  className={cn(
                    "relative z-10 object-contain object-bottom transition",
                    isLocked && "scale-95 opacity-35 grayscale",
                    isActive && isUnlocked
                      ? "void-tree-glow-art"
                      : !isLocked && "drop-shadow-[0_0_6px_rgba(0,255,153,0.18)]",
                  )}
                  style={{ height: isActive && isUnlocked ? 110 : 95, width: "auto" }}
                />
                {isLocked && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg bg-void-black/55 backdrop-blur-[1px]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-void-green/35 bg-void-black/80 shadow-[0_0_12px_rgba(0,255,153,0.15)] sm:h-11 sm:w-11">
                      <Lock className="h-5 w-5 text-void-green/75 sm:h-5 sm:w-5" strokeWidth={1.75} />
                    </div>
                    <p className="mt-2 px-2 text-center text-[7px] uppercase leading-tight tracking-[0.14em] text-void-muted sm:text-[8px]">
                      {t("levelLocked")}
                    </p>
                  </div>
                )}
              </div>
              <p
                className={cn(
                  "void-display text-[9px] leading-tight tracking-wider sm:text-[10px]",
                  isUnlocked ? "text-void-green" : "text-void-muted/70",
                )}
              >
                {t("level")} {level}
              </p>
              <p
                className={cn(
                  "mt-0.5 line-clamp-2 text-center text-[8px] uppercase leading-tight tracking-wide",
                  isUnlocked ? "text-void-muted" : "text-void-muted/50",
                )}
              >
                {name}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
