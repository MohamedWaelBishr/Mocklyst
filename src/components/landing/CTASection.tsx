'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap, Code2 } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryCTA?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  secondaryCTA?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  variant?: 'primary' | 'secondary';
}

export function CTASection({ 
  title = "Ready to start building?",
  subtitle = "Create your first mock API in seconds. No signup required, no credit card needed.",
  primaryCTA = {
    text: "Create Mock API",
    href: "/create"
  },
  secondaryCTA = {
    text: "View Documentation",
    href: "/docs"
  },
  variant = 'primary'
}: CTASectionProps) {

  const handlePrimaryCTA = () => {
    if (primaryCTA.onClick) {
      primaryCTA.onClick();
    } else {
      window.location.href = primaryCTA.href;
    }
  };

  const handleSecondaryCTA = () => {
    if (secondaryCTA.onClick) {
      secondaryCTA.onClick();
    } else {
      window.location.href = secondaryCTA.href;
    }
  };

  const bgClass = variant === 'primary' 
    ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-blue-700 dark:via-purple-700 dark:to-blue-900'
    : 'bg-white dark:bg-slate-900';

  const textClass = variant === 'primary'
    ? 'text-white'
    : 'text-slate-900 dark:text-white';

  return (
    <section className={`py-24 relative overflow-hidden ${bgClass}`}>
      {/* Background Effects */}
      {variant === 'primary' && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        </>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center"
          >
            <div className={`relative ${variant === 'primary' ? 'text-white' : ''}`}>
              <div className={`absolute inset-0 rounded-2xl blur ${
                variant === 'primary' 
                  ? 'bg-white/20' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 opacity-20'
              }`} />
              <div className={`relative p-4 rounded-2xl ${
                variant === 'primary' 
                  ? 'bg-white/10 backdrop-blur-sm' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600'
              }`}>
                <Zap className={`h-8 w-8 ${variant === 'primary' ? 'text-white' : 'text-white'}`} />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${textClass}`}
            >
              {title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className={`max-w-2xl mx-auto text-lg ${
                variant === 'primary' 
                  ? 'text-white/90' 
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {subtitle}
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <AnimatedButton
              onClick={handlePrimaryCTA}
              className={`group px-8 py-4 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 ${
                variant === 'primary'
                  ? 'bg-white text-purple-600 hover:bg-gray-50'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                {primaryCTA.text}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </AnimatedButton>

            <motion.button
              onClick={handleSecondaryCTA}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-1 rounded-xl text-lg font-medium transition-all duration-300 ${
                variant === 'primary'
                  ? 'text-white hover:text-white border border-white/30 hover:border-white/50 hover:bg-white/10 backdrop-blur-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 backdrop-blur-sm'
              }`}
            >
              {secondaryCTA.text}
            </motion.button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="pt-6"
          >
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
              <div className={`flex items-center gap-2 ${
                variant === 'primary' ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
              }`}>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>No credit card required</span>
              </div>
              <div className={`flex items-center gap-2 ${
                variant === 'primary' ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
              }`}>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>Free to use</span>
              </div>
              <div className={`flex items-center gap-2 ${
                variant === 'primary' ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
              }`}>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span>Instant setup</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      {variant === 'primary' && (
        <>
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-8 opacity-20"
          >
            <Code2 className="h-16 w-16 text-white" />
          </motion.div>

          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -10, 0]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
            className="absolute bottom-1/4 right-8 opacity-20"
          >
            <Zap className="h-12 w-12 text-white" />
          </motion.div>
        </>
      )}
    </section>
  );
}
