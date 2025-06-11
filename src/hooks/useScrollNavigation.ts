'use client';

import { useState, useEffect, useCallback } from 'react';

interface Section {
  id: string;
  name: string;
  offset?: number;
}

export function useScrollNavigation(sections: Section[]) {
  const [activeSection, setActiveSection] = useState<string>('');

  // Smooth scroll to section with offset for fixed header
  const scrollToSection = useCallback((sectionId: string, offset: number = 80) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    // Set initial active section
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return {
    activeSection,
    scrollToSection
  };
}

export const landingPageSections: Section[] = [
  { id: 'hero', name: 'Home' },
  { id: 'features', name: 'Features' },
  { id: 'how-it-works', name: 'How It Works' },
  { id: 'demo', name: 'Demo' },
  { id: 'faq', name: 'FAQ' },
  { id: 'get-started', name: 'Get Started' }
];
