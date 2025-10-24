import { useEffect, useState, useRef } from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { LoaderOverlay } from '@/shared/ui/atoms/loader';

/**
 * Configuration for the API loading indicator behavior
 */
interface ApiLoadingConfig {
  /** Delay in ms before showing loader (prevents flash for quick requests) */
  showDelay: number;
  /** Minimum display time in ms (prevents flicker once visible) */
  minDisplayTime: number;
  /** Message to display in the loader overlay */
  message: string;
}

const DEFAULT_CONFIG: ApiLoadingConfig = {
  showDelay: 200, // Don't show loader for requests < 200ms
  minDisplayTime: 300, // Once shown, keep visible for at least 300ms
  message: 'Loading...',
};

/**
 * Checks if a query should trigger the global loading indicator
 * Excludes patterns commonly used for background data fetching
 */
const shouldShowLoaderForQuery = (queryKey: readonly unknown[]): boolean => {
  const keyString = JSON.stringify(queryKey).toLowerCase();

  // Exclude patterns that shouldn't show global loader
  const excludePatterns = [
    'infinite',
    'scroll',
    'pagination',
    'background',
    'polling',
  ];

  return !excludePatterns.some((pattern) => keyString.includes(pattern));
};

/**
 * ApiLoadingIndicator Component
 *
 * Global loading overlay that automatically shows during API operations.
 * Implements anti-flicker logic to provide smooth UX:
 * - Delays showing loader for quick requests (< 200ms)
 * - Maintains minimum visibility time once shown (300ms)
 * - Excludes background operations (infinite scroll, polling, etc.)
 *
 * @example
 * ```tsx
 * <QueryClientProvider client={queryClient}>
 *   <ApiLoadingIndicator />
 *   <App />
 * </QueryClientProvider>
 * ```
 */
export const ApiLoadingIndicator = () => {
  const [isVisible, setIsVisible] = useState(false);
  const showTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shownAtRef = useRef<number | null>(null);

  // Track active queries (excluding background patterns)
  const isFetching = useIsFetching({
    predicate: (query) => shouldShowLoaderForQuery(query.queryKey),
  });

  // Track active mutations (all mutations show loader)
  const isMutating = useIsMutating();

  // Determine if any API operation is in progress
  const hasActiveOperation = isFetching > 0 || isMutating > 0;

  useEffect(() => {
    // Clear any pending timers
    const clearTimers = () => {
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };

    if (hasActiveOperation) {
      // API operation started
      if (!isVisible && !showTimerRef.current) {
        // Schedule showing loader after delay (prevents flash for quick requests)
        showTimerRef.current = setTimeout(() => {
          setIsVisible(true);
          shownAtRef.current = Date.now();
          showTimerRef.current = null;
        }, DEFAULT_CONFIG.showDelay);
      }
    } else {
      // API operation completed
      clearTimers();

      if (isVisible && shownAtRef.current) {
        // Calculate how long loader has been visible
        const visibleDuration = Date.now() - shownAtRef.current;
        const remainingTime = Math.max(
          0,
          DEFAULT_CONFIG.minDisplayTime - visibleDuration
        );

        // Keep loader visible for minimum time to prevent flicker
        hideTimerRef.current = setTimeout(() => {
          setIsVisible(false);
          shownAtRef.current = null;
          hideTimerRef.current = null;
        }, remainingTime);
      }
    }

    return clearTimers;
  }, [hasActiveOperation, isVisible]);

  return (
    <LoaderOverlay isVisible={isVisible} message={DEFAULT_CONFIG.message} />
  );
};

export default ApiLoadingIndicator;
