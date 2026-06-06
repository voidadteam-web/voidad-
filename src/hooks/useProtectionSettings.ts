"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";

export type ProtectionSettings = {
  protection_enabled: boolean;
  anti_adware: boolean;
  anti_tracker: boolean;
  anti_phishing: boolean;
  false_positive_filter: boolean;
  geo_block: boolean;
  focus_mode_enabled: boolean;
  enhanced_ad_blocking: boolean;
};

const PROTECTION_COLUMNS =
  "protection_enabled, anti_adware, anti_tracker, anti_phishing, false_positive_filter, geo_block, focus_mode_enabled, enhanced_ad_blocking";

export const MAX_PROTECTION: ProtectionSettings = {
  protection_enabled: true,
  anti_adware: true,
  anti_tracker: true,
  anti_phishing: true,
  false_positive_filter: true,
  geo_block: true,
  focus_mode_enabled: true,
  enhanced_ad_blocking: true,
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
      setSettings(data);
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
