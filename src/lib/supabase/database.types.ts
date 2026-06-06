export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          country_code: string | null;
          bio: string | null;
          voidpoints_total: number;
          voidpoints_donated: number;
          level: number;
          ads_blocked: number;
          is_public: boolean;
          hide_leaderboard: boolean;
          locale: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          country_code?: string | null;
          bio?: string | null;
          voidpoints_total?: number;
          voidpoints_donated?: number;
          level?: number;
          ads_blocked?: number;
          is_public?: boolean;
          hide_leaderboard?: boolean;
          locale?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      user_settings: {
        Row: {
          user_id: string;
          protection_enabled: boolean;
          anti_adware: boolean;
          anti_tracker: boolean;
          anti_phishing: boolean;
          false_positive_filter: boolean;
          geo_block: boolean;
          focus_mode_enabled: boolean;
          notify_charity: boolean;
          notify_level_up: boolean;
          notify_protection: boolean;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          protection_enabled?: boolean;
          anti_adware?: boolean;
          anti_tracker?: boolean;
          anti_phishing?: boolean;
          false_positive_filter?: boolean;
          geo_block?: boolean;
          focus_mode_enabled?: boolean;
          notify_charity?: boolean;
          notify_level_up?: boolean;
          notify_protection?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["user_settings"]["Insert"]>;
      };
      charities: {
        Row: {
          id: string;
          slug: string;
          name_en: string;
          name_de: string;
          description_en: string | null;
          description_de: string | null;
          logo_url: string | null;
          is_verified: boolean;
          is_active: boolean;
          created_at: string;
        };
      };
    };
    Views: {
      leaderboard: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          country_code: string | null;
          voidpoints_total: number;
          voidpoints_donated: number;
          level: number;
          ads_blocked: number;
          global_rank: number;
        };
      };
    };
  };
}
