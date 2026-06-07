"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";

export type ProfileMode = "default" | "child" | "strict";

export type ProtectionSettings = {
  protection_enabled: boolean;
  anti_adware: boolean;
  anti_tracker: boolean;
  anti_phishing: boolean;
  false_positive_filter: boolean;
  geo_block: boolean;
  focus_mode_enabled: boolean;
  enhanced_ad_blocking: boolean;
  profile_mode: ProfileMode;
  block_tiktok: boolean;
  block_social_media: boolean;
  block_adult_content: boolean;
  block_gambling: boolean;
  safe_search: boolean;
  blocked_keywords: string[];
};

const PROTECTION_COLUMNS =
  "protection_enabled, anti_adware, anti_tracker, anti_phishing, false_positive_filter, geo_block, focus_mode_enabled, enhanced_ad_blocking, profile_mode, block_tiktok, block_social_media, block_adult_content, block_gambling, safe_search, blocked_keywords";

export const MAX_PROTECTION: Partial<ProtectionSettings> = {
  protection_enabled: true,
  anti_adware: true,
  anti_tracker: true,
  anti_phishing: true,
  false_positive_filter: true,
  geo_block: true,
  focus_mode_enabled: true,
  enhanced_ad_blocking: true,
  block_gambling: true,
};

export const CHILD_PROFILE: Partial<ProtectionSettings> = {
  profile_mode: "child",
  protection_enabled: true,
  anti_adware: true,
  anti_tracker: true,
  anti_phishing: true,
  false_positive_filter: true,
  enhanced_ad_blocking: true,
  block_tiktok: true,
  block_social_media: true,
  block_adult_content: true,
  block_gambling: true,
  safe_search: true,
};

export const STRICT_PROFILE: Partial<ProtectionSettings> = {
  ...CHILD_PROFILE,
  profile_mode: "strict",
  geo_block: true,
  focus_mode_enabled: true,
};

export function useProtectionSettings() {
  const { user, loading: authLoading } = useUser();
  const [settings, setSettings] = useState<ProtectionSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        .select(PROTECTION_COLUMNS)
        .eq("user_id", user.id)
        .single();

      setSettings(
        data
          ? {
              ...data,
              profile_mode: (data.profile_mode as ProfileMode) ?? "default",
              blocked_keywords: data.blocked_keywords ?? [],
            }
          : null,
      );
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

  async function updateSettings(patch: Partial<ProtectionSettings>) {
    if (!user || !isSupabaseConfigured()) {
      throw new Error("Not authenticated");
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("user_settings")
        .update(patch)
        .eq("user_id", user.id)
        .select(PROTECTION_COLUMNS)
        .single();

      if (error) throw error;
      setSettings(
        data
          ? {
              ...data,
              profile_mode: (data.profile_mode as ProfileMode) ?? "default",
              blocked_keywords: data.blocked_keywords ?? [],
            }
          : null,
      );
      return data;
    } finally {
      setSaving(false);
    }
  }

  return {
    settings,
    loading: authLoading || loading,
    saving,
    updateSettings,
    refetch: loadSettings,
  };
}
