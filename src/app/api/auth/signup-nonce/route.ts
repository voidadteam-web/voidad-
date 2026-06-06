import { NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { hashNetworkFromRequest } from "@/lib/device/hash";

/** Issue a signup nonce after device/network eligibility check */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const deviceFingerprint = String(body.deviceFingerprint ?? "");

    if (!deviceFingerprint) {
      return NextResponse.json({ error: "DEVICE_INFO_REQUIRED" }, { status: 400 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ error: "SERVER_CONFIG" }, { status: 503 });
    }

    const networkHash = await hashNetworkFromRequest(request);
    const admin = createAdminClient();

    const { data: allowed, error: checkError } = await admin.rpc(
      "check_free_tier_device_available",
      {
        p_fingerprint_hash: deviceFingerprint,
        p_network_hash: networkHash,
      },
    );

    if (checkError) {
      return NextResponse.json({ error: "CHECK_FAILED" }, { status: 500 });
    }

    if (!allowed) {
      return NextResponse.json({ error: "DEVICE_ALREADY_REGISTERED" }, { status: 403 });
    }

    await admin.from("signup_network_nonces").delete().lt("expires_at", new Date().toISOString());

    const { error: nonceError } = await admin.from("signup_network_nonces").upsert(
      {
        fingerprint_hash: deviceFingerprint,
        network_hash: networkHash,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        used_at: null,
      },
      { onConflict: "fingerprint_hash,network_hash" },
    );

    if (nonceError) {
      return NextResponse.json({ error: "NONCE_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ networkHash });
  } catch {
    return NextResponse.json({ error: "INTERNAL" }, { status: 500 });
  }
}
