'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PerformanceMonitor } from '@/lib/utils/performance-monitor';

export function PerformanceWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Initialize performance monitoring
    const monitor = PerformanceMonitor.getInstance();
    monitor.startMonitoring();
    monitor.trackWebVitals();

    // Prefetch critical routes after initial load
    const prefetchRoutes = async () => {
      try {
        await Promise.all([
          router.prefetch('/dashboard'),
          router.prefetch('/create'),
          router.prefetch('/docs')
        ]);
        console.log('Critical routes prefetched successfully');
      } catch (error) {
        console.warn('Route prefetching failed:', error);
      }
    };

    // Prefetch after initial load
    const timer = setTimeout(prefetchRoutes, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  return <>{children}</>;
}
