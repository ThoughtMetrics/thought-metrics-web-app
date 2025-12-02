import { generateBreadcrumbsFromPath } from '@/routes/routeConfig';
import React, { useState, useEffect } from 'react';

interface BreadcrumbProps {
  className?: string;
  separator?: React.ReactNode;
  showHome?: boolean;
  useAutoGenerate?: boolean; // Option to use auto-generated breadcrumbs
}

// Custom hook to get current pathname (Astro-compatible)
const usePathname = () => {
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    // Set initial pathname
    setPathname(window.location.pathname);

    // Optional: Listen for navigation changes (for client-side routing)
    const handleLocationChange = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  return pathname;
};

export const PageTitle: React.FC<BreadcrumbProps> = ({ className = '' }) => {
  const pathname = usePathname();

  // Choose breadcrumb generation method
  const breadcrumbs = generateBreadcrumbsFromPath(pathname);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <div
      className={`
        flex flex-col gap-2
        text-black font-semibold
        text-xl xl:text-2xl wide:text-4xl
        ${className}
      `}
    >
      <span>{breadcrumbs[breadcrumbs.length - 1].label}</span>
      <div className="w-25 md:w-45 max-w-full h-1 bg-primary rounded"></div>
    </div>
  );
};

// Hook for debugging breadcrumbs
export const useBreadcrumbs = () => {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbsFromPath(pathname);

  React.useEffect(() => {
    console.debug('Current location:', pathname);
    console.debug('Generated breadcrumbs:', breadcrumbs);
  }, [pathname, breadcrumbs]);

  return breadcrumbs;
};
