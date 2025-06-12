import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { signUpSchema } from '@/lib/auth/auth-schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = signUpSchema.parse(body)
    
    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }
    
    // Create user with Supabase Admin client
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: false, // Require email confirmation
    })

    if (error) {
      console.error('Signup error:', error)
      
      // Handle specific Supabase errors
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
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
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Send confirmation email
    const { error: confirmError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email: validatedData.email,
      password: validatedData.password,
      options: {
        redirectTo: `${request.nextUrl.origin}/auth/verify`
      }
    })

    if (confirmError) {
      console.error('Email confirmation error:', confirmError)
      // Don't fail the signup if email fails, just log it
    }

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      message: 'Account created successfully. Please check your email to verify your account.',
      user: {
        id: data.user.id,
        email: data.user.email,
        emailConfirmed: false
      }
    })

  } catch (error) {
    console.error('Signup API error:', error)
    
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
