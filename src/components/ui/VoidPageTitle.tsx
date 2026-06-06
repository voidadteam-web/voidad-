import { cn } from "@/lib/utils";

interface VoidPageTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export function VoidPageTitle({ children, subtitle, className }: VoidPageTitleProps) {
  return (
    <div className={cn("mb-8 text-center sm:mb-10", className)}>
      <h1 className="void-page-title">{children}</h1>
      {subtitle && (
        <p className="mt-3 text-sm tracking-wide text-void-text-mint">{subtitle}</p>
      )}
    </div>
  );
}
