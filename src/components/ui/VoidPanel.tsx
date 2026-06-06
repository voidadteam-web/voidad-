import { cn } from "@/lib/utils";

interface VoidPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function VoidPanel({ children, className, title }: VoidPanelProps) {
  return (
    <section
      className={cn(
        "void-glow-border rounded-2xl bg-void-panel/80 p-5 backdrop-blur-sm",
        className,
      )}
    >
      {title && (
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-void-green">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
