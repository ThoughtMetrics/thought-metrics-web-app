import { useEffect, useState } from 'react';
import { devToolsDetector } from '@/core/utils/devtools-detector';

/**
 * React hook to detect when browser DevTools are opened
 * Only runs in production mode
 *
 * @returns boolean indicating if DevTools are open
 */
export const useDevToolsDetector = (): boolean => {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  useEffect(() => {
    // Only run in production
    if (import.meta.env.DEV) {
      return;
    }

    const handleDevToolsChange = (isOpen: boolean) => {
      setIsDevToolsOpen(isOpen);
    };

    // Start detection
    devToolsDetector.start(handleDevToolsChange);

    return () => {
      // Cleanup
      devToolsDetector.removeCallback(handleDevToolsChange);
      devToolsDetector.stop();
    };
  }, []);

  return isDevToolsOpen;
};
