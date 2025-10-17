// src/shared/ui/atoms/custom-button/index.tsx
import { cn } from '@/core/utils/cn';

import React from 'react';

interface CustomButtonProps {
  label: string;
  className?: string;
  path?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
}

const CustomButtonAtom: React.FC<CustomButtonProps> = ({
  label,
  className = '',
  path,
  disabled = false,
  onClick,
  type = 'button',
  loading = false,
}) => {
  const buttonClasses = cn(
    'bg-primary text-white font-bold rounded-md text-xl text-nowrap py-1 px-6 w-auto',
    'hover:bg-secondary hover:text-white transition-all duration-300 ease-in-out',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    className
  );

  const buttonContent = (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {label}
        </span>
      ) : (
        label
      )}
    </button>
  );

  // Only wrap in a if path is provided and it's not a submit/reset button
  if (path && type === 'button') {
    return (
      <div className="w-full">
        <a href={path}>
          {buttonContent}
        </a>
      </div>
    );
  }

  return <div className="w-full">{buttonContent}</div>;
};

export default CustomButtonAtom;
