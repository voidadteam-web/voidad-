"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidButton } from "@/components/ui/VoidButton";
import { VoidPageTitle } from "@/components/ui/VoidPageTitle";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getDeviceFingerprint } from "@/lib/device/fingerprint";
import {
  PASSWORD_MIN_LENGTH,
  passwordRuleFailures,
  passwordsMatch,
} from "@/lib/auth/password";
import { Mail, Lock, User, Shield, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [deviceBlocked, setDeviceBlocked] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setDeviceBlocked(false);

    if (!isSupabaseConfigured()) {
      setMessage(t("notConfigured"));
      setLoading(false);
      return;
    }

    const ruleFailure = passwordRuleFailures(password)[0];
    if (ruleFailure) {
      setMessage(t(ruleFailure));
      setLoading(false);
      return;
    }

    if (!passwordsMatch(password, confirmPassword)) {
      setMessage(t("passwordMismatch"));
      setLoading(false);
      return;
    }

    try {
      const deviceFingerprint = await getDeviceFingerprint();

      const nonceRes = await fetch("/api/auth/signup-nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceFingerprint }),
      });

      const nonceData = await nonceRes.json();

      if (!nonceRes.ok) {
        if (nonceData.error === "DEVICE_ALREADY_REGISTERED") {
          setDeviceBlocked(true);
        } else if (nonceData.error === "SERVER_CONFIG") {
          setMessage(t("serverNotReady"));
        } else if (nonceData.error === "CHECK_FAILED" || nonceData.error === "NONCE_FAILED") {
          const detail = String(nonceData.detail ?? "").toLowerCase();
          if (detail.includes("fetch failed") || detail.includes("enotfound")) {
            setMessage(t("serverNotReady"));
          } else {
            setMessage(t("databaseNotReady"));
          }
        } else {
          setMessage(nonceData.detail ? `${t("signupFailed")} (${nonceData.detail})` : t("signupFailed"));
        }
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const origin = window.location.origin;

      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=/${locale}/dashboard`,
          data: {
            display_name: displayName.trim() || "Void Guardian",
            device_fingerprint: deviceFingerprint,
            network_hash: nonceData.networkHash,
            subscription_plan: "trial",
            locale,
          },
        },
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("device") || msg.includes("registered")) {
          setDeviceBlocked(true);
        } else if (msg.includes("already")) {
          setMessage(t("emailExists"));
        } else {
          setMessage(error.message);
        }
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setMessage(t("unexpectedError"));
    }

    setLoading(false);
  }

  const inputClass =
    "w-full rounded-lg border border-void-green/20 bg-void-black/60 px-4 py-2.5 text-sm text-void-text outline-none focus:border-void-green/50";

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <VoidPageTitle subtitle={t("signupSubtitle")}>{t("signupTitle")}</VoidPageTitle>

      <VoidPanel glow="strong">
        {success ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-void-green" />
            <p className="mt-4 text-sm text-void-text-mint">{t("confirmEmail")}</p>
            <p className="mt-2 text-xs text-void-muted">{t("trialNote")}</p>
            <Link
              href="/login"
              className="mt-6 inline-block text-xs text-void-green hover:underline"
            >
              {t("loginButton")}
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-void-green/20 bg-void-green/5 px-3 py-2">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-void-green" />
              <p className="text-[11px] leading-relaxed text-void-text-mint">
                {t("devicePolicy")}
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="void-section-title mb-1 block text-[10px] text-void-muted">
                  {t("displayName")}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-void-green/60" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
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
                    minLength={PASSWORD_MIN_LENGTH}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <p className="mt-1 text-[10px] text-void-muted">{t("passwordHint")}</p>
              </div>
              <div>
                <label className="void-section-title mb-1 block text-[10px] text-void-muted">
                  {t("confirmPassword")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-void-green/60" />
                  <input
                    type="password"
                    required
                    minLength={PASSWORD_MIN_LENGTH}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {deviceBlocked && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <div className="space-y-3 text-xs text-red-300">
                      <p>{t("deviceAlreadyRegisteredTitle")}</p>
                      <p>
                        {t("deviceAlreadyRegisteredSignIn")}{" "}
                        <Link href="/login" className="font-semibold text-void-green hover:underline">
                          {t("loginButton")}
                        </Link>
                      </p>
                      <p>{t("deviceAlreadyRegisteredUpgrade")}</p>
                      <Link
                        href="/pricing"
                        className="inline-block font-semibold text-void-green hover:underline"
                      >
                        {t("upgradeToProLink")}
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {message && !deviceBlocked && (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <p className="text-xs text-red-300">{message}</p>
                </div>
              )}

              <VoidButton type="submit" className="w-full" disabled={loading}>
                {loading ? t("loading") : t("signupButton")}
              </VoidButton>
            </form>

            <p className="mt-4 text-center text-xs text-void-muted">
              {t("hasAccount")}{" "}
              <Link href="/login" className="text-void-green hover:underline">
                {t("loginButton")}
              </Link>
            </p>
          </>
        )}
      </VoidPanel>
    </div>
  );
}
