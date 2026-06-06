"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidButton } from "@/components/ui/VoidButton";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function SignupPage() {
  const t = useTranslations("nav");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!isSupabaseConfigured()) {
      setMessage("Auth is not configured. Please contact support.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || "Void Guardian" },
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <VoidPanel title={t("signup")}>
        {success ? (
          <div className="text-center">
            <p className="text-sm text-void-green">
              Check your email to confirm your account.
            </p>
            <Link href="/login" className="mt-4 inline-block text-xs text-void-muted hover:text-void-green">
              {t("login")}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-void-muted">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-void-green/20 bg-void-black/60 px-4 py-2.5 text-sm text-void-text outline-none focus:border-void-green/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-void-muted">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-void-green/20 bg-void-black/60 px-4 py-2.5 text-sm text-void-text outline-none focus:border-void-green/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-void-muted">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-void-green/20 bg-void-black/60 px-4 py-2.5 text-sm text-void-text outline-none focus:border-void-green/50"
              />
            </div>
            {message && (
              <p className="text-xs text-red-400">{message}</p>
            )}
            <VoidButton type="submit" className="w-full" disabled={loading}>
              {loading ? "..." : t("signup")}
            </VoidButton>
          </form>
        )}
        {!success && (
          <p className="mt-4 text-center text-xs text-void-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-void-green hover:underline">
              {t("login")}
            </Link>
          </p>
        )}
      </VoidPanel>
    </div>
  );
}
