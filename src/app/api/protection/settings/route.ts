import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Extension + dashboard: current family filter toggles for logged-in user */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("user_settings")
      .select(
        "protection_enabled, block_tiktok, block_social_media, block_adult_content, block_gambling, safe_search, blocked_keywords, profile_mode",
      )
      .eq("user_id", user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      filters: {
        protection_enabled: data.protection_enabled,
        block_tiktok: data.block_tiktok,
        block_social_media: data.block_social_media,
        block_adult_content: data.block_adult_content,
        block_gambling: data.block_gambling,
        safe_search: data.safe_search,
        blocked_keywords: data.blocked_keywords ?? [],
        profile_mode: data.profile_mode,
      },
    });
  } catch {
    return NextResponse.json({ error: "INTERNAL" }, { status: 500 });
  }
}
