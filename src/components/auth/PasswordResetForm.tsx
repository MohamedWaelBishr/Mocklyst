"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowRight, KeyRound, Eye, EyeOff, Lock } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AnimatedButton } from "@/components/ui/animated-button"
import { useAuthStore } from "@/lib/stores/auth-store"
import { 
  passwordResetRequestSchema, 
  passwordResetSchema,
  type PasswordResetRequestData,
  type PasswordResetData 
} from "@/lib/auth/auth-schemas"

export function PasswordResetForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetPassword, updatePassword, loading } = useAuthStore()

  // Check if this is a password reset (has token) or password reset request
  const isPasswordReset = searchParams.has("token")

  const requestForm = useForm<PasswordResetRequestData>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: ""
    }
  })

  const resetForm = useForm<PasswordResetData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  const onRequestSubmit = async (values: PasswordResetRequestData) => {
    try {
      await resetPassword(values.email)
      setEmailSent(true)
      toast.success("Password reset email sent! Check your inbox.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send reset email")
    }
  }

  const onResetSubmit = async (values: PasswordResetData) => {
    try {
      await updatePassword(values.password)
      toast.success("Password updated successfully!")
      router.push("/auth/signin?message=Password updated. Please sign in with your new password.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update password")
    }
  }

  if (emailSent) {
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
                className="mx-auto w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4"
              >
                <Mail className="w-6 h-6 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
              <CardDescription>
                We've sent a password reset link to your email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Click the link in the email to reset your password. The link will expire in 24 hours.
              </p>
              <Link 
                href="/auth/signin" 
                className="text-sm text-primary hover:underline"
              >
                Back to Sign In
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

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
              <KeyRound className="w-6 h-6 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">
              {isPasswordReset ? "Set new password" : "Reset your password"}
            </CardTitle>
            <CardDescription>
              {isPasswordReset 
                ? "Enter your new password below"
                : "Enter your email address and we'll send you a reset link"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPasswordReset ? (
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                  <FormField
                    control={resetForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Enter your new password"
                              className="pl-10 pr-10"
                              type={showPassword ? "text" : "password"}
                              autoComplete="new-password"
                              disabled={loading}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={loading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={resetForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Confirm your new password"
                              className="pl-10 pr-10"
                              type={showConfirmPassword ? "text" : "password"}
                              autoComplete="new-password"
                              disabled={loading}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              disabled={loading}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <AnimatedButton
                    type="submit"
                    className="w-full"
                    disabled={loading}
                    isLoading={loading}
                  >
                    {loading ? "Updating password..." : (
                      <>
                        Update Password
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </AnimatedButton>
                </form>
              </Form>
            ) : (
              <Form {...requestForm}>
                <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
                  <FormField
                    control={requestForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Enter your email"
                              className="pl-10"
                              type="email"
                              autoComplete="email"
                              disabled={loading}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <AnimatedButton
                    type="submit"
                    className="w-full"
                    disabled={loading}
                    isLoading={loading}
                  >
                    {loading ? "Sending reset email..." : (
                      <>
                        Send Reset Email
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </AnimatedButton>
                </form>
              </Form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link 
                  href="/auth/signin" 
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
