import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface PricingTierCardProps {
  name: string;
  price: string;
  period?: string;
  features: { icon: LucideIcon; text: string }[];
  cta: string;
  href: "/signup";
  highlighted?: boolean;
  badge?: string;
}

export function PricingTierCard({
  name,
  price,
  period,
  features,
  cta,
  href,
  highlighted = false,
  badge,
}: PricingTierCardProps) {
  return (
    <article
      className={cn(
        "void-pricing-card relative flex flex-col p-5 sm:p-6",
        highlighted && "void-pricing-card-popular z-10 lg:scale-[1.04]",
      )}
    >
      {badge && (
        <span className="void-display absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-void-green/60 bg-void-black px-3 py-0.5 text-[10px] font-bold tracking-wider text-void-green">
          {badge}
        </span>
      )}

      <h3 className="void-display text-base font-bold text-white">{name}</h3>

      <div className="mt-3">
        <p className="text-2xl font-bold tracking-tight text-white sm:text-[1.65rem]">
          {price}
          {period ? (
            <span className="ml-1 text-sm font-normal text-void-muted">{period}</span>
          ) : null}
        </p>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {features.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-2.5">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-void-green" strokeWidth={1.75} />
            <span className="text-xs leading-snug text-void-text-mint">{text}</span>
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={cn(
          "void-display mt-6 block w-full py-2.5 text-center text-xs font-bold tracking-[0.15em]",
          highlighted ? "void-pricing-btn-solid" : "void-pricing-btn-outline",
        )}
      >
        {cta}
      </Link>
    </article>
  );
}
