'use client';

import { useState } from 'react';
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { SchemaDesigner } from "@/components/schema-designer";
import { EndpointResult } from "@/components/endpoint-result";
import { OnboardingTour, useOnboarding } from "@/components/onboarding-tour";

import { MockSchema, CreateMockResponse } from "@/types";
import { useIsAuthenticated, useAuthUser } from "@/lib/stores/auth-store";
import { supabase } from "@/lib/supabase";

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



export default function CreatePage() {
  const [result, setResult] = useState<CreateMockResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
    const isAuthenticated = useIsAuthenticated();
  const user = useAuthUser();
  const { showOnboarding, completeOnboarding } = useOnboarding();

  const handleSchemaSubmit = async (schema: MockSchema) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/create-mock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schema,
          userId: user?.id || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create mock endpoint");
      }

      const data: CreateMockResponse = await response.json();
      setResult(data);

      // Track the creation in Supabase for authenticated users
      if (isAuthenticated && user?.id) {
        try {          await supabase.from("mock_endpoints").insert({
            id: data.id,
            user_id: user.id,
            name: "Mock Endpoint", // Use a default name since MockSchema doesn't have a name property
            endpoint_url: data.endpoint,
            schema: schema,
            created_at: new Date().toISOString(),
            expires_at: data.expiresAt,
          });
        } catch (dbError) {
          console.warn("Failed to save to database:", dbError);
          // Don't throw error as the mock was created successfully
        }
      }
    } catch (err) {
      console.error("Error creating mock:", err);
      setError(err instanceof Error ? err.message : "Failed to create mock endpoint");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/30">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <Boxes />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Create Your
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mock API
                </span>
              </h1>
              <p className="max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-300">
                Design your JSON schema and get an instant API endpoint. No signup required.
              </p>
            </motion.div>

            {/* Main Content */}
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key="designer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}                >                  {error && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                      {error}
                    </div>
                  )}
                  <SchemaDesigner 
                    onGenerateAction={handleSchemaSubmit} 
                    isLoading={isLoading}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                >                  <EndpointResult 
                    endpoint={result.endpoint}
                    id={result.id}
                    expiresAt={result.expiresAt}
                    onResetAction={handleReset}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour onCompleteAction={completeOnboarding} onSkipAction={completeOnboarding} />
      )}
    </>
  );
}
