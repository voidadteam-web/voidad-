import { cn } from "@/lib/utils";

interface VoidPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  glow?: "default" | "strong" | "none";
}

export function VoidPanel({
  children,
  className,
  title,
  glow = "default",
}: VoidPanelProps) {
  return (
    <section
      className={cn(
        "rounded-xl void-glass-panel p-5 backdrop-blur-sm",
        glow === "strong" && "void-glow-border-strong",
        glow === "default" && "void-glow-border",
        className,
      )}
    >
      {title && <h2 className="void-section-title mb-4">{title}</h2>}
      {children}
    </section>
  );
}
