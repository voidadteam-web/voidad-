import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hashNetworkFromRequest } from "@/lib/device/hash";

export const runtime = "nodejs";

/** Verify Trial/Free user is on registered device/network after login */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const deviceFingerprint = String(body.deviceFingerprint ?? "").trim();

    if (!deviceFingerprint) {
      return NextResponse.json({ ok: false, reason: "DEVICE_INFO_REQUIRED" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, reason: "NOT_AUTHENTICATED" }, { status: 401 });
    }

    if (!user.email_confirmed_at) {
      return NextResponse.json({ ok: false, reason: "EMAIL_NOT_CONFIRMED" }, { status: 403 });
    }

    const networkHash = hashNetworkFromRequest(request);

    const { data, error } = await supabase.rpc("verify_user_device", {
      p_fingerprint_hash: deviceFingerprint,
      p_network_hash: networkHash,
    });

    if (error) {
      console.error("verify_user_device:", error.message);
      return NextResponse.json({ ok: false, reason: "VERIFY_FAILED" }, { status: 500 });
    }

    const result = data as { ok: boolean; reason: string };

    if (!result.ok) {
      await supabase.auth.signOut();
      return NextResponse.json(result, { status: 403 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("verify-device:", err);
    return NextResponse.json({ ok: false, reason: "INTERNAL" }, { status: 500 });
  }
}
