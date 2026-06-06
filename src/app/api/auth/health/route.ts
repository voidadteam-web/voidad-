import { NextResponse } from "next/server";
import { getSupabaseUrl, isAdminConfigured } from "@/lib/supabase/admin";
import { resolveSupabaseAnonKey } from "@/lib/supabase/env";

export const runtime = "nodejs";

export async function GET() {
  const url = getSupabaseUrl();
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const urlFromEnv =
    envUrl &&
    !envUrl.includes("NEXT_PUBLIC") &&
    envUrl.includes("supabase.co");

  return NextResponse.json({
    supabaseUrl: url ? `${url.slice(0, 32)}…` : null,
    urlSource: url ? (urlFromEnv ? "env" : "anon-key") : null,
    adminReady: isAdminConfigured(),
    anonReady: Boolean(resolveSupabaseAnonKey()),
  });
}
