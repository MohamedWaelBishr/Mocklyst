import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  emailConfirmed: boolean
  role: string
  createdAt: string
}

export interface AuthState {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  initialized: boolean
}

// Convert Supabase user to our AuthUser type
export function mapSupabaseUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email || '',
    emailConfirmed: user.email_confirmed_at !== null,
    role: user.role || 'authenticated',
    createdAt: user.created_at
  }
}

// Auth error messages
export const authErrorMessages: Record<string, string> = {
  'Invalid login credentials': 'Invalid email or password. Please try again.',
  'Email not confirmed': 'Please check your email and click the confirmation link before signing in.',
  'User already registered': 'An account with this email already exists. Please sign in instead.',
  'Password should be at least 6 characters': 'Password must be at least 8 characters long.',
  'Signup requires a valid password': 'Please enter a valid password.',
  'Invalid email': 'Please enter a valid email address.',
  'weak password': 'Password is too weak. Please choose a stronger password.',
  'Email rate limit exceeded': 'Too many emails sent. Please wait before requesting another.',
  default: 'An unexpected error occurred. Please try again.'
}

// Get user-friendly error message
export function getAuthErrorMessage(error: string): string {
  return authErrorMessages[error] || authErrorMessages.default
}

// Check if user email is verified
export function isEmailVerified(user: User | null): boolean {
  return user?.email_confirmed_at !== null
}

// Auth utility functions
export const authUtils = {
  mapSupabaseUser,
  // Sign up with email and password
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify`
      }
    })

    if (error) {
      throw new Error(getAuthErrorMessage(error.message))
    }

    return data
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw new Error(getAuthErrorMessage(error.message))
    }

    // Check if email is verified
    if (data.user && !isEmailVerified(data.user)) {
      throw new Error('Please verify your email address before signing in.')
    }

    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(getAuthErrorMessage(error.message))
    }
  },

  // Request password reset
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (error) {
      throw new Error(getAuthErrorMessage(error.message))
    }
  },

  // Update password
  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password
    })

    if (error) {
      throw new Error(getAuthErrorMessage(error.message))
    }
  },
  // Resend email verification
  async resendVerification() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('No user found. Please sign up first.')
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email!,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify`
      }
    })

    if (error) {
      throw new Error(getAuthErrorMessage(error.message))
    }
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      throw new Error(getAuthErrorMessage(error.message))
    }
    return session
  },

  // Get current user
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      throw new Error(getAuthErrorMessage(error.message))
    }
    return user
  },

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const session = await this.getSession()
      const user = await this.getUser()
      return session !== null && user !== null && isEmailVerified(user)
    } catch {
      return false
    }
  }
}
