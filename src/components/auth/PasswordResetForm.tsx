"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowRight,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AnimatedButton } from "@/components/ui/animated-button";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { Spotlight } from "@/components/ui/spotlight";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  passwordResetRequestSchema,
  passwordResetSchema,
  type PasswordResetRequestData,
  type PasswordResetData,
} from "@/lib/auth/auth-schemas";

export function PasswordResetForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, updatePassword, loading } = useAuthStore();

  // Check if this is a password reset (has token) or password reset request
  const isPasswordReset = searchParams.has("token");

  const requestForm = useForm<PasswordResetRequestData>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm<PasswordResetData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onRequestSubmit = async (values: PasswordResetRequestData) => {
    try {
      await resetPassword(values.email);
      setEmailSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send reset email"
      );
    }
  };

  const onResetSubmit = async (values: PasswordResetData) => {
    try {
      await updatePassword(values.password);
      toast.success("Password updated successfully!");
      router.push(
        "/auth/signin?message=Password updated. Please sign in with your new password."
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update password"
      );
    }
  };
  if (emailSent) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-green-50/20 dark:from-slate-950 dark:via-emerald-950/50 dark:to-green-950/30">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,197,94,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,197,94,0.15),rgba(255,255,255,0))]" />

        {/* Floating Particles Background */}
        <FloatingParticles
          className="absolute inset-0"
          particleCount={20}
          colors={["#22c55e", "#10b981", "#059669", "#16a34a", "#15803d"]}
        />

        {/* Spotlight Effect */}
        <Spotlight
          className="absolute inset-0 -top-40 left-0 md:left-60 md:-top-20"
          fill="#22c55e"
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
          <Card className="relative backdrop-blur-2xl bg-white/80 dark:bg-slate-900/80 border border-white/40 dark:border-slate-700/40 shadow-2xl shadow-emerald-500/10 dark:shadow-emerald-400/5 rounded-2xl overflow-hidden">
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-teal-500/20 blur-xl" />

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
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Mail className="w-3 h-3 text-emerald-600" />
                  </motion.div>
                </motion.div>

                {/* Animated Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    Check your email
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    We've sent a password reset link to your email address.
                  </CardDescription>
                </motion.div>
              </CardHeader>

              <CardContent className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-center space-y-4"
                >
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
                      Click the link in the email to reset your password. The
                      link will expire in 24 hours.
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/auth/signin"
                      className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors duration-200"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                      Back to Sign In
                    </Link>
                  </motion.div>
                </motion.div>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-white">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(168,85,247,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(168,85,247,0.15),rgba(255,255,255,0))]" />

      {/* Floating Particles Background */}
      <FloatingParticles
        className="absolute inset-0"
        particleCount={25}
        colors={["#fb923c", "#f97316", "#ea580c", "#dc2626", "#b91c1c"]}
      />

      {/* Spotlight Effect */}
      <Spotlight
        className="absolute inset-0 -top-40 left-0 md:left-60 md:-top-20"
        fill="#fb923c"
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
        <Card className="relative backdrop-blur-2xl bg-white/80 dark:bg-slate-900/80 border border-white/40 dark:border-slate-700/40 shadow-2xl shadow-purple-500/10 dark:shadow-purple-400/5 rounded-2xl overflow-hidden">
          {/* Animated Border Gradient */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/50 dark:to-purple-950/30" />

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
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  {isPasswordReset ? (
                    <Shield className="w-8 h-8 text-white" />
                  ) : (
                    <KeyRound className="w-8 h-8 text-white" />
                  )}
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Lock className="w-3 h-3 text-purple-600" />
                </motion.div>
              </motion.div>

              {/* Animated Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {isPasswordReset ? "Set new password" : "Reset your password"}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {isPasswordReset
                    ? "Enter your new password below to complete the reset"
                    : "Enter your email address and we'll send you a secure reset link"}
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {isPasswordReset ? (
                  <Form {...resetForm}>
                    <form
                      onSubmit={resetForm.handleSubmit(onResetSubmit)}
                      className="space-y-5"
                    >
                      <FormField
                        control={resetForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              New Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
                                <Input
                                  placeholder="Enter your new password"
                                  className="pl-10 pr-10 h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/20"
                                  type={showPassword ? "text" : "password"}
                                  autoComplete="new-password"
                                  disabled={loading}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
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
                            <FormLabel className="text-sm font-medium">
                              Confirm New Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
                                <Input
                                  placeholder="Confirm your new password"
                                  className="pl-10 pr-10 h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/20"
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  autoComplete="new-password"
                                  disabled={loading}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
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
                        className="w-full h-12 bg-gradient-to-r from-purple-500 to-red-600 hover:from-purple-600 hover:to-red-700 border-0 shadow-lg shadow-purple-500/25"
                        disabled={loading}
                        isLoading={loading}
                      >
                        {loading ? (
                          "Updating password..."
                        ) : (
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
                    <form
                      onSubmit={requestForm.handleSubmit(onRequestSubmit)}
                      className="space-y-5"
                    >
                      <FormField
                        control={requestForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Mail className="absolute left-3 top-4 h-4 w-4 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
                                <Input
                                  placeholder="Enter your email address"
                                  className="pl-10 h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/20"
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
                        className="w-full h-12 bg-gradient-to-br from-blue-500 to-purple-600 border-0"
                        disabled={loading}
                        isLoading={loading}
                      >
                        {loading ? (
                          "Sending reset email..."
                        ) : (
                          <>
                            Send Reset Email
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </AnimatedButton>
                    </form>
                  </Form>
                )}
              </motion.div>

              {/* Back to Sign In Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200 dark:border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-slate-900 px-2 text-muted-foreground">
                      or
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Remember your password?{" "}
                  <Link
                    href="/auth/signin"
                    className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
