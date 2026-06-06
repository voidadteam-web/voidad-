import { createHash } from "crypto";

export function hashNetworkFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  const salt = process.env.NETWORK_HASH_SALT ?? "voidad-network-v1";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
