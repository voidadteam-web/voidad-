import { NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

type BlockEvent = {
  domain: string;
  type: "ad" | "tracker" | "phishing";
  client_ip?: string;
};

/** DNS server reports blocked domains → updates stats & VoidPoints */
export async function POST(request: Request) {
  const syncKey = process.env.VOIDAD_DNS_SYNC_KEY?.trim();
  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!syncKey || auth !== syncKey) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "SERVER_CONFIG" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const userId = String(body.userId ?? "").trim();
    const events = (body.events ?? []) as BlockEvent[];

    if (!userId || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    }

    const normalized = events
      .filter((e) => e?.domain)
      .slice(0, 200)
      .map((e) => ({
        domain: String(e.domain),
        type: ["ad", "tracker", "phishing"].includes(e.type) ? e.type : "ad",
        client_ip: e.client_ip ?? null,
      }));

    const admin = createAdminClient();
    const { data, error } = await admin.rpc("record_dns_blocks", {
      p_user_id: userId,
      p_events: normalized,
    });

    if (error) {
      console.error("record_dns_blocks:", error.message);
      return NextResponse.json({ error: "RECORD_FAILED", detail: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    const detail = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: "INTERNAL", detail }, { status: 500 });
  }
}
