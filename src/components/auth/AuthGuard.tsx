"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, ArrowRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedLoader } from "@/components/ui/animated-loader"
import { useAuthStore, useIsAuthenticated, useIsEmailVerified } from "@/lib/stores/auth-store"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireEmailVerified?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

export function AuthGuard({ 
  children, 
  requireAuth = true,
  requireEmailVerified = true,
  redirectTo = "/auth/signin",
  fallback 
}: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const { initialize, loading, initialized } = useAuthStore()
  const isAuthenticated = useIsAuthenticated()
  const isEmailVerified = useIsEmailVerified()

  useEffect(() => {
    const checkAuth = async () => {
      if (!initialized) {
        await initialize()
      }
      setIsChecking(false)
    }

    checkAuth()
  }, [initialize, initialized])

  // Show loading state while checking authentication
  if (isChecking || loading || !initialized) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <AnimatedLoader />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </motion.div>
      </div>
    )
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4"
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold">Authentication Required</CardTitle>
              <CardDescription>
                You need to sign in to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <AnimatedButton
                onClick={() => router.push(redirectTo)}
                className="w-full"
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </AnimatedButton>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Check if email verification is required
  if (requireEmailVerified && isAuthenticated && !isEmailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold">Email Verification Required</CardTitle>
              <CardDescription>
                Please verify your email address to continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Check your inbox for a verification email and click the link to verify your account.
              </p>
              <AnimatedButton
                onClick={() => router.push("/auth/verify")}
                className="w-full"
              >
                Go to Verification
                <ArrowRight className="ml-2 h-4 w-4" />
              </AnimatedButton>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // User is authenticated and email is verified (if required)
  return <>{children}</>
}

// Higher-order component for easy page wrapping
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<AuthGuardProps, 'children'>
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}

// Hook for checking auth status in components
export function useRequireAuth() {
  const router = useRouter()
  const isAuthenticated = useIsAuthenticated()
  const isEmailVerified = useIsEmailVerified()

  const requireAuth = (redirectTo = "/auth/signin") => {
    if (!isAuthenticated) {
      router.push(redirectTo)
      return false
    }
    return true
  }

  const requireEmailVerification = () => {
    if (!isEmailVerified) {
      router.push("/auth/verify")
      return false
    }
    return true
  }

  return {
    requireAuth,
    requireEmailVerification,
    isAuthenticated,
    isEmailVerified
  }
}
