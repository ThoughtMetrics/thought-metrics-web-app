import { useEffect } from 'react';

/**
 * Custom hook to handle automatic scrolling to hash anchor on page load
 *
 * Usage:
 * ```tsx
 * useHashScroll();
 * ```
 *
 * When the page loads with a hash in the URL (e.g., #section-id),
 * this hook will automatically scroll to the element with that ID.
 *
 * Features:
 * - Smooth scrolling behavior
 * - Offset for fixed headers (80px)
 * - Retry mechanism for dynamic content
 * - Works on initial page load and hash changes
 */
export const useHashScroll = (options?: {
  offset?: number;
  behavior?: ScrollBehavior;
  retryDelay?: number;
  maxRetries?: number;
}) => {
  const {
    offset = 80, // Offset for fixed header
    behavior = 'smooth',
    retryDelay = 100,
    maxRetries = 10,
  } = options || {};

  useEffect(() => {
    const scrollToHash = (hash: string, retryCount = 0) => {
      if (!hash) return;

      // Remove the # symbol
      const elementId = hash.replace('#', '');
      const element = document.getElementById(elementId);

      if (element) {
        // Calculate position with offset
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        // Scroll to element
        window.scrollTo({
          top: offsetPosition,
          behavior,
        });

        console.log(`Scrolled to element: ${elementId}`);
      } else if (retryCount < maxRetries) {
        // Element not found, retry after delay (useful for dynamically rendered content)
        console.log(`Element ${elementId} not found, retrying... (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => scrollToHash(hash, retryCount + 1), retryDelay);
      } else {
        console.warn(`Element with id "${elementId}" not found after ${maxRetries} retries`);
      }
    };

    // Handle initial hash on page load
    const handleInitialHash = () => {
      const hash = window.location.hash;
      if (hash) {
        // Small delay to ensure DOM is fully rendered
        setTimeout(() => scrollToHash(hash), 100);
      }
    };

    // Handle hash changes (when clicking anchor links)
    const handleHashChange = () => {
      const hash = window.location.hash;
      scrollToHash(hash);
    };

    // Execute on mount
    handleInitialHash();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [offset, behavior, retryDelay, maxRetries]);
};
