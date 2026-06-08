import React from 'react';
import { Logo } from '@/assets';
import { ROUTES } from '@/routes/routeConfig';

const LandingHeader: React.FC = () => {
  return (
    <div className="relative shrink-0">
      <header
        className="w-full"
        style={{
          background: 'var(--surface-container-low)',
          borderBottom: '1px solid var(--glass-border-color)',
        }}
      >
        <div className="tm-container">
          <nav className="py-4 flex items-center justify-between w-full">
            <a href={ROUTES.HOME} className="block w-42 md:w-52">
              <Logo className="w-full h-full" />
            </a>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default LandingHeader;
