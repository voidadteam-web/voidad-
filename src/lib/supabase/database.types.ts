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
          subscription_plan: string;
          trial_ends_at: string | null;
          locale: string | null;
          voidpoints_total: number;
          level: number;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          subscription_plan?: string;
          locale?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      signup_network_nonces: {
        Row: {
          id: string;
          fingerprint_hash: string;
          network_hash: string;
          expires_at: string;
          used_at: string | null;
        };
        Insert: {
          fingerprint_hash: string;
          network_hash: string;
          expires_at: string;
          used_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["signup_network_nonces"]["Insert"]>;
      };
    };
    Functions: {
      check_free_tier_device_available: {
        Args: { p_fingerprint_hash: string; p_network_hash: string };
        Returns: boolean;
      };
      verify_user_device: {
        Args: { p_fingerprint_hash: string; p_network_hash: string };
        Returns: Json;
      };
    };
  };
}
