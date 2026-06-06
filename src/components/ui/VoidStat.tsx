import { cn } from "@/lib/utils";

interface VoidStatProps {
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
}

export function VoidStat({ label, value, unit, className }: VoidStatProps) {
  return (
    <div className={cn("text-center", className)}>
      <p className="void-section-title text-[10px] text-void-muted">{label}</p>
      <p className="void-display mt-1 text-2xl font-bold text-void-green void-glow-text">
        {typeof value === "number" ? value.toLocaleString() : value}
        {unit && (
          <span className="ml-1 text-sm font-normal normal-case tracking-normal text-void-muted">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}
