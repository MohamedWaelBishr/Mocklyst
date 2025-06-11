import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

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

    // Verify the token
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'signup'
    })

    if (error) {
      console.error('Email verification error:', error)
      
      if (error.message.includes('expired')) {
        return NextResponse.json(
          { error: 'Verification link has expired', expired: true },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        emailConfirmed: Boolean(data.user.email_confirmed_at),
        role: data.user.role || 'authenticated',
        createdAt: data.user.created_at
      }
    })

  } catch (error) {
    console.error('Email verification API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle GET requests for email verification links
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const type = searchParams.get('type')
  
  if (type === 'signup' && token) {
    // Redirect to verification page with token
    const redirectUrl = new URL('/auth/verify', request.url)
    redirectUrl.searchParams.set('token', token)
    
    return NextResponse.redirect(redirectUrl)
  }
  
  // Redirect to sign in if no valid parameters
  return NextResponse.redirect(new URL('/auth/signin', request.url))
}
