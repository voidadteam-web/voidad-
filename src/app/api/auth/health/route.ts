import { NextResponse } from "next/server";
import { getSupabaseUrl, isAdminConfigured } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  const url = getSupabaseUrl();
  return NextResponse.json({
    supabaseUrl: url ? `${url.slice(0, 24)}…` : null,
    adminReady: isAdminConfigured(),
    anonReady: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()),
  });
}
