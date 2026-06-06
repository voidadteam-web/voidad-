"use client";

import { useMemo } from "react";
import { useProfile } from "@/hooks/useProfile";
import { buildUserStats, type UserStats } from "@/lib/user-stats";

const EMPTY_STATS: UserStats = buildUserStats({
  level: 0,
  voidpointsTotal: 0,
  voidpointsDonated: 0,
  adsBlocked: 0,
});

export function useUserStats() {
  const { user, profile, loading } = useProfile();

  const stats = useMemo(
    () =>
      profile
        ? buildUserStats({
            level: profile.level,
            voidpointsTotal: profile.voidpoints_total,
            voidpointsDonated: profile.voidpoints_donated,
            adsBlocked: profile.ads_blocked,
          })
        : EMPTY_STATS,
    [profile],
  );

  return {
    user,
    profile,
    stats,
    loading,
    isAuthenticated: !!user,
  };
}
