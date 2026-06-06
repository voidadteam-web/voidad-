"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";

export type RecentDonation = {
  id: string;
  points: number;
  createdAt: string;
  charityNameEn: string;
  charityNameDe: string;
};

export function useRecentDonations(limit = 5) {
  const { user, loading: authLoading } = useUser();
  const [donations, setDonations] = useState<RecentDonation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) {
      setDonations([]);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("donations")
        .select("id, points, created_at, charities(name_en, name_de)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      const rows = data ?? [];

      setDonations(
        rows.map((row) => {
          const charity = Array.isArray(row.charities)
            ? row.charities[0]
            : row.charities;
          return {
            id: row.id as string,
            points: row.points as number,
            createdAt: row.created_at as string,
            charityNameEn: (charity?.name_en as string | undefined) ?? "Charity",
            charityNameDe: (charity?.name_de as string | undefined) ?? "Charity",
          };
        }),
      );
    } catch {
      setDonations([]);
    } finally {
      setLoading(false);
    }
  }, [user, limit]);

  useEffect(() => {
    if (authLoading) return;
    void load();
  }, [authLoading, load]);

  return { donations, loading: authLoading || loading, refetch: load };
}
