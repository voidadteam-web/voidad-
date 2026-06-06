import { NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

/** Internal sync endpoint for the VoidAd DNS server */
export async function GET(request: Request) {
  const syncKey = process.env.VOIDAD_DNS_SYNC_KEY?.trim();
  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!syncKey || auth !== syncKey) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "SERVER_CONFIG" }, { status: 503 });
  }

  try {
    const admin = createAdminClient();

    const { data: profiles, error: profilesError } = await admin
      .from("dns_profiles")
      .select("user_id, token, home_ips, is_active")
      .eq("is_active", true);

    if (profilesError) {
      return NextResponse.json({ error: profilesError.message }, { status: 500 });
    }

    const userIds = (profiles ?? []).map((p) => p.user_id);
    const { data: settingsRows } = userIds.length
      ? await admin
          .from("user_settings")
          .select(
            "user_id, protection_enabled, anti_adware, anti_tracker, anti_phishing, enhanced_ad_blocking",
          )
          .in("user_id", userIds)
      : { data: [] };

    const settingsByUser = new Map(
      (settingsRows ?? []).map((row) => [row.user_id as string, row]),
    );

    const tenants = (profiles ?? []).map((profile) => ({
      userId: profile.user_id,
      token: profile.token,
      homeIps: profile.home_ips ?? [],
      isActive: profile.is_active,
      settings: settingsByUser.get(profile.user_id) ?? {
        protection_enabled: true,
        anti_adware: true,
        anti_tracker: true,
        anti_phishing: true,
        enhanced_ad_blocking: false,
      },
    }));

    return NextResponse.json({ tenants, syncedAt: new Date().toISOString() });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: "INTERNAL", detail }, { status: 500 });
  }
}
