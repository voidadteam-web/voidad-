import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseEnvReady, resolveSupabaseAnonKey, resolveSupabaseUrl } from "./env";

export function isSupabaseConfigured() {
  return isSupabaseEnvReady();
}

let client: SupabaseClient | undefined;

export function createClient() {
  const url = resolveSupabaseUrl();
  const key = resolveSupabaseAnonKey();

  if (!url || !key) {
    throw new Error("Supabase is not configured");
  }

  if (!client) {
    client = createBrowserClient(url, key);
  }

  return client;
}
