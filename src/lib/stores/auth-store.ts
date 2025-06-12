import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import { authUtils, mapSupabaseUser, type AuthUser, type AuthState } from '@/lib/auth/auth-utils'
import type { Session } from '@supabase/supabase-js'

interface AuthStore extends AuthState {
  // Actions
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  resendVerification: () => Promise<void>
  initialize: () => Promise<void>
  setUser: (user: AuthUser | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      loading: false,
      initialized: false,

      // Actions
      signUp: async (email: string, password: string) => {
        set({ loading: true })
        try {
          await authUtils.signUp(email, password)
          // Note: user will be null until email is verified
          set({ loading: false })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      signIn: async (email: string, password: string) => {
        set({ loading: true })
        try {
          const { user, session } = await authUtils.signIn(email, password)
          set({
            user: user ? mapSupabaseUser(user) : null,
            session,
            loading: false
          })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      signOut: async () => {
        set({ loading: true })
        try {
          await authUtils.signOut()
          set({
            user: null,
            session: null,
            loading: false
          })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      resetPassword: async (email: string) => {
        set({ loading: true })
        try {
          await authUtils.resetPassword(email)
          set({ loading: false })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      updatePassword: async (password: string) => {
        set({ loading: true })
        try {
          await authUtils.updatePassword(password)
          set({ loading: false })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      resendVerification: async () => {
        set({ loading: true })
        try {
          await authUtils.resendVerification()
          set({ loading: false })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },      initialize: async () => {
        if (get().initialized) return

        set({ loading: true })
        try {
          // Check if we're in the browser environment
          if (typeof window === 'undefined') {
            set({ loading: false, initialized: true })
            return
          }

          const session = await authUtils.getSession()
          const user = await authUtils.getUser()

          set({
            user: user ? mapSupabaseUser(user) : null,
            session,
            loading: false,
            initialized: true
          })

          // Set up auth state change listener
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              set({
                user: mapSupabaseUser(session.user),
                session,
                loading: false
              })
            } else if (event === 'SIGNED_OUT') {
              set({
                user: null,
                session: null,
                loading: false
              })
            } else if (event === 'TOKEN_REFRESHED' && session) {
              set({
                session,
                loading: false
              })
            }
          })
        } catch (error) {
          console.error('Auth initialization error:', error)
          set({
            user: null,
            session: null,
            loading: false,
            initialized: true
          })
        }
      },

      setUser: (user: AuthUser | null) => set({ user }),
      setSession: (session: Session | null) => set({ session }),
      setLoading: (loading: boolean) => set({ loading }),
      clearAuth: () => set({ user: null, session: null, loading: false })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        initialized: state.initialized
      })
    }
  )
)

// Computed selectors
export const useAuthUser = () => useAuthStore((state) => state.user)
export const useAuthSession = () => useAuthStore((state) => state.session)
export const useAuthLoading = () => useAuthStore((state) => state.loading)
export const useIsAuthenticated = () => useAuthStore((state) => 
  Boolean(state.user && state.session && state.user.emailConfirmed)
)
export const useIsEmailVerified = () => useAuthStore((state) => 
  Boolean(state.user?.emailConfirmed)
)
