// shared/components/layout/scroll-to-top.tsx
import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const location = useLocation();
  useLayoutEffect(() => {
    if (location.hash) {
      const targetElement = document.getElementById(location.hash.substring(1));
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'instant', block: 'start' });
        }, 500);
      }
    }
  }, [location.hash]);

  useEffect(() => {
    const scrollToTop = () => {
      // Get the root element (your actual scroll container)
      const rootElement = document.getElementById('root');

      if (rootElement) {
        rootElement.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant',
        });
      }
    };

    // Execute with timing for view transitions
    setTimeout(scrollToTop, 50);

    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToTop);
    });
  }, [location.pathname]);

  return null;
};

export default ScrollToTop;
