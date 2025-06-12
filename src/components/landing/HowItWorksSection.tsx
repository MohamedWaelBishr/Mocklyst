'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Code2, Database, Globe, CheckCircle } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { useScrollAnimation, fadeInUpVariants, slideInLeftVariants, slideInRightVariants } from '@/hooks/useScrollAnimation';

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  details: string[];
}

export function HowItWorksSection() {
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation();
  const { ref: stepsRef, isInView: stepsInView } = useScrollAnimation({ margin: "-100px" });
  const { ref: ctaRef, isInView: ctaInView } = useScrollAnimation({ margin: "-150px" });
  const steps: Step[] = [
    {
      number: "01",
      title: "Design Schema",
      description: "Define your JSON response structure using our intuitive visual editor",
      icon: Database,
      details: [
        "Visual schema builder",
        "Support for nested objects",
        "Array and primitive types",
        "Real-time preview"
      ]
    },
    {
      number: "02", 
      title: "Generate Endpoint",
      description: "Get your unique temporary API URL instantly - no signup required",
      icon: Globe,
      details: [
        "Instant URL generation",
        "Unique endpoint per schema",
        "7-day auto-expiration",
        "CORS pre-configured"
      ]
    },
    {
      number: "03",
      title: "Use in Development", 
      description: "Integrate with your application and start developing immediately",
      icon: Code2,
      details: [
        "Standard HTTP methods",
        "JSON responses",
        "Cross-origin requests",
        "No rate limiting"
      ]
    }  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">        {/* Section Header */}
        <motion.div
          ref={headerRef}
          variants={fadeInUpVariants}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium border border-purple-200 dark:border-purple-800 mb-6">
            <ArrowRight className="h-4 w-4" />
            <span>How It Works</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            From idea to API in
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              three simple steps
            </span>
          </h2>
          
          <p className="max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-300">
            No complex setup, no authentication, no waiting. Just design, generate, and start building.
          </p>
        </motion.div>        {/* Steps */}
        <motion.div
          ref={stepsRef}
          className="space-y-16"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={index % 2 === 0 ? slideInLeftVariants : slideInRightVariants}
              initial="hidden"
              animate={stepsInView ? "visible" : "hidden"}
              transition={{ delay: index * 0.2 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold text-slate-300 dark:text-slate-600">
                      {step.number}
                    </span>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-20" />
                      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                        <step.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  {step.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual/Mockup */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl" />
                  
                  {/* Mock Interface */}
                  <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
                    <div className="space-y-4">
                      {/* Step-specific content */}
                      {index === 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Schema Designer</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-blue-200 dark:bg-blue-800 rounded w-3/4" />
                            <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/2" />
                            <div className="h-3 bg-purple-200 dark:bg-purple-800 rounded w-2/3" />
                          </div>
                        </div>
                      )}
                      
                      {index === 1 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">Endpoint Generated</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg font-mono text-xs text-purple-600 dark:text-purple-400">
                            https://api.mocklyst.com/v1/abc123
                          </div>
                        </div>
                      )}
                      
                      {index === 2 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-blue-900/20 rounded-lg border border-purple-200 dark:border-blue-800">
                            <span className="text-sm font-medium text-purple-700 dark:text-blue-300">Ready to Use</span>
                            <Code2 className="h-4 w-4 text-purple-500" />
                          </div>
                          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs">
                            <div className="text-slate-500 dark:text-slate-400">200 OK</div>
                            <div className="text-slate-700 dark:text-slate-300 font-mono">{"{ \"status\": \"success\" }"}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Floating Arrow */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                      <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-slate-300 dark:text-slate-600"
                      >
                        <ArrowRight className="h-6 w-6 rotate-90" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>        {/* CTA */}
        <motion.div
          ref={ctaRef}
          variants={fadeInUpVariants}
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          className="text-center mt-20"
        >
          <AnimatedButton className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
            <span className="flex items-center gap-2">
              Start Building Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </AnimatedButton>
        </motion.div>
      </div>
    </section>
  );
}
