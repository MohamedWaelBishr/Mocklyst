'use client';

import { useState } from 'react';
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { SchemaDesigner } from "@/components/schema-designer";
import { EndpointResult } from "@/components/endpoint-result";
import { OnboardingTour, useOnboarding } from "@/components/onboarding-tour";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/UserNav";

import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { FlipWords } from "@/components/ui/flip-words";
import { AnimatedButton } from "@/components/ui/animated-button";
import { CardHoverEffect } from "@/components/ui/card-hover-effect";
import { Spotlight } from "@/components/ui/spotlight";
import { MockSchema, CreateMockResponse } from "@/types";
import { useIsAuthenticated, useAuthUser } from "@/lib/stores/auth-store";
import { supabase } from "@/lib/supabase";
import {
  Zap,
  Clock,
  Shield,
  Sparkles,
  ArrowRight,
  Code2,
  Database,
  Globe,
  User,
  Bookmark,
} from "lucide-react";

// Dynamically import components that use random values to prevent hydration issues
const Boxes = dynamic(
  () =>
    import("@/components/ui/background-effects").then((mod) => ({
      default: mod.Boxes,
    })),
  {
    ssr: false,
  }
);

const FloatingParticles = dynamic(
  () =>
    import("@/components/ui/floating-particles").then((mod) => ({
      default: mod.FloatingParticles,
    })),
  {
    ssr: false,
  }
);

export default function Home() {
  const [result, setResult] = useState<CreateMockResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthUser();
  const {
    showOnboarding,
    hasSeenOnboarding,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
  } = useOnboarding();
  const handleGenerate = async (schema: MockSchema) => {
    setIsLoading(true);
    try {
      // Debug: Log client-side authentication state
      console.log("🔍 Client ~ User authenticated:", isAuthenticated);
      console.log("🔍 Client ~ User object:", user);
      console.log("🔍 Client ~ User ID:", user?.id); // Get the current session token for authentication
      const authHeaders: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (user?.id) {
        // Get the current session to send the access token
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) {
          authHeaders["Authorization"] = `Bearer ${session.access_token}`;
          console.log(
            "🔍 Client ~ Sending auth token:",
            !!session.access_token
          );
        }
      }

      const response = await fetch("/api/create-mock", {
        method: "POST",
        headers: authHeaders,
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify(schema),
      });

      if (!response.ok) {
        throw new Error("Failed to create mock endpoint");
      }

      const data: CreateMockResponse = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error creating mock endpoint:", error);
      alert("Failed to create mock endpoint. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {" "}
      {/* Navigation - Fixed Position */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="fixed top-6 right-6 z-50 flex items-center space-x-4"
      >
        <UserNav />
        <ThemeToggle />
      </motion.div>{" "}
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Aceternity UI Spotlight Effect */}
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="rgba(59, 130, 246, 0.3)"
        />

        {/* Floating Particles */}
        <FloatingParticles
          particleCount={30}
          colors={["#3b82f6", "#8b5cf6", "#ec4899", "#10b981"]}
        />

        {/* Aceternity UI Boxes Background */}
        <Boxes />

        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 dark:from-blue-800/10 dark:to-indigo-900/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-tr from-purple-200/20 to-pink-300/20 dark:from-purple-800/10 dark:to-pink-900/10 rounded-full blur-3xl"
        />
      </div>
      {/* Onboarding Tour */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingTour
            onCompleteAction={completeOnboarding}
            onSkipAction={skipOnboarding}
          />
        )}
      </AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-4 py-8"
      >
        {/* Hero Section */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-16 space-y-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-slate-700/50 shadow-lg"
          >
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Instant Mock API Generator
            </span>
          </motion.div>{" "}
          {/* Main Title */}
          <div className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 leading-tight">
            <TextGenerateEffect
              words="Mocklyst"
              className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200"
              duration={0.8}
              filter={true}
            />
          </div>{" "}
          {/* Subtitle */}
          <div className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            <TextGenerateEffect
              words="Create instant, temporary mock API endpoints in seconds."
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300"
              duration={0.6}
              filter={false}
            />
            <motion.div
              variants={itemVariants}
              className="mt-2 text-lg text-gray-500 dark:text-gray-400"
            >
              <FlipWords
                words={
                  isAuthenticated
                    ? [
                        "Your endpoints, saved forever",
                        "Personal dashboard access",
                        "Enhanced analytics",
                        "Premium features",
                      ]
                    : [
                        "No login required",
                        "Auto-expires in 7 days",
                        "Zero configuration",
                        "Instant setup",
                      ]
                }
                duration={2500}
                className="text-lg text-blue-600 dark:text-blue-400 font-medium"
              />
              <span className="mx-2">•</span>
              <span>
                {isAuthenticated
                  ? `Welcome back, ${user?.email?.split("@")[0]}!`
                  : "Built for developers"}
              </span>
            </motion.div>
          </div>{" "}
          {/* Feature Pills */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
          >
            {(isAuthenticated
              ? [
                  { icon: Bookmark, text: "Saved Endpoints", color: "purple" },
                  { icon: Shield, text: "Enhanced Security", color: "green" },
                  { icon: Database, text: "Persistent Storage", color: "blue" },
                ]
              : [
                  { icon: Zap, text: "Instant Setup", color: "yellow" },
                  { icon: Shield, text: "Secure & Private", color: "green" },
                  { icon: Clock, text: "Auto-Cleanup", color: "blue" },
                ]
            ).map((feature) => (
              <motion.div
                key={feature.text}
                variants={featureVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-${feature.color}-200/50 dark:border-slate-700/50 shadow-md hover:shadow-lg transition-all duration-300`}
              >
                <feature.icon
                  className={`h-4 w-4 text-${feature.color}-600 dark:text-${feature.color}-400`}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>{" "}
          {/* Tutorial Button */}
          {hasSeenOnboarding && (
            <motion.div variants={itemVariants} className="mt-6">
              <AnimatedButton
                onClick={resetOnboarding}
                variant="outline"
                size="sm"
                // movingBorder={true}
                // borderClassName="bg-gradient-to-r from-blue-500 to-purple-500"
                className="group  dark:bg-slate-800/80 backdrop-blur-sm transition-all duration-300"
              >
                <span className="mr-2">🎯</span>
                Show Tutorial Again
                <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </AnimatedButton>
            </motion.div>
          )}{" "}
        </motion.div>
        {/* Authentication-specific section */}
        {!isAuthenticated && !result && (
          <motion.div
            variants={itemVariants}
            className="mb-16 max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800/50 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200/30 dark:border-slate-700/50 backdrop-blur-sm">
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-700/50"
                >
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Want to save your endpoints forever?
                  </span>
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Sign up for enhanced features
                </h3>

                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Create an account to save your endpoints permanently, access
                  them from anywhere, and get detailed analytics on your API
                  usage.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AnimatedButton
                      variant="default"
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => (window.location.href = "/auth/signup")}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign Up Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </AnimatedButton>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AnimatedButton
                      variant="outline"
                      size="lg"
                      className="border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => (window.location.href = "/auth/signin")}
                    >
                      Already have an account? Sign In
                    </AnimatedButton>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-sm">
                  {[
                    {
                      icon: Bookmark,
                      title: "Permanent Storage",
                      desc: "Your endpoints never expire",
                    },
                    {
                      icon: Database,
                      title: "Personal Dashboard",
                      desc: "Manage all your APIs in one place",
                    },
                    {
                      icon: Shield,
                      title: "Enhanced Security",
                      desc: "Private endpoints with access control",
                    },
                  ].map((benefit) => (
                    <motion.div
                      key={benefit.title}
                      whileHover={{ y: -2 }}
                      className="flex flex-col items-center text-center p-4 rounded-lg bg-white/50 dark:bg-slate-800/30 border border-white/30 dark:border-slate-700/30"
                    >
                      <benefit.icon className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {benefit.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {/* Welcome back section for authenticated users */}
        {isAuthenticated && !result && (
          <motion.div
            variants={itemVariants}
            className="mb-16 max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-8 border border-green-200/30 dark:border-green-700/50 backdrop-blur-sm">
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200/50 dark:border-green-700/50"
                >
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Premium Features Active
                  </span>
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user?.email?.split("@")[0]}! 👋
                </h3>

                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Your endpoints are automatically saved and will never expire.
                  Access your dashboard to manage all your APIs in one place.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AnimatedButton
                      variant="default"
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => (window.location.href = "/dashboard")}
                    >
                      <Database className="w-4 h-4 mr-2" />
                      View Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </AnimatedButton>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {/* Main Content Area */}
        <motion.div variants={itemVariants} className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl p-8"
              >
                <EndpointResult
                  endpoint={result.endpoint}
                  id={result.id}
                  expiresAt={result.expiresAt}
                  onResetAction={handleReset}
                />
              </motion.div>
            ) : (
              <motion.div
                key="designer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl p-8"
              >
                <SchemaDesigner
                  onGenerateAction={handleGenerate}
                  isLoading={isLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>{" "}
        {/* Features Grid */}
        {!result && (
          <motion.div
            variants={itemVariants}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {(isAuthenticated
              ? [
                  {
                    icon: Database,
                    title: "Permanent Storage",
                    description:
                      "Your endpoints are saved forever and accessible from your personal dashboard",
                    color: "purple",
                  },
                  {
                    icon: Shield,
                    title: "Enhanced Security",
                    description:
                      "Private endpoints with user authentication and access control",
                    color: "green",
                  },
                  {
                    icon: Bookmark,
                    title: "Advanced Analytics",
                    description:
                      "Detailed usage statistics and performance metrics for your APIs",
                    color: "blue",
                  },
                ]
              : [
                  {
                    icon: Code2,
                    title: "Developer Friendly",
                    description:
                      "RESTful endpoints with proper JSON responses and CORS support",
                    color: "blue",
                  },
                  {
                    icon: Database,
                    title: "Rich Data Types",
                    description:
                      "Support for objects, arrays, primitives, and nested structures",
                    color: "purple",
                  },
                  {
                    icon: Globe,
                    title: "Instant Access",
                    description:
                      "Use your endpoints immediately from any application or service",
                    color: "green",
                  },
                ]
            ).map((feature) => (
              <CardHoverEffect key={feature.title} className="p-6">
                <div
                  className={`w-12 h-12 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon
                    className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardHoverEffect>
            ))}
          </motion.div>
        )}
        {/* Footer */}
        <motion.footer
          variants={itemVariants}
          className="mt-20 text-center space-y-3"
        >
          <motion.p
            className="font-medium text-gray-700 dark:text-gray-300"
            whileHover={{ scale: 1.02 }}
          >
            Developed by{" "}
            <span className="text-blue-600 dark:text-blue-400 font-semibold bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Eng. Mohamed Wael Bishr
            </span>
          </motion.p>
          <motion.p
            className="text-sm text-gray-500 dark:text-gray-400"
            whileHover={{ scale: 1.02 }}
          >
            Built with Next.js, shadcn/ui, and TailwindCSS •{" "}
            <motion.a
              href="/docs"
              className="hover:text-gray-700 dark:hover:text-gray-200 underline underline-offset-4 decoration-blue-400 hover:decoration-blue-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              Documentation
            </motion.a>
            {" • "}
            <motion.a
              href="/terms"
              className="hover:text-gray-700 dark:hover:text-gray-200 underline underline-offset-4 decoration-blue-400 hover:decoration-blue-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              Terms
            </motion.a>
          </motion.p>
        </motion.footer>
      </motion.div>
    </div>
  );
}
