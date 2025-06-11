import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { signInSchema } from '@/lib/auth/auth-schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = signInSchema.parse(body)
    
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
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

    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (error) {
      console.error('Signin error:', error)
      
      // Handle specific Supabase errors
      if (error.message === 'Invalid login credentials') {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }
      
      if (error.message === 'Email not confirmed') {
        return NextResponse.json(
          { error: 'Please verify your email address before signing in' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    // Check if email is verified
    if (!data.user.email_confirmed_at) {
      return NextResponse.json(
        { error: 'Please verify your email address before signing in' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Signed in successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        emailConfirmed: Boolean(data.user.email_confirmed_at),
        role: data.user.role || 'authenticated',
        createdAt: data.user.created_at
      },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at
      }
    })

  } catch (error) {
    console.error('Signin API error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
