"use client";

import { cn } from "@/lib/utils";

interface VoidToggleProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  activeLabel?: string;
  disabled?: boolean;
}

export function VoidToggle({
  checked,
  onChange,
  label,
  activeLabel = "ON",
  disabled,
}: VoidToggleProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-void-green/15 bg-void-black/50 px-3 py-2.5",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {label && (
        <span className="text-sm text-void-text-mint">
          {label}
          {checked && (
            <span className="ml-2 font-mono text-xs text-void-green">
              [{activeLabel}]
            </span>
          )}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-void-green/25" : "bg-void-green-muted/50",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full transition-transform",
            checked
              ? "translate-x-5 bg-void-green shadow-[0_0_12px_rgba(0,255,153,0.9)]"
              : "bg-void-muted",
          )}
        />
      </button>
    </label>
  );
}
