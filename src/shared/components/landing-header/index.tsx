import React, { useEffect, useState } from 'react';
import { Logo } from '@/assets';

import { ROUTES } from '@/routes/routeConfig';
import CustomButtonAtom from '@/shared/ui/atoms/custom-button';
import { auth } from '@/core/configs/firebase-config';

const LandingHeader: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Only set up auth listener on client-side
    if (typeof window === 'undefined') {
      return;
    }

    // Check if auth is available (will be null/undefined during SSR or if Firebase failed to init)
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      console.warn('Firebase auth not available in LandingHeader');
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="relative">
      <header className="common-component bg-white">
        <div className="common-container justify-center max-w-(--breakpoint-2xl)!">
          <nav className="px-6 py-5 xxl:px-0 flex items-center justify-between w-full">
            <a href={ROUTES.HOME}>
              <div className="w-42 md:w-54 pt-1">
                <Logo className="w-full h-full" />
              </div>
            </a>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default LandingHeader;
