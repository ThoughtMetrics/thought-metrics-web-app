import { useEffect, useState } from 'react';
import logoSvg from '@assets/icons/thought-metrics.svg';
import { cn } from '@utils/cn';

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
      {/* Loader Container */}
      <div className="flex flex-col items-center gap-8">
        {/* Circular Spinner */}
        <div className="relative w-20 h-20">
          {/* Background circle */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--primary-lighter)"
              strokeWidth="3"
            />
          </svg>

          {/* Animated gradient circle */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              animation: 'rotate 1.5s linear infinite',
            }}
          >
            <defs>
              <linearGradient
                id="spinnerGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="50%" stopColor="var(--secondary)" />
                <stop offset="100%" stopColor="var(--primary)" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#spinnerGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="220"
              strokeDashoffset="60"
            />
          </svg>

          {/* Logo in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={logoSvg.src}
              alt="Thought Metrics"
              className="h-10 w-auto opacity-70"
            />
          </div>
        </div>

        {/* Loading Text */}
        <p
          className="text-sm font-medium"
          style={{ color: 'var(--secondary)' }}
        >
          Loading...
        </p>
      </div>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
