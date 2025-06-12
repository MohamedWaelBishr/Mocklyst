'use client';

import { motion } from 'framer-motion';
import { Zap, Clock, Shield, Globe, Database, Sparkles, CheckCircle } from 'lucide-react';
import { CardHoverEffect } from '@/components/ui/card-hover-effect';
import { useScrollAnimation, fadeInUpVariants, staggerContainerVariants, staggerItemVariants } from '@/hooks/useScrollAnimation';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  highlight?: string;
}

export function FeaturesSection() {
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation();
  const { ref: gridRef, isInView: gridInView } = useScrollAnimation({ margin: "-50px" });
  const { ref: benefitsRef, isInView: benefitsInView } = useScrollAnimation({ margin: "-100px" });
  const features: Feature[] = [
    {
      icon: Zap,
      title: "Instant Generation",
      description: "Get API endpoints in under 30 seconds. No setup, no configuration, just instant results.",
      highlight: "< 30 seconds"
    },
    {
      icon: Shield,
      title: "No Authentication",
      description: "Start immediately without signup. Perfect for quick prototypes and proof of concepts.",
      highlight: "Zero friction"
    },
    {
      icon: Clock,
      title: "Auto Cleanup",
      description: "Endpoints self-destruct after 7 days. No manual cleanup or forgotten resources.",
      highlight: "7 days TTL"
    },
    {
      icon: Database,
      title: "Flexible Schemas",
      description: "Support for objects, arrays, primitives, and nested structures. Design any JSON response.",
      highlight: "Any JSON"
    },
    {
      icon: Globe,
      title: "CORS Enabled",
      description: "Use from any domain or application. Perfect for frontend development and testing.",
      highlight: "Universal access"
    },
    {
      icon: Sparkles,
      title: "Real Mock Data",
      description: "Configurable mock data generation with realistic values for rapid development.",
      highlight: "Realistic data"
    }  ];

  return (
    <section id="features" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        <motion.div
          ref={headerRef}
          variants={fadeInUpVariants}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-blue-900/30 text-purple-700 dark:text-blue-300 text-sm font-medium border border-blue-200 dark:border-blue-800 mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Features</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Everything you need for
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              rapid API prototyping
            </span>
          </h2>

          <p className="max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-300">
            Designed for developers who need fast, reliable mock APIs without
            the hassle of setup or maintenance.
          </p>
        </motion.div>{" "}
        <motion.div
          ref={gridRef}
          variants={staggerContainerVariants}
          initial="hidden"
          animate={gridInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={staggerItemVariants}
              className="group relative"
            >
              <CardHoverEffect className="h-full">
                <div className="p-8 h-full flex flex-col">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl inline-block">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {feature.title}
                      </h3>
                      {feature.highlight && (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-blue-900/30 text-purple-700 dark:text-blue-300 rounded-full">
                          {feature.highlight}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </CardHoverEffect>
            </motion.div>
          ))}
        </motion.div>
        {/* Additional Benefits */}{" "}
        <motion.div
          ref={benefitsRef}
          variants={fadeInUpVariants}
          initial="hidden"
          animate={benefitsInView ? "visible" : "hidden"}
          className="mt-20 text-center"
        >
          <div className="bg-purple-200/30 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl p-8 border border-blue-100 dark:border-blue-800/30">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Why developers choose Mocklyst
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                    Zero Configuration
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    No complex setup or environment configuration required
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                    Production Ready
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Reliable endpoints with proper HTTP headers and CORS
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                    Developer Friendly
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Intuitive interface designed for rapid iteration
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
