import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Register 127.0.0.1 + ::1 so local DNS proxy stats link to this account */
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: "NOT_AUTHENTICATED" }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("register_dns_home_ip", {
      p_ip: "127.0.0.1",
    });

    if (error) {
      console.error("register_dns_home_ip (local):", error.message);
      return NextResponse.json({ ok: false, error: "REGISTER_FAILED" }, { status: 500 });
    }

    const result = data as { ok: boolean; error?: string; home_ips?: string[] };
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}
