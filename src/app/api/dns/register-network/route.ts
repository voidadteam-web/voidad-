import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const fromForwarded = forwarded?.split(",")[0]?.trim();
  if (fromForwarded) return fromForwarded;

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: "NOT_AUTHENTICATED" }, { status: 401 });
    }

    const ip = getClientIp(request);
    const { data, error } = await supabase.rpc("register_dns_home_ip", { p_ip: ip });

    if (error) {
      console.error("register_dns_home_ip:", error.message);
      return NextResponse.json({ ok: false, error: "REGISTER_FAILED" }, { status: 500 });
    }

    const result = data as { ok: boolean; error?: string; home_ips?: string[] };

    if (!result.ok) {
      const status = result.error === "MAX_NETWORKS" ? 409 : 400;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}
