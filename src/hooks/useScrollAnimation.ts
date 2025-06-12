'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';

interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  margin?: string;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: options.triggerOnce ?? true,
    margin: (options.margin ?? "-100px") as any,
    amount: options.threshold ?? 0.1
  });

  return { ref, isInView };
}

export function useStaggeredAnimation(itemCount: number, options: UseScrollAnimationOptions = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: options.triggerOnce ?? true,
    margin: (options.margin ?? "-100px") as any,
    amount: options.threshold ?? 0.1
  });

  const getStaggerDelay = (index: number) => {
    return isInView ? index * 0.1 : 0;
  };

  return { ref, isInView, getStaggerDelay };
}

export const fadeInUpVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const slideInLeftVariants = {
  hidden: { 
    opacity: 0, 
    x: -60
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const slideInRightVariants = {
  hidden: { 
    opacity: 0, 
    x: 60
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};
