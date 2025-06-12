export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private memoryWarningThreshold = 50 * 1024 * 1024; // 50MB
  private renderThreshold = 16; // 60fps threshold
  
  static getInstance() {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  startMonitoring() {
    if (typeof window === 'undefined') return;
    
    // Monitor memory usage if available
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize > this.memoryWarningThreshold) {
          console.warn('High memory usage detected:', {
            used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
            limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`,
            total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`
          });
          
          // Trigger garbage collection if possible
          if ('gc' in window) {
            (window as any).gc();
          }
        }
      }, 10000); // Check every 10 seconds
    }
    
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) { // Tasks longer than 50ms
              console.warn('Long task detected:', {
                name: entry.name,
                duration: `${Math.round(entry.duration)}ms`,
                startTime: entry.startTime
              });
            }
          });
        });
        
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // PerformanceObserver not supported
      }
    }
  }
  
  measureComponentRender(componentName: string, renderFn: () => void) {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    
    const duration = end - start;
    if (duration > this.renderThreshold) {
      console.warn(`Slow render detected in ${componentName}: ${Math.round(duration)}ms`);
    }
    
    return duration;
  }
  
  measureAsyncOperation<T>(operationName: string, operation: () => Promise<T>): Promise<T> {
    const start = performance.now();
    
    return operation().then(
      (result) => {
        const duration = performance.now() - start;
        console.log(`${operationName} completed in ${Math.round(duration)}ms`);
        return result;
      },
      (error) => {
        const duration = performance.now() - start;
        console.warn(`${operationName} failed after ${Math.round(duration)}ms:`, error);
        throw error;
      }
    );
  }  trackWebVitals() {
    if (typeof window === 'undefined') return;
    
    // Track Core Web Vitals using web-vitals v5+ API
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS((metric: any) => {
        console.log('CLS:', metric);
        if (metric.value > 0.1) {
          console.warn('Poor CLS detected:', metric.value);
        }
      });
      
      onINP((metric: any) => {
        console.log('INP:', metric);
        if (metric.value > 200) {
          console.warn('Poor INP detected:', metric.value);
        }
      });
      
      onFCP((metric: any) => {
        console.log('FCP:', metric);
        if (metric.value > 1800) {
          console.warn('Poor FCP detected:', metric.value);
        }
      });
      
      onLCP((metric: any) => {
        console.log('LCP:', metric);
        if (metric.value > 2500) {
          console.warn('Poor LCP detected:', metric.value);
        }
      });
      
      onTTFB((metric: any) => {
        console.log('TTFB:', metric);
        if (metric.value > 800) {
          console.warn('Poor TTFB detected:', metric.value);
        }
      });
    }).catch(() => {
      // web-vitals not available
      console.warn('Web Vitals library not available');
    });
  }
}

// Performance measurement decorators/helpers
export function measurePerformance(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    const start = performance.now();
    const result = method.apply(this, args);
    const end = performance.now();
    
    console.log(`${target.constructor.name}.${propertyName} took ${Math.round(end - start)}ms`);
    
    return result;
  };
  
  return descriptor;
}

// React hook for performance monitoring
export function usePerformanceMonitor(componentName: string) {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    measureRender: (fn: () => void) => monitor.measureComponentRender(componentName, fn),
    measureAsync: <T>(operationName: string, operation: () => Promise<T>) => 
      monitor.measureAsyncOperation(`${componentName}.${operationName}`, operation)
  };
}
