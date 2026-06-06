"use client";

import { LeaderboardMapBackdrop } from "@/components/leaderboard/LeaderboardMapBackdrop";
import { AllRanksLeaderboard } from "@/components/leaderboard/AllRanksLeaderboard";

export default function LeaderboardPage() {
  return (
    <section className="relative min-h-[calc(100vh-12rem)] overflow-hidden py-10 sm:py-14">
      <LeaderboardMapBackdrop />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <AllRanksLeaderboard />
      </div>
    </section>
  );
}
