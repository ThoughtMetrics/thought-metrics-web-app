import React from 'react';
import { ArrowRed, Logo } from '@/assets';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routeConfig';

const InteractionHeader: React.FC = () => {
  return (
    <div className="relative">
      <header className="common-component bg-white">
        <div className="common-container justify-center !max-w-[var(--breakpoint-2xl)]">
          <nav className="px-6 py-3 xxl:px-0 flex items-center justify-between w-full">
            <Link viewTransition={true} to={ROUTES.HOME}>
              <div className="w-45 pt-1">
                <Logo className="w-full h-full" />
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-nowrap">
              <Link
                viewTransition={true}
                to={ROUTES.HOME}
                className="text-black font-medium hover:underline underline-offset-4"
              >
                Home
              </Link>
              <Link
                viewTransition={true}
                to={ROUTES.OUR_PANEL}
                className="text-black font-medium hover:underline underline-offset-4"
              >
                About Us
              </Link>
              <Link
                viewTransition={true}
                to={ROUTES.EDIT_PROFILE}
                className="text-black font-medium hover:underline underline-offset-4"
              >
                Edit Profile
              </Link>
              <Link
                viewTransition={true}
                to={ROUTES.HOME}
                className="text-black font-medium hover:underline underline-offset-4"
              >
                Log Off
              </Link>
              <button className="bg-primary text-white text-nowrap w-auto hover:bg-secondary hover:text-white transition-all duration-300 ease-in-out rounded font-medium text-sm md:text-lg px-8 py-1 flex items-center gap-4">
                <Link to={ROUTES.AUTH} viewTransition={true}>
                  <label>Sign In</label>
                </Link>
                <ArrowRed className="fill-current text-white" />
              </button>
            </div>
            <button className="md:hidden bg-primary text-white text-nowrap w-auto hover:bg-secondary hover:text-white transition-all duration-300 ease-in-out rounded font-medium px-6 py-1 flex items-center gap-3">
              <Link to={ROUTES.AUTH} viewTransition={true}>
                <label>Sign In</label>
              </Link>
              <ArrowRed className="fill-current text-white" />
            </button>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default InteractionHeader;
