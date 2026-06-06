"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";

export type UserSettings = {
  notify_charity: boolean;
  notify_level_up: boolean;
  notify_protection: boolean;
  enhanced_ad_blocking: boolean;
  data_compression: boolean;
  zero_day_discovery: boolean;
  share_voidpoints: boolean;
  show_leaderboard_rank: boolean;
  two_factor_enabled: boolean;
};

const SETTINGS_COLUMNS =
  "notify_charity, notify_level_up, notify_protection, enhanced_ad_blocking, data_compression, zero_day_discovery, share_voidpoints, show_leaderboard_rank, two_factor_enabled";

export function useUserSettings() {
  const { user, loading: authLoading } = useUser();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) {
      setSettings(null);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("user_settings")
        .select(SETTINGS_COLUMNS)
        .eq("user_id", user.id)
        .single();

      setSettings(data);
    } catch {
      setSettings(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    void loadSettings();
  }, [authLoading, loadSettings]);

  async function updateSettings(patch: Partial<UserSettings>) {
    if (!user || !isSupabaseConfigured()) {
      throw new Error("Not authenticated");
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_settings")
      .update(patch)
      .eq("user_id", user.id)
      .select(SETTINGS_COLUMNS)
      .single();

    if (error) throw error;
    setSettings(data);
    return data;
  }

  return {
    settings,
    loading: authLoading || loading,
    updateSettings,
    refetch: loadSettings,
  };
}
