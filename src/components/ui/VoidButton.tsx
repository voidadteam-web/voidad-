import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface VoidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  asChild?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-void-green text-void-black hover:bg-[#5dff3a] shadow-[0_0_24px_rgba(57,255,20,0.35)]",
  secondary:
    "border border-void-green/50 text-void-green hover:bg-void-green/10",
  ghost: "text-void-muted hover:text-void-green hover:bg-void-green/5",
  danger:
    "border border-red-500/40 text-red-400 hover:bg-red-500/10",
};

export function VoidButton({
  className,
  variant = "primary",
  children,
  ...props
}: VoidButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-all disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
