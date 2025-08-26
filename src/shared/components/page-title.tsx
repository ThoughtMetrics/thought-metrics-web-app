import { generateBreadcrumbsFromPath } from '@/routes/routeConfig';
import React from 'react';
import { useLocation } from 'react-router-dom';

interface BreadcrumbProps {
  className?: string;
  separator?: React.ReactNode;
  showHome?: boolean;
  useAutoGenerate?: boolean; // Option to use auto-generated breadcrumbs
}

export const PageTitle: React.FC<BreadcrumbProps> = ({ className = '' }) => {
  const location = useLocation();

  // Choose breadcrumb generation method
  const breadcrumbs = generateBreadcrumbsFromPath(location.pathname);

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
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbsFromPath(location.pathname);

  React.useEffect(() => {
    console.log('Current location:', location.pathname);
    console.log('Generated breadcrumbs:', breadcrumbs);
  }, [location.pathname, breadcrumbs]);

  return breadcrumbs;
};
