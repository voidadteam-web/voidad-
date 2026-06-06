import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

type BlockEvent = {
  domain: string;
  type?: "ad" | "tracker" | "phishing";
  client_ip?: string | null;
};

/** Extension or browser reports blocked ads/trackers → updates profile stats */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ error: "SERVER_CONFIG" }, { status: 503 });
    }

    const body = await request.json();
    const events = (body.events ?? []) as BlockEvent[];

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    }

    const normalized = events
      .filter((e) => e?.domain)
      .slice(0, 100)
      .map((e) => ({
        domain: String(e.domain),
        type: ["ad", "tracker", "phishing"].includes(String(e.type))
          ? e.type
          : "ad",
        client_ip: e.client_ip ?? null,
      }));

    const admin = createAdminClient();
    const { data, error } = await admin.rpc("record_dns_blocks", {
      p_user_id: user.id,
      p_events: normalized,
    });

    if (error) {
      console.error("record_dns_blocks:", error.message);
      return NextResponse.json(
        { error: "RECORD_FAILED", detail: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "INTERNAL" }, { status: 500 });
  }
}
