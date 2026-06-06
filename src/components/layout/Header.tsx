"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { VoidLogo } from "@/components/voidad/VoidLogo";
import { VoidButton } from "@/components/ui/VoidButton";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { LevelMilitaryRank } from "@/components/leaderboard/LevelMilitaryRank";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { useProfile } from "@/hooks/useProfile";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const publicNavItems = [
  { href: "/pricing" as const, key: "pricing" as const },
  { href: "/about" as const, key: "about" as const },
];

const authNavItems = [
  { href: "/dashboard" as const, key: "dashboard" as const },
  { href: "/voidpoints" as const, key: "voidpoints" as const },
];

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { user, loading } = useUser();
  const { profile } = useProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName =
    profile?.display_name ??
    user?.user_metadata?.display_name ??
    user?.email?.split("@")[0] ??
    "";

  const playerLevel = profile?.level ?? 0;

  const navItems = user ? [...authNavItems, ...publicNavItems] : publicNavItems;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-void-green/15 bg-void-black/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4">
        <Link href="/" className="transition-opacity hover:opacity-95">
          <VoidLogo size="lg" priority />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "void-display text-xs font-semibold tracking-[0.15em] transition-colors",
                isActive(href)
                  ? "border-b-2 border-void-green pb-1 text-void-green void-glow-text"
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
              <Link
                href="/settings"
                className="hidden items-center gap-2 transition-opacity hover:opacity-90 sm:flex"
              >
                <LevelMilitaryRank
                  level={Math.min(Math.max(playerLevel, 1), 57)}
                  size="sm"
                />
                <span className="max-w-[120px] truncate text-xs font-medium text-void-text-mint">
                  {displayName}
                </span>
              </Link>
              <Link
                href="/settings"
                aria-label={t("settings")}
                className="hidden outline-none sm:block"
              >
                <ProfileAvatar
                  name={displayName || "?"}
                  avatarUrl={profile?.avatar_url}
                  size="xs"
                />
              </Link>
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
            </>
          )}

          <button
            type="button"
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-void-green/20 text-void-green lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-void-green/10 bg-void-dark/95 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "void-display py-2 text-sm tracking-wider",
                  isActive(href) ? "text-void-green" : "text-void-muted",
                )}
              >
                {t(key)}
              </Link>
            ))}
            {user && (
              <Link
                href="/settings"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-2"
              >
                <ProfileAvatar
                  name={displayName || "?"}
                  avatarUrl={profile?.avatar_url}
                  size="xs"
                />
                <LevelMilitaryRank
                  level={Math.min(Math.max(playerLevel, 1), 57)}
                  size="sm"
                />
                <span className="void-display truncate text-sm tracking-wider text-void-muted">
                  {displayName || t("settings")}
                </span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
