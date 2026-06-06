"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { VoidButton } from "@/components/ui/VoidButton";
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
            <VoidButton className="min-w-[240px]">
              {t("meetGuardians")}
              <ChevronRight className="h-4 w-4" />
            </VoidButton>
          </Link>
          <Link href="/signup">
            <VoidButton variant="secondary">{t("joinElite")}</VoidButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
