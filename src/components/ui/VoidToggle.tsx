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
  activeLabel = "ACTIVE",
  disabled,
}: VoidToggleProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-void-green/10 bg-void-black/40 px-3 py-2.5",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {label && (
        <span className="text-sm text-void-text">
          {label}
          {checked && (
            <span className="ml-2 text-xs text-void-green">[{activeLabel}]</span>
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
          checked ? "bg-void-green/30" : "bg-void-muted/30",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full transition-transform",
            checked
              ? "translate-x-5 bg-void-green shadow-[0_0_10px_rgba(57,255,20,0.8)]"
              : "bg-void-muted",
          )}
        />
      </button>
    </label>
  );
}
