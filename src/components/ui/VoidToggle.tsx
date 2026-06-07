"use client";

import { cn } from "@/lib/utils";

interface VoidToggleProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  activeLabel?: string;
  disabled?: boolean;
}

export function VoidToggle({
  checked,
  onChange,
  label,
  description,
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
        <span className="min-w-0 flex-1 text-sm text-void-text-mint">
          <span className="block">
            {label}
            {checked && (
              <span className="ml-2 font-mono text-xs text-void-green">
                [{activeLabel}]
              </span>
            )}
          </span>
          {description && (
            <span className="mt-0.5 block text-[11px] leading-snug text-void-muted">
              {description}
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
