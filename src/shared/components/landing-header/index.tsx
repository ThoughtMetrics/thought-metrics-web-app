import React from 'react';
import { Logo } from '@/assets';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routeConfig';
import CustomButtonAtom from '@/shared/ui/atoms/custom-button';

const LandingHeader: React.FC = () => {
  return (
    <div className="relative">
      <header className="common-component bg-white">
        <div className="common-container justify-center !max-w-[var(--breakpoint-2xl)]">
          <nav className="px-6 py-5 xxl:px-0 flex items-center justify-between w-full">
            <Link viewTransition={true} to={ROUTES.HOME}>
              <div className="w-42 md:w-54 pt-1">
                <Logo className="w-full h-full" />
              </div>
            </Link>
            <div className="flex items-center justify-end">
              <CustomButtonAtom
                path={ROUTES.RESPONDENT_LANDING}
                label="Sign Up"
                className="rounded font-medium text-sm md:text-lg px-6 py-2 md:px-13 bg-secondary hover:bg-custom-blue"
              />
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default LandingHeader;
