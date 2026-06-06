"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";

export type Profile = {
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  country_code: string | null;
  bio: string | null;
  voidpoints_total: number;
  voidpoints_donated: number;
  level: number;
  ads_blocked: number;
  is_public: boolean;
  hide_leaderboard: boolean;
};

const PROFILE_COLUMNS =
  "display_name, username, avatar_url, country_code, bio, voidpoints_total, voidpoints_donated, level, ads_blocked, is_public, hide_leaderboard";

export function useProfile() {
  const { user, loading: authLoading } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .eq("id", user.id)
        .single();

      setProfile(data);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    void loadProfile();
  }, [authLoading, loadProfile]);

  async function updateProfile(
    patch: Partial<
      Pick<
        Profile,
        | "display_name"
        | "username"
        | "country_code"
        | "bio"
        | "avatar_url"
        | "is_public"
        | "hide_leaderboard"
      >
    >,
  ) {
    if (!user || !isSupabaseConfigured()) {
      throw new Error("Not authenticated");
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", user.id)
      .select(PROFILE_COLUMNS)
      .single();

    if (error) throw error;
    setProfile(data);
    return data;
  }

  async function uploadAvatar(file: File) {
    if (!user || !isSupabaseConfigured()) {
      throw new Error("Not authenticated");
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/avatar.${ext}`;
    const supabase = createClient();

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    return updateProfile({ avatar_url: avatarUrl });
  }

  return {
    user,
    profile,
    loading: authLoading || loading,
    updateProfile,
    uploadAvatar,
    refetch: loadProfile,
  };
}
