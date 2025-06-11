'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useScrollNavigation, landingPageSections } from '@/hooks/useScrollNavigation';
import { Button } from '@/components/ui/button';

export function FloatingNavigation() {
  const [isVisible, setIsVisible] = useState(false);
  const { activeSection, scrollToSection } = useScrollNavigation(landingPageSections);

  // Show/hide based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="fixed right-6 bottom-6 z-40 space-y-2"
        >
          {/* Section Navigation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
          >
            <div className="space-y-1">
              {landingPageSections.slice(1, -1).map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 block ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 scale-125'
                        : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                    }`}
                    title={section.name}
                    aria-label={`Navigate to ${section.name}`}
                  />
                );
              })}
            </div>
          </motion.div>

          {/* Back to Top */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Button
              onClick={scrollToTop}
              size="icon"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              aria-label="Back to top"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
