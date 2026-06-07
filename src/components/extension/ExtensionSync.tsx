"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useProtectionSettings } from "@/hooks/useProtectionSettings";
import {
  getExtensionRuntimeState,
  isExtensionInstalled,
  pingExtension,
  syncExtensionUser,
} from "@/lib/extension/sync";

/** Auto-sync VoidAd account + family filters with the browser extension */
export function ExtensionSync() {
  const { user } = useUser();
  const { settings } = useProtectionSettings();

  useEffect(() => {
    let cancelled = false;

    async function sync() {
      const installed = isExtensionInstalled() || (await pingExtension());
      if (cancelled || !installed || !user?.id || !user.email) return;

      await syncExtensionUser({
        userId: user.id,
        email: user.email,
        displayName: String(user.user_metadata?.display_name ?? ""),
        protectionEnabled: settings?.protection_enabled !== false,
        familyFilters: settings
          ? {
              block_tiktok: settings.block_tiktok,
              block_social_media: settings.block_social_media,
              block_adult_content: settings.block_adult_content,
              block_gambling: settings.block_gambling,
              safe_search: settings.safe_search,
              blocked_keywords: settings.blocked_keywords ?? [],
              profile_mode: settings.profile_mode,
            }
          : undefined,
      });
    }

    void sync();
    const interval = window.setInterval(sync, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [user, settings]);

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

export function useExtensionRuntimeState() {
  const { installed, ready } = useExtensionStatus();
  const [state, setState] = useState<{ blockedCount: number; protectionEnabled: boolean } | null>(
    null,
  );

  useEffect(() => {
    if (!ready || !installed) {
      setState(null);
      return;
    }

    let cancelled = false;

    async function poll() {
      const runtime = await getExtensionRuntimeState();
      if (!cancelled && runtime) {
        setState({
          blockedCount: runtime.blockedCount,
          protectionEnabled: runtime.protectionEnabled,
        });
      }
    }

    void poll();
    const interval = window.setInterval(poll, 4000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [installed, ready]);

  return state;
}
