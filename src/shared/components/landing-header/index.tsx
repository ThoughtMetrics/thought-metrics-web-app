import React from 'react';
import { Logo } from '@/assets';

import { ROUTES } from '@/routes/routeConfig';

const LandingHeader: React.FC = () => {
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
