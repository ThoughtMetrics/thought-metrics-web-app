import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const sizeMap = {
  small: 'w-8 h-8',
  medium: 'w-12 h-12',
  large: 'w-16 h-16',
};

export const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  color = 'text-primary',
  className = '',
}) => {
  return (
    <div className={`${sizeMap[size]} ${className}`}>
      <svg
        className={`animate-spin ${color}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

interface LoaderOverlayProps {
  message?: string;
  isVisible: boolean;
}

export const LoaderOverlay: React.FC<LoaderOverlayProps> = ({
  message = 'Loading...',
  isVisible,
}) => {
  React.useEffect(() => {
    // if (isVisible) {
    //   // Prevent body scroll when loader is visible
    //   document.body.style.overflow = 'hidden';
    // } else {
    //   // Restore body scroll when loader is hidden
    //   document.body.style.overflow = 'unset';
    // }

    // // Cleanup on unmount
    // return () => {
    //   document.body.style.overflow = 'unset';
    // };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
        <Loader size="large" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
