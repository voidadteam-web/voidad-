"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  shieldImageForTier,
  SHIELD_TIER_NAMES,
  type ShieldTier,
} from "@/lib/shield-ranks";
import { cn } from "@/lib/utils";

export type ShieldPreview = {
  tier: ShieldTier;
  level: number;
};

type BadgePreviewModalProps = {
  preview: ShieldPreview | null;
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
            <Image
              src={shieldImageForTier(preview.tier)}
              alt=""
              width={280}
              height={350}
              unoptimized
              className="max-h-[min(60vh,360px)] w-auto object-contain drop-shadow-[0_0_24px_rgba(0,255,153,0.45)]"
              priority
            />
          </div>

          <div className="text-center">
            <p
              id="badge-preview-title"
              className="void-display text-lg tracking-[0.14em] text-void-green void-glow-text sm:text-xl"
            >
              {levelLabel} {preview.level}
            </p>
            <p className="mt-1 text-sm uppercase tracking-wider text-void-text-mint">
              {SHIELD_TIER_NAMES[preview.tier]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
