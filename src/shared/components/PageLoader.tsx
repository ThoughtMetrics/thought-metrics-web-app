import { useEffect, useState } from 'react';
import { cn } from '@utils/cn';
import { LoaderUI } from '@ui/atoms/loader/LoaderUI';

const PageLoader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleBeforePreparation = () => {
      setIsLoading(true);
    };

    const handleAfterSwap = () => {
      setIsLoading(false);
    };

    // Listen to Astro view transition events
    document.addEventListener(
      'astro:before-preparation',
      handleBeforePreparation
    );
    document.addEventListener('astro:after-swap', handleAfterSwap);

    // Cleanup listeners on unmount
    return () => {
      document.removeEventListener(
        'astro:before-preparation',
        handleBeforePreparation
      );
      document.removeEventListener('astro:after-swap', handleAfterSwap);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-9999 flex items-center justify-center bg-white',
        'bg-white/90'
      )}
      style={{
        animation: 'fadeIn 0.2s ease-in',
      }}
    >
      <LoaderUI message="Loading..." />
    </div>
  );
};

export default PageLoader;
