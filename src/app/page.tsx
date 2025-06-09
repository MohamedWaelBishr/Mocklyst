'use client';

import { useState } from 'react';
import { SchemaDesigner } from '@/components/schema-designer';
import { EndpointResult } from '@/components/endpoint-result';
import { OnboardingTour, useOnboarding } from "@/components/onboarding-tour";
import { Button } from "@/components/ui/button";
import { MockSchema, CreateMockResponse } from '@/types';

export default function Home() {
  const [result, setResult] = useState<CreateMockResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await fetch('/api/create-mock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schema),
      });

      if (!response.ok) {
        throw new Error('Failed to create mock endpoint');
      }

      const data: CreateMockResponse = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error creating mock endpoint:', error);
      alert('Failed to create mock endpoint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour
          onCompleteAction={completeOnboarding}
          onSkipAction={skipOnboarding}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Mocklyst
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create instant, temporary mock API endpoints in seconds. No login
            required, auto-expires in 7 days.
          </p>

          {hasSeenOnboarding && (
            <div className="mt-4">
              <Button
                onClick={resetOnboarding}
                variant="outline"
                size="sm"
                className="text-sm"
              >
                🎯 Show Tutorial Again
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {result ? (
            <EndpointResult
              endpoint={result.endpoint}
              id={result.id}
              expiresAt={result.expiresAt}
              onResetAction={handleReset}
            />
          ) : (
            <SchemaDesigner onGenerate={handleGenerate} isLoading={isLoading} />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400 space-y-2">
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Developed by{" "}
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              Eng. Mohamed Wael Bishr
            </span>
          </p>
          <p>
            Built with Next.js, shadcn/ui, and TailwindCSS •
            <a
              href="/docs"
              className="ml-1 hover:text-gray-700 dark:hover:text-gray-200 underline"
            >
              Documentation
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
