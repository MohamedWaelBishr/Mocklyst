'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap, Code2 } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { FlipWords } from '@/components/ui/flip-words';

interface HeroSectionProps {
  onStartCreating?: () => void;
}

export function HeroSection({ onStartCreating }: HeroSectionProps) {
  const words = ["APIs", "Endpoints", "Data", "Responses", "Schemas"];

  const handleStartCreating = () => {
    if (onStartCreating) {
      onStartCreating();
    }
  };

  const handleLearnMore = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/30">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Main Headline */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full  bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium "
            >
              <Zap className="h-4 w-4" />
              <span>No login required • Auto-expires in 7 days</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
              <TextGenerateEffect 
                words="Create Instant Mock" 
                className="text-slate-900 dark:text-white"
              />
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                <FlipWords words={words} /> in Seconds
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Generate temporary API endpoints instantly for development and testing. 
              No authentication required, perfect for rapid prototyping and frontend development.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <AnimatedButton
              onClick={handleStartCreating}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Create Mock API
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </AnimatedButton>

            <motion.button
              onClick={handleLearnMore}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-1 rounded-xl text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 backdrop-blur-sm"
            >
              See How It Works
            </motion.button>
          </motion.div>

          {/* Stats or Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="pt-8"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Trusted by developers worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-slate-400 dark:text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm">Instant generation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm">No rate limits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span className="text-sm">CORS enabled</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 opacity-20 dark:opacity-10"
      >
        <Code2 className="h-16 w-16 text-blue-500" />
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-1/4 right-1/4 opacity-20 dark:opacity-10"
      >
        <Zap className="h-12 w-12 text-purple-500" />
      </motion.div>
    </section>
  );
}
