"use client";

import { useTranslations } from "next-intl";
import { VoidLogo } from "@/components/voidad/VoidLogo";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-void-green/10 bg-void-dark/80">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <VoidLogo size="sm" />
          <p className="text-xs text-void-muted">{t("tagline")}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs text-void-muted">
          <Link href="/about" className="hover:text-void-green">
            {t("privacy")}
          </Link>
          <Link href="/about" className="hover:text-void-green">
            {t("terms")}
          </Link>
          <Link href="/about" className="hover:text-void-green">
            {t("gdpr")}
          </Link>
        </div>

        <p className="text-xs text-void-muted">
          © {year} VoidAd. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
