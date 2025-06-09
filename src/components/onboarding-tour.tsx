'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ChevronRight, ChevronLeft, Lightbulb, Trash2, Clock, Zap } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tips?: string[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Mocklyst!',
    description: 'Create instant, temporary mock API endpoints in seconds. No login required, auto-expires in 7 days.',
    icon: <Zap className="h-6 w-6 text-blue-500" />,
    tips: [
      'Perfect for testing and development',
      'No registration or setup required',
      'Supports objects, arrays, and primitives'
    ]
  },
  {
    id: 'create',
    title: 'Creating Mock Endpoints',
    description: 'Choose your response type, define your schema, and generate your endpoint in under 30 seconds.',
    icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
    tips: [
      'Use the schema designer to define your data structure',
      'Preview your JSON response before generating',
      'Copy the endpoint URL and use it immediately'
    ]
  },
  {
    id: 'manage',
    title: 'Managing Your Endpoints',
    description: 'All endpoints automatically expire after 7 days, but you can also delete them manually when needed.',
    icon: <Trash2 className="h-6 w-6 text-red-500" />,
    tips: [
      'Visit /mock/{id}/delete to manually delete an endpoint',
      'Deleted endpoints return 404 errors immediately',
      'Use deletion for sensitive test data cleanup'
    ]
  },
  {
    id: 'expiry',
    title: 'Auto-Expiry System',
    description: 'Endpoints automatically clean up after 7 days to keep the service fast and your test data private.',
    icon: <Clock className="h-6 w-6 text-green-500" />,
    tips: [
      'All endpoints expire exactly 7 days after creation',
      'Expired endpoints are automatically deleted',
      'No manual cleanup required for most use cases'
    ]
  }
];

interface OnboardingTourProps {
  onCompleteAction: () => void;
  onSkipAction: () => void;
}

export function OnboardingTour({ onCompleteAction, onSkipAction }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onCompleteAction();
  };

  const handleSkip = () => {
    setIsVisible(false);
    onSkipAction();
  };

  if (!isVisible) return null;

  const step = onboardingSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === onboardingSteps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-2 border-blue-200 shadow-2xl">
        <CardHeader className="relative">
          <Button
            onClick={handleSkip}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-3">
            {step.icon}
            <div className="flex-1">
              <CardTitle className="text-xl">{step.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  Step {currentStep + 1} of {onboardingSteps.length}
                </Badge>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-blue-500 h-1 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <CardDescription className="text-base leading-relaxed pt-2">
            {step.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {step.tips && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm mb-2">💡 Pro Tips:</h4>
              <ul className="space-y-1">
                {step.tips.map((tip, index) => (
                  <li key={index} className="text-blue-800 dark:text-blue-200 text-sm flex items-start gap-2">
                    <span className="text-blue-400 text-xs mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-between gap-3 pt-2">
            <div className="flex gap-2">
              {!isFirstStep && (
                <Button 
                  onClick={handlePrevious}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSkip}
                variant="ghost"
                size="sm"
              >
                Skip Tour
              </Button>
              <Button 
                onClick={handleNext}
                size="sm"
              >
                {isLastStep ? 'Get Started' : 'Next'}
                {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook to manage onboarding state
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenBefore = localStorage.getItem('mocklyst-onboarding-completed');
    if (!hasSeenBefore) {
      setShowOnboarding(true);
    } else {
      setHasSeenOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('mocklyst-onboarding-completed', 'true');
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
  };

  const skipOnboarding = () => {
    localStorage.setItem('mocklyst-onboarding-completed', 'true');
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('mocklyst-onboarding-completed');
    setShowOnboarding(true);
    setHasSeenOnboarding(false);
  };

  return {
    showOnboarding,
    hasSeenOnboarding,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding
  };
}
