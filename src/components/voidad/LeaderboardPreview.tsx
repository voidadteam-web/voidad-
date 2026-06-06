"use client";

import { useTranslations } from "next-intl";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidButton } from "@/components/ui/VoidButton";
import { Link } from "@/i18n/navigation";
import { VoidGuardiansBoard } from "@/components/leaderboard/VoidGuardiansBoard";
import { VOID_GUARDIANS } from "@/components/leaderboard/guardians-data";

export function LeaderboardPreview() {
  const t = useTranslations("leaderboard");

  return (
    <VoidPanel glow="strong" className="overflow-hidden">
      <VoidGuardiansBoard players={VOID_GUARDIANS} variant="preview" />

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/leaderboard">
          <VoidButton variant="secondary">{t("viewFull")}</VoidButton>
        </Link>
        <Link href="/signup">
          <VoidButton>{t("joinElite")}</VoidButton>
        </Link>
      </div>
    </VoidPanel>
  );
}
