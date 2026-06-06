import { NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { hashNetworkFromRequest } from "@/lib/device/hash";

export const runtime = "nodejs";

/** Issue a signup nonce after device/network eligibility check */
export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "SERVER_CONFIG" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const deviceFingerprint = String(body.deviceFingerprint ?? "").trim();

    if (!deviceFingerprint || deviceFingerprint.length < 32) {
      return NextResponse.json({ error: "DEVICE_INFO_REQUIRED" }, { status: 400 });
    }

    const networkHash = hashNetworkFromRequest(request);
    const admin = createAdminClient();

    const { data, error } = await admin.rpc("prepare_signup", {
      p_fingerprint_hash: deviceFingerprint,
      p_network_hash: networkHash,
    });

    if (error) {
      console.error("prepare_signup error:", error.message);
      // Fallback if migration 003 not run yet
      if (error.message.includes("prepare_signup")) {
        return await legacyPrepareSignup(admin, deviceFingerprint, networkHash);
      }
      return NextResponse.json(
        { error: "CHECK_FAILED", detail: error.message },
        { status: 500 },
      );
    }

    const result = data as { ok: boolean; error?: string; network_hash?: string };

    if (!result?.ok) {
      const code = result?.error ?? "DEVICE_ALREADY_REGISTERED";
      return NextResponse.json({ error: code }, { status: 403 });
    }

    return NextResponse.json({ networkHash: result.network_hash ?? networkHash });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "unknown";
    console.error("signup-nonce internal:", detail);
    return NextResponse.json({ error: "INTERNAL", detail }, { status: 500 });
  }
}

async function legacyPrepareSignup(
  admin: ReturnType<typeof createAdminClient>,
  deviceFingerprint: string,
  networkHash: string,
) {
  const { data: allowed, error: checkError } = await admin.rpc(
    "check_free_tier_device_available",
    {
      p_fingerprint_hash: deviceFingerprint,
      p_network_hash: networkHash,
    },
  );

  if (checkError) {
    return NextResponse.json(
      { error: "CHECK_FAILED", detail: checkError.message },
      { status: 500 },
    );
  }

  if (!allowed) {
    return NextResponse.json({ error: "DEVICE_ALREADY_REGISTERED" }, { status: 403 });
  }

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
    return NextResponse.json(
      { error: "NONCE_FAILED", detail: nonceError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ networkHash });
}
