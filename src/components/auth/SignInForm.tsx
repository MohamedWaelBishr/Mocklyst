"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  ArrowRight,
  Sparkles,
  Shield,
  User,
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
import { signInSchema, type SignInFormData } from "@/lib/auth/auth-schemas";

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, loading } = useAuthStore();

  // Show message from URL params (e.g., after registration)
  const message = searchParams.get("message");

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: SignInFormData) => {
    try {
      await signIn(values.email, values.password);
      toast.success("Welcome back!");
      router.push("/"); // Redirect to dashboard
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/50 dark:to-purple-950/30">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

      {/* Floating Particles Background */}
      <FloatingParticles
        className="absolute inset-0"
        particleCount={25}
        colors={["#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#10b981"]}
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
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/30 via-purple-500/20 to-pink-500/30 p-[1px] animate-pulse">
            <div className="h-full w-full rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl" />
          </div>

          <div className="relative">
            <CardHeader className="space-y-6 text-center pt-8 pb-6">
              {/* Enhanced Logo/Icon with Animation */}
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
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
                  <LogIn className="w-10 h-10 text-white relative z-10" />
                </div>
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-md"
                />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-blue-500 animate-pulse" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="space-y-3"
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 text-base max-w-sm mx-auto">
                  Sign in to access your Mocky dashboard and continue building
                  amazing APIs
                </CardDescription>
              </motion.div>

              {/* Enhanced Message Display */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="relative p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200/50 dark:border-blue-700/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                        <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                        {message}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardHeader>{" "}
            <CardContent className="px-6 pb-6">
              <Form {...form}>
                <motion.form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  {/* Email Field with Enhanced Styling */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 transition-colors duration-200 group-focus-within:text-blue-500" />
                                <Input
                                  placeholder="Enter your email address"
                                  className="pl-12 h-13 bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-xl"
                                  type="email"
                                  autoComplete="email"
                                  disabled={loading}
                                  {...field}
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 dark:text-red-400 text-sm" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Password Field with Enhanced Styling */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 transition-colors duration-200 group-focus-within:text-blue-500" />
                                <Input
                                  placeholder="Enter your password"
                                  className="pl-12 pr-12 h-13 bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-xl"
                                  type={showPassword ? "text" : "password"}
                                  autoComplete="current-password"
                                  disabled={loading}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                                  onClick={() => setShowPassword(!showPassword)}
                                  disabled={loading}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 dark:text-red-400 text-sm" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Forgot Password Link */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="flex justify-end"
                  >
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </motion.div>

                  {/* Enhanced Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                  >
                    <AnimatedButton
                      type="submit"
                      className="w-full h-13 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group"
                      disabled={loading}
                      isLoading={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Signing in...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          Sign In
                          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </div>
                      )}
                    </AnimatedButton>
                  </motion.div>
                </motion.form>
              </Form>

              {/* Enhanced Sign Up Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="mt-8 text-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400">
                      New to Mocky?
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg"
                  >
                    Create your account
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
