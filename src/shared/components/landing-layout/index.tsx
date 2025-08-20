import React from 'react';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../scroll-to-top';
import LandingHeader from '../landing-header';

const LandingLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <ScrollToTop />
      <main className="flex-1 relative">
        <Outlet />
      </main>
    </div>
  );
};

export default LandingLayout;
