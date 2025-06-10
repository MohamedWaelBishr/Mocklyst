import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for browser/client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

// Database types
export interface Database {
  public: {
    Tables: {
      mock_endpoints: {
        Row: {
          id: string
          config: any // JSON type for the mock schema
          endpoint: string
          created_at: string
          expires_at: string
        }
        Insert: {
          id: string
          config: any
          endpoint: string
          created_at?: string
          expires_at: string
        }
        Update: {
          id?: string
          config?: any
          endpoint?: string
          created_at?: string
          expires_at?: string
        }
      }
    }
  }
}

// Typed client for better TypeScript support
export const supabaseTyped = createClient<Database>(supabaseUrl, supabaseAnonKey)
export const supabaseAdminTyped = createClient<Database>(supabaseUrl, supabaseServiceRoleKey)
