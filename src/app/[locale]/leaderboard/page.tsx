"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { VoidButton } from "@/components/ui/VoidButton";
import { LeaderboardMapBackdrop } from "@/components/leaderboard/LeaderboardMapBackdrop";
import { VoidGuardiansBoard } from "@/components/leaderboard/VoidGuardiansBoard";
import { VOID_GUARDIANS } from "@/components/leaderboard/guardians-data";

export default function LeaderboardPage() {
  const t = useTranslations("leaderboard");

  return (
    <section className="relative min-h-[calc(100vh-12rem)] overflow-hidden py-10 sm:py-14">
      <LeaderboardMapBackdrop />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <VoidGuardiansBoard players={VOID_GUARDIANS} variant="full" />

        <div className="mt-12 flex justify-center">
          <Link href="/signup">
            <VoidButton className="min-w-[280px] px-10 py-3.5 text-sm tracking-[0.15em]">
              {t("startJourney")}
            </VoidButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
