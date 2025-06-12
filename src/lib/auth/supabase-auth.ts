import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Server-side auth client for Next.js App Router
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Get server-side user session
export async function getServerSession() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Get server-side user
export async function getServerUser() {
  const supabase = await createServerSupabaseClient()
  
  // Debug: Log available cookies
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  console.log("🔧 getServerUser ~ Available cookies:", allCookies.map(c => ({ name: c.name, hasValue: !!c.value })))
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  // Debug: Log authentication result
  console.log("🔧 getServerUser ~ User result:", { userId: user?.id, error: error?.message })
  
  return user
}

// Check if user is authenticated on server
export async function isServerAuthenticated() {
  const session = await getServerSession()
  const user = await getServerUser()
  return session !== null && user !== null && user.email_confirmed_at !== null
}
