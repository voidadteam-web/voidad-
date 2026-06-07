"use client";

import { useCallback, useEffect, useState } from "react";

export type ActivityEntry = {
  domain: string;
  block_type: "ad" | "tracker" | "phishing" | "social" | "adult" | "gambling" | "keyword";
  client_ip: string | null;
  created_at: string;
};

export function useDnsActivity(pollMs = 5000) {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/dns/activity?limit=20");
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries ?? []);
      }
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const interval = window.setInterval(load, pollMs);
    return () => window.clearInterval(interval);
  }, [load, pollMs]);

  return { entries, loading, refetch: load };
}
