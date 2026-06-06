import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("dns_profiles")
      .select("token, home_ips, is_active, updated_at")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "NO_DNS_PROFILE" }, { status: 404 });
    }

    const { data: settings } = await supabase
      .from("user_settings")
      .select(
        "protection_enabled, anti_adware, anti_tracker, anti_phishing, enhanced_ad_blocking",
      )
      .eq("user_id", user.id)
      .single();

    const primary = process.env.NEXT_PUBLIC_VOIDAD_DNS_PRIMARY ?? "127.0.0.1";
    const secondary = process.env.NEXT_PUBLIC_VOIDAD_DNS_SECONDARY ?? "1.1.1.1";
    const dohHost = process.env.NEXT_PUBLIC_VOIDAD_DOH_HOST ?? "dns.voidad.com";

    return NextResponse.json({
      token: profile.token,
      homeIps: profile.home_ips ?? [],
      isActive: profile.is_active,
      updatedAt: profile.updated_at,
      protection: settings ?? {},
      dns: {
        primary,
        secondary,
        dohUrl: `https://${dohHost}/dns-query/${profile.token}`,
      },
    });
  } catch {
    return NextResponse.json({ error: "INTERNAL" }, { status: 500 });
  }
}
