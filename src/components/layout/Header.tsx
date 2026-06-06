"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { VoidLogo } from "@/components/voidad/VoidLogo";
import { VoidButton } from "@/components/ui/VoidButton";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { LogOut, User } from "lucide-react";

const navItems = [
  { href: "/dashboard" as const, key: "dashboard" as const },
  { href: "/voidpoints" as const, key: "voidpoints" as const },
  { href: "/about" as const, key: "about" as const },
];

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();

  const displayName =
    user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "";

  async function handleSignOut() {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-void-green/10 bg-void-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="transition-opacity hover:opacity-90">
          <VoidLogo size="md" priority />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === href || pathname.startsWith(`${href}/`)
                  ? "border-b-2 border-void-green pb-0.5 text-void-green"
                  : "text-void-muted hover:text-void-green",
              )}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!loading && user ? (
            <>
              <Link href="/dashboard" className="hidden sm:block">
                <span className="text-xs font-medium text-void-green">
                  {displayName}
                </span>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                aria-label={t("logout")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-void-green/30 bg-void-panel text-void-green transition-colors hover:border-void-green/60"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <VoidButton variant="ghost" className="py-2 text-xs">
                  {t("login")}
                </VoidButton>
              </Link>
              <Link href="/signup">
                <VoidButton className="py-2 text-xs">{t("signup")}</VoidButton>
              </Link>
              <Link
                href="/login"
                aria-label={t("login")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-void-green/30 bg-void-panel text-void-green sm:hidden"
              >
                <User className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
