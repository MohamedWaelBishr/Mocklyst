import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

// Client for browser/client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

// Database types
export interface Database {
  public: {
    Tables: {
      mock_endpoints: {
        Row: {
          id: string;
          config: any; // JSON type for the mock schema
          endpoint: string;
          created_at: string;
          expires_at: string;
          user_id: string | null;
        };
        Insert: {
          id: string;
          config: any;
          endpoint: string;
          created_at?: string;
          expires_at: string;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          config?: any;
          endpoint?: string;
          created_at?: string;
          expires_at?: string;
          user_id?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Typed client for better TypeScript support
export const supabaseTyped = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);
export const supabaseAdminTyped = supabaseServiceRoleKey
  ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey)
  : null;
