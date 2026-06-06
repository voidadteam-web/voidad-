"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";

type Profile = {
  display_name: string | null;
  voidpoints_total: number;
  level: number;
  ads_blocked: number;
};

export function useProfile() {
  const { user, loading: authLoading } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    async function loadProfile() {
      if (!user) {
        if (!cancelled) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("display_name, voidpoints_total, level, ads_blocked")
        .eq("id", user.id)
        .single();

      if (!cancelled) {
        setProfile(data);
        setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return { user, profile, loading: authLoading || loading };
}
