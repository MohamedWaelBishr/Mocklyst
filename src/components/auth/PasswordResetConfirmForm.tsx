"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { AnimatedButton } from "@/components/ui/animated-button"
import { FloatingParticles } from "@/components/ui/floating-particles"
import { Spotlight } from "@/components/ui/spotlight"
import { useAuthStore } from "@/lib/stores/auth-store"
import {
  passwordResetSchema,
  type PasswordResetData,
} from "@/lib/auth/auth-schemas"

export function PasswordResetConfirmForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { updatePassword, loading } = useAuthStore()

  const form = useForm<PasswordResetData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: PasswordResetData) => {
    try {
      await updatePassword(values.password)
      toast.success("Password updated successfully!")
      router.push(
        "/auth/signin?message=Password updated. Please sign in with your new password."
      )
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update password"
      )
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/50 dark:to-indigo-950/30">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]" />

      {/* Floating Particles Background */}
      <FloatingParticles
        className="absolute inset-0"
        particleCount={20}
        colors={["#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a"]}
      />

      {/* Spotlight Effect */}
      <Spotlight
        className="absolute inset-0 -top-40 left-0 md:left-60 md:-top-20"
        fill="#3b82f6"
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md p-6 z-10"
      >
        {/* Enhanced Main Card */}
        <Card className="relative backdrop-blur-2xl bg-white/80 dark:bg-slate-900/80 border border-white/40 dark:border-slate-700/40 shadow-2xl shadow-blue-500/10 dark:shadow-blue-400/5 rounded-2xl overflow-hidden">
          {/* Animated Border Gradient */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 blur-xl" />

          {/* Inner Card Content */}
          <div className="relative">
            <CardHeader className="space-y-4 text-center pb-6">
              {/* Animated Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="mx-auto relative"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <KeyRound className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Shield className="w-3 h-3 text-blue-600" />
                </motion.div>
              </motion.div>

              {/* Animated Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Reset Your Password
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Enter your new password below to secure your account.
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Password Field */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            New Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your new password"
                                className="pr-12 h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-200"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="w-5 h-5 text-slate-400" />
                                ) : (
                                  <Eye className="w-5 h-5 text-slate-400" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Confirm Password Field */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Confirm New Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your new password"
                                className="pr-12 h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-200"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="w-5 h-5 text-slate-400" />
                                ) : (
                                  <Eye className="w-5 h-5 text-slate-400" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password Requirements */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">
                        Password requirements:
                      </p>
                      <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• Contains uppercase and lowercase letters</li>
                        <li>• Contains at least one number</li>
                        <li>• Contains at least one special character</li>
                      </ul>
                    </div>

                    {/* Submit Button */}
                    <AnimatedButton
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Updating Password...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Shield className="w-5 h-5 mr-2" />
                          Update Password
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      )}
                    </AnimatedButton>
                  </form>
                </Form>
              </motion.div>

              {/* Back to Sign In Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-center"
              >
                <Link
                  href="/auth/signin"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 inline-flex items-center"
                >
                  <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
                  Back to Sign In
                </Link>
              </motion.div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
