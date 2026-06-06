"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { VoidButton } from "@/components/ui/VoidButton";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const t = useTranslations("nav");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <VoidPanel title={t("login")}>
        <form onSubmit={handleLogin} className="space-y-4">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-void-green/20 bg-void-black/60 px-4 py-2.5 text-sm text-void-text outline-none focus:border-void-green/50"
            />
          </div>
          {message && (
            <p className="text-xs text-red-400">{message}</p>
          )}
          <VoidButton type="submit" className="w-full" disabled={loading}>
            {loading ? "..." : t("login")}
          </VoidButton>
        </form>
        <p className="mt-4 text-center text-xs text-void-muted">
          No account?{" "}
          <Link href="/signup" className="text-void-green hover:underline">
            {t("signup")}
          </Link>
        </p>
      </VoidPanel>
    </div>
  );
}
