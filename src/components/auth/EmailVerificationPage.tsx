"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Mail, ArrowRight, RefreshCw } from "lucide-react"
import { toast } from "sonner"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { useAuthStore } from "@/lib/stores/auth-store"
import { supabase } from "@/lib/supabase"

type VerificationState = "loading" | "success" | "error" | "expired"

export function EmailVerificationPage() {
  const [state, setState] = useState<VerificationState>("loading")
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()

  const { resendVerification } = useAuthStore()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token from URL hash (Supabase auth callback)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        if (type === 'signup' && accessToken && refreshToken) {
          // Set session with tokens
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (error) {
            console.error('Verification error:', error)
            setState("error")
            return
          }

          setState("success")
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push("/")
          }, 3000)
        } else {
          // Check if user is already verified
          const { data: { user } } = await supabase.auth.getUser()
          if (user?.email_confirmed_at) {
            setState("success")
            setTimeout(() => {
              router.push("/")
            }, 2000)
          } else {
            setState("error")
          }
        }
      } catch (error) {
        console.error('Email verification failed:', error)
        setState("error")
      }
    }

    verifyEmail()
  }, [router])

  const handleResendVerification = async () => {
    setIsResending(true)
    try {
      await resendVerification()
      toast.success("Verification email sent! Please check your inbox.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resend verification email")
    } finally {
      setIsResending(false)
    }
  }

  const renderContent = () => {
    switch (state) {
      case "loading":
        return (
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ 
                  delay: 0.2, 
                  type: "spring", 
                  stiffness: 200,
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" }
                }}
                className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
              >
                <RefreshCw className="w-6 h-6 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold">Verifying your email</CardTitle>
              <CardDescription>
                Please wait while we verify your email address...
              </CardDescription>
            </CardHeader>
          </Card>
        )

      case "success":
        return (
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle className="w-6 h-6 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
                Email verified!
              </CardTitle>
              <CardDescription>
                Your email has been successfully verified. Redirecting to dashboard...
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm text-muted-foreground mb-4">
                  You can now access all features of Mocky.
                </p>
                <AnimatedButton
                  onClick={() => router.push("/")}
                  className="w-full"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </AnimatedButton>
              </motion.div>
            </CardContent>
          </Card>
        )

      case "error":
      case "expired":
        return (
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mb-4"
              >
                <XCircle className="w-6 h-6 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
                Verification failed
              </CardTitle>
              <CardDescription>
                {state === "expired" 
                  ? "The verification link has expired."
                  : "We couldn't verify your email address."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                {state === "expired"
                  ? "Please request a new verification email."
                  : "The verification link may be invalid or expired. Please try requesting a new one."
                }
              </p>
              
              <AnimatedButton
                onClick={handleResendVerification}
                disabled={isResending}
                isLoading={isResending}
                className="w-full"
              >
                {isResending ? "Sending..." : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </AnimatedButton>

              <div className="text-center">
                <Link 
                  href="/auth/signin" 
                  className="text-sm text-primary hover:underline"
                >
                  Back to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {renderContent()}
      </motion.div>
    </div>
  )
}
