"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useUser } from "@/hooks/useUser";

type RequireAuthProps = {
  children: React.ReactNode;
};

/** Redirect guests to login — dashboard and VoidPoints require an account */
export function RequireAuth({ children }: RequireAuthProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-sm text-void-muted">{t("loading")}</p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
