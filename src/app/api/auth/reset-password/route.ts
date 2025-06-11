import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { passwordResetRequestSchema, passwordResetSchema } from '@/lib/auth/auth-schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const url = new URL(request.url)
    const action = url.searchParams.get('action') || 'request'
    
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

    if (action === 'request') {
      // Password reset request
      const validatedData = passwordResetRequestSchema.parse(body)
      
      const { error } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
        redirectTo: `${request.nextUrl.origin}/auth/reset-password`,
      })

      if (error) {
        console.error('Password reset request error:', error)
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Password reset email sent successfully'
      })

    } else if (action === 'update') {
      // Password update
      const validatedData = passwordResetSchema.parse(body)
      
      const { error } = await supabase.auth.updateUser({
        password: validatedData.password
      })

      if (error) {
        console.error('Password update error:', error)
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully'
      })

    } else {
      return NextResponse.json(
        { error: 'Invalid action parameter' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Password reset API error:', error)
    
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
