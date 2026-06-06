import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { resolveSupabaseUrl } from "./env";

export function getSupabaseUrl(): string | null {
  return resolveSupabaseUrl();
}

export function isAdminConfigured() {
  return Boolean(
    resolveSupabaseUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

export function createAdminClient(): SupabaseClient {
  const url = resolveSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    throw new Error("Supabase admin is not configured");
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
