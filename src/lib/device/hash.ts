export async function hashString(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashNetworkFromRequest(request: Request): Promise<string> {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  const salt = process.env.NETWORK_HASH_SALT ?? "voidad-network-v1";
  return hashString(`${salt}:${ip}`);
}
