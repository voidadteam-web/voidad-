/** Resolve Supabase project URL — fixes wrong Vercel env placeholders */
export function resolveSupabaseUrl(): string | null {
  const candidates = [
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_URL,
  ];

  for (const raw of candidates) {
    const normalized = normalizeUrl(raw);
    if (normalized && isValidSupabaseUrl(normalized)) {
      return normalized;
    }
  }

  return urlFromAnonKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function normalizeUrl(raw?: string | null): string | null {
  if (!raw) return null;
  const value = raw.trim().replace(/^["']|["']$/g, "");
  if (!value || value.includes("NEXT_PUBLIC") || value.includes("your-")) {
    return null;
  }
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value.replace(/\/$/, "");
  }
  return `https://${value.replace(/\/$/, "")}`;
}

function isValidSupabaseUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

function urlFromAnonKey(anonKey?: string | null): string | null {
  if (!anonKey) return null;
  try {
    const parts = anonKey.trim().split(".");
    if (parts.length < 2) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8"),
    ) as { ref?: string };
    if (payload.ref) {
      return `https://${payload.ref}.supabase.co`;
    }
  } catch {
    return null;
  }
  return null;
}

export function resolveSupabaseAnonKey(): string | null {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!key || key.includes("your-")) return null;
  return key;
}

export function isSupabaseEnvReady(): boolean {
  return Boolean(resolveSupabaseUrl() && resolveSupabaseAnonKey());
}
