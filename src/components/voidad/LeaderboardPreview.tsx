"use client";

import { useTranslations } from "next-intl";
import { VoidButton } from "@/components/ui/VoidButton";
import { Link } from "@/i18n/navigation";
import { LeaderboardMapBackdrop } from "@/components/leaderboard/LeaderboardMapBackdrop";
import { VoidGuardiansBoard } from "@/components/leaderboard/VoidGuardiansBoard";
import { VOID_GUARDIANS } from "@/components/leaderboard/guardians-data";

export function LeaderboardPreview() {
  const t = useTranslations("leaderboard");

  return (
    <div className="relative overflow-hidden rounded-xl border border-void-green/25 bg-void-black/40">
      <LeaderboardMapBackdrop />

      <div className="relative z-10 px-4 py-10 sm:px-6 sm:py-12">
        <VoidGuardiansBoard players={VOID_GUARDIANS} variant="preview" />

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/leaderboard">
            <VoidButton variant="secondary">{t("viewFull")}</VoidButton>
          </Link>
          <Link href="/signup">
            <VoidButton>{t("joinElite")}</VoidButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
