// shared/components/layout/scroll-to-top.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const location = useLocation();

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
