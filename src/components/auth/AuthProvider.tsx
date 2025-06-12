"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/lib/stores/auth-store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize } = useAuthStore()

  useEffect(() => {
    // Only initialize auth state when the app starts in the browser
    if (typeof window !== 'undefined') {
      initialize().catch((error) => {
        console.error('Failed to initialize auth:', error)
      })
    }
  }, [initialize])

  return <>{children}</>
}
