import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface VoidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-void-green-dim to-void-green text-void-black hover:from-void-green hover:to-void-green-bright shadow-[0_0_24px_rgba(0,255,153,0.35)]",
  secondary:
    "border border-void-green/50 text-void-green hover:bg-void-green/10 hover:shadow-[0_0_16px_rgba(0,255,153,0.15)]",
  ghost: "text-void-muted hover:text-void-green hover:bg-void-green/5",
  danger: "border border-red-500/40 text-red-400 hover:bg-red-500/10",
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
        "void-display inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold tracking-wider transition-all disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
