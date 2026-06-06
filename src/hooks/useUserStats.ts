"use client";

import { useMemo } from "react";
import { useProfile } from "@/hooks/useProfile";
import { buildUserStats, type UserStats } from "@/lib/user-stats";

const EMPTY_STATS: UserStats = buildUserStats({
  level: 0,
  voidpointsTotal: 0,
  voidpointsDonated: 0,
  adsBlocked: 0,
  trackersBlocked: 0,
  maliciousBlocked: 0,
});

export function useUserStats() {
  const profileHook = useProfile();
  const { user, profile, loading } = profileHook;

  const stats = useMemo(
    () =>
      profile
        ? buildUserStats({
            level: profile.level,
            voidpointsTotal: profile.voidpoints_total,
            voidpointsDonated: profile.voidpoints_donated,
            adsBlocked: profile.ads_blocked,
            trackersBlocked: profile.trackers_blocked,
            maliciousBlocked: profile.malicious_blocked,
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
    refetch: profileHook.refetch,
  };
}
