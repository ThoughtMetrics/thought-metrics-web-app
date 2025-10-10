import React, { useEffect } from 'react';
import { useDevToolsDetector } from '@/core/hooks/use-devtools-detector';
import styles from './styles.module.scss';

/**
 * DevToolsGuard Component
 * Blocks page content when browser DevTools are detected open
 * Only active in production mode
 */
export const DevToolsGuard: React.FC = () => {
  const isDevToolsOpen = useDevToolsDetector();

  useEffect(() => {
    if (isDevToolsOpen) {
      // Prevent scrolling when DevTools are open
      document.body.style.overflow = 'hidden';

      // Disable right-click
      const disableRightClick = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };

      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      const disableKeyboardShortcuts = (e: KeyboardEvent) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
          return false;
        }
      };

      document.addEventListener('contextmenu', disableRightClick);
      document.addEventListener('keydown', disableKeyboardShortcuts);

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('contextmenu', disableRightClick);
        document.removeEventListener('keydown', disableKeyboardShortcuts);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isDevToolsOpen]);

  if (!isDevToolsOpen || import.meta.env.DEV) {
    return null;
  }

  return (
    <div className={styles.devtoolsOverlay}>
      <div className={styles.content}>
        <div className={styles.icon}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className={styles.title}>DevTools Detected</h1>
        <p className={styles.message}>
          For security and privacy reasons, this application cannot be accessed with browser
          developer tools open.
        </p>
        <p className={styles.instruction}>
          Please close the developer tools to continue using the application.
        </p>
        <div className={styles.hint}>
          <small>Press F12 or close the DevTools panel</small>
        </div>
      </div>
    </div>
  );
};
