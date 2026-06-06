"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { isExtensionInstalled, pingExtension, syncExtensionUser } from "@/lib/extension/sync";

/** Auto-sync VoidAd account with the browser extension when logged in */
export function ExtensionSync() {
  const { user } = useUser();

  useEffect(() => {
    let cancelled = false;

    async function sync() {
      const installed = isExtensionInstalled() || (await pingExtension());
      if (cancelled || !installed || !user?.id || !user.email) return;

      await syncExtensionUser({
        userId: user.id,
        email: user.email,
        displayName: String(user.user_metadata?.display_name ?? ""),
        protectionEnabled: true,
      });
    }

    void sync();
    const interval = window.setInterval(sync, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [user]);

  return null;
}

export function useExtensionStatus() {
  const [installed, setInstalled] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const found = isExtensionInstalled() || (await pingExtension());
      if (!cancelled) {
        setInstalled(found);
        setChecking(false);
      }
    }

    void check();
    const interval = window.setInterval(check, 3000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return { installed, checking, ready: !checking };
}
