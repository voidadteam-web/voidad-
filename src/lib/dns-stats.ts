import type { SupabaseClient } from "@supabase/supabase-js";
import { levelForVoidpoints } from "@/lib/levels";

export type BlockEventInput = {
  domain: string;
  type: "ad" | "tracker" | "phishing";
  client_ip?: string | null;
};

export type RecordBlocksResult = {
  ok: boolean;
  ads?: number;
  trackers?: number;
  phishing?: number;
  points?: number;
  level?: number;
  voidpoints_total?: number;
  error?: string;
  detail?: string;
};

function tallyEvents(events: BlockEventInput[]) {
  let ads = 0;
  let trackers = 0;
  let phishing = 0;
  let points = 0;

  for (const event of events) {
    const type = event.type;
    if (type === "tracker") {
      trackers += 1;
      points += 1;
    } else if (type === "phishing") {
      phishing += 1;
      points += 2;
    } else {
      ads += 1;
      points += 1;
    }
  }

  return { ads, trackers, phishing, points };
}

/** Direct profile update when record_dns_blocks RPC / dns_activity_log is missing */
export async function recordBlocksFallback(
  admin: SupabaseClient,
  userId: string,
  events: BlockEventInput[],
): Promise<RecordBlocksResult> {
  const { ads, trackers, phishing, points } = tallyEvents(events);
  if (points === 0) {
    return { ok: false, error: "NO_EVENTS" };
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, voidpoints_total, ads_blocked, level")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return { ok: false, error: "USER_NOT_FOUND", detail: profileError?.message };
  }

  const voidpointsTotal = (profile.voidpoints_total ?? 0) + points;
  const newLevel = levelForVoidpoints(voidpointsTotal);

  const activityRows = events.map((event) => ({
    user_id: userId,
    domain: event.domain,
    block_type: event.type,
    client_ip: event.client_ip ?? null,
  }));

  const { error: activityError } = await admin
    .from("dns_activity_log")
    .insert(activityRows);

  if (activityError && !activityError.message.includes("does not exist")) {
    return { ok: false, error: "ACTIVITY_FAILED", detail: activityError.message };
  }

  const patch: Record<string, number> = {
    ads_blocked: (profile.ads_blocked ?? 0) + ads,
    voidpoints_total: voidpointsTotal,
    level: newLevel,
  };

  const { error: updateError } = await admin
    .from("profiles")
    .update(patch)
    .eq("id", userId);

  if (updateError) {
    return { ok: false, error: "UPDATE_FAILED", detail: updateError.message };
  }

  if (trackers > 0 || phishing > 0) {
    const { data: extended } = await admin
      .from("profiles")
      .select("trackers_blocked, malicious_blocked")
      .eq("id", userId)
      .maybeSingle();

    if (extended) {
      await admin
        .from("profiles")
        .update({
          trackers_blocked: (extended.trackers_blocked ?? 0) + trackers,
          malicious_blocked: (extended.malicious_blocked ?? 0) + phishing,
        })
        .eq("id", userId);
    }
  }

  return {
    ok: true,
    ads,
    trackers,
    phishing,
    points,
    level: newLevel,
    voidpoints_total: voidpointsTotal,
  };
}

export async function recordBlocks(
  admin: SupabaseClient,
  userId: string,
  events: BlockEventInput[],
): Promise<RecordBlocksResult> {
  const { data, error } = await admin.rpc("record_dns_blocks", {
    p_user_id: userId,
    p_events: events,
  });

  if (!error && data && typeof data === "object" && (data as { ok?: boolean }).ok) {
    return data as RecordBlocksResult;
  }

  const detail = error?.message ?? "RPC_FAILED";
  const needsFallback =
    detail.includes("does not exist") ||
    detail.includes("Could not find the function") ||
    detail.includes("record_dns_blocks");

  if (needsFallback) {
    console.warn("record_dns_blocks RPC unavailable, using fallback:", detail);
    return recordBlocksFallback(admin, userId, events);
  }

  return { ok: false, error: "RECORD_FAILED", detail };
}
