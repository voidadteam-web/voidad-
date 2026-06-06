"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidButton } from "@/components/ui/VoidButton";
import { VoidPageTitle } from "@/components/ui/VoidPageTitle";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getDeviceFingerprint } from "@/lib/device/fingerprint";
import { Mail, Lock, AlertCircle } from "lucide-react";

const ERROR_KEYS: Record<string, string> = {
  DEVICE_MISMATCH: "deviceMismatch",
  DEVICE_ALREADY_REGISTERED: "deviceAlreadyRegistered",
  EMAIL_NOT_CONFIRMED: "emailNotConfirmed",
  INVALID_CREDENTIALS: "invalidCredentials",
};

export default function LoginPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [needsConfirm, setNeedsConfirm] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setNeedsConfirm(false);

    if (!isSupabaseConfigured()) {
      setMessage(t("notConfigured"));
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage(t("invalidCredentials"));
        setLoading(false);
        return;
      }

      if (!data.user?.email_confirmed_at) {
        await supabase.auth.signOut();
        setNeedsConfirm(true);
        setMessage(t("emailNotConfirmed"));
        setLoading(false);
        return;
      }

      const fingerprint = await getDeviceFingerprint();
      const verifyRes = await fetch("/api/auth/verify-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceFingerprint: fingerprint }),
      });

      const verify = await verifyRes.json();

      if (!verify.ok) {
        const key = ERROR_KEYS[verify.reason] ?? "deviceMismatch";
        setMessage(t(key));
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setMessage(t("unexpectedError"));
    }

    setLoading(false);
  }

  async function resendConfirmation() {
    if (!email || !isSupabaseConfigured()) return;
    const supabase = createClient();
    const origin = window.location.origin;
    await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/${locale}/dashboard`,
      },
    });
    setMessage(t("confirmEmailSent"));
  }

  const inputClass =
    "w-full rounded-lg border border-void-green/20 bg-void-black/60 px-4 py-2.5 text-sm text-void-text outline-none focus:border-void-green/50";

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <VoidPageTitle>{t("loginTitle")}</VoidPageTitle>

      <VoidPanel glow="strong">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="void-section-title mb-1 block text-[10px] text-void-muted">
              {t("email")}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-void-green/60" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
          <div>
            <label className="void-section-title mb-1 block text-[10px] text-void-muted">
              {t("password")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-void-green/60" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {message && (
            <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p className="text-xs text-red-300">{message}</p>
            </div>
          )}

          {needsConfirm && (
            <VoidButton
              type="button"
              variant="secondary"
              className="w-full text-xs"
              onClick={resendConfirmation}
            >
              {t("resendConfirm")}
            </VoidButton>
          )}

          <VoidButton type="submit" className="w-full" disabled={loading}>
            {loading ? t("loading") : t("loginButton")}
          </VoidButton>
        </form>

        <p className="mt-4 text-center text-xs text-void-muted">
          {t("noAccount")}{" "}
          <Link href="/signup" className="text-void-green hover:underline">
            {t("signupLink")}
          </Link>
        </p>
      </VoidPanel>
    </div>
  );
}
