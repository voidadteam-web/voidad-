"use client";

import { ChevronDown } from "lucide-react";
import { COUNTRIES, countryFlag, countryName } from "@/lib/countries";
import { cn } from "@/lib/utils";

type CountrySelectProps = {
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  className?: string;
};

export function CountrySelect({
  value,
  onChange,
  placeholder = "Select country",
  className,
}: CountrySelectProps) {
  const flag = value ? countryFlag(value) : "🌐";

  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
        <span className="text-lg leading-none">{flag}</span>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-void-green/20 bg-void-black/60 py-2.5 pl-10 pr-10 text-sm text-void-text-mint outline-none transition-colors focus:border-void-green/50"
      >
        <option value="">{placeholder}</option>
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {countryFlag(c.code)} {c.name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-void-muted" />
    </div>
  );
}

/** Read-only country display with flag */
export function CountryBadge({ code }: { code: string | null | undefined }) {
  if (!code) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-void-text-mint">
      <span className="text-base">{countryFlag(code)}</span>
      {countryName(code)}
    </span>
  );
}
