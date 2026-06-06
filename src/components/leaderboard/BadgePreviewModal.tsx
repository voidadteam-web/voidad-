"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  shieldImageForTier,
  SHIELD_TIER_NAMES,
  type ShieldTier,
} from "@/lib/shield-ranks";
import type { MilitaryRank } from "@/lib/military-ranks";
import { cn } from "@/lib/utils";

export type ShieldPreview = {
  kind: "shield";
  tier: ShieldTier;
  level: number;
};

export type MilitaryPreview = {
  kind: "military";
  rank: MilitaryRank;
};

export type BadgePreview = ShieldPreview | MilitaryPreview;

type BadgePreviewModalProps = {
  preview: BadgePreview | null;
  onClose: () => void;
  levelLabel: string;
  closeLabel: string;
};

export function BadgePreviewModal({
  preview,
  onClose,
  levelLabel,
  closeLabel,
}: BadgePreviewModalProps) {
  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [preview, onClose]);

  if (!preview) return null;

  const isShield = preview.kind === "shield";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="badge-preview-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-void-black/90 backdrop-blur-md"
        onClick={onClose}
        aria-label={closeLabel}
      />

      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-2xl border border-void-green/40",
          "bg-void-black/95 p-6 shadow-[0_0_48px_rgba(0,255,153,0.25)] sm:p-8",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-void-green/30 text-void-green transition hover:border-void-green/60 hover:bg-void-green/10"
          aria-label={closeLabel}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center gap-5 pt-2">
          <div className="relative flex min-h-[240px] w-full items-center justify-center sm:min-h-[320px]">
            {isShield ? (
              <Image
                src={shieldImageForTier(preview.tier)}
                alt=""
                width={280}
                height={350}
                unoptimized
                className="max-h-[min(60vh,360px)] w-auto object-contain drop-shadow-[0_0_24px_rgba(0,255,153,0.45)]"
                priority
              />
            ) : (
              <Image
                src={preview.rank.image}
                alt={preview.rank.name}
                width={200}
                height={280}
                unoptimized
                className="max-h-[min(60vh,360px)] w-auto object-contain drop-shadow-[0_0_24px_rgba(0,255,153,0.35)]"
                priority
              />
            )}
          </div>

          <div className="text-center">
            <p
              id="badge-preview-title"
              className="void-display text-lg tracking-[0.14em] text-void-green void-glow-text sm:text-xl"
            >
              {levelLabel}{" "}
              {isShield ? preview.level : preview.rank.level}
            </p>
            <p className="mt-1 text-sm uppercase tracking-wider text-void-text-mint">
              {isShield
                ? SHIELD_TIER_NAMES[preview.tier]
                : preview.rank.grade}
            </p>
            {!isShield && (
              <p className="mt-0.5 text-xs uppercase tracking-wide text-void-muted">
                {preview.rank.metal}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
