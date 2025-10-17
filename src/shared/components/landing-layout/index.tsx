import React from 'react';
import { Outlet } from '';
import ScrollToTop from '../scroll-to-top';
import LandingHeader from '../landing-header';

const LandingLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <ScrollToTop />
      <Outlet />
    </div>
  );
};

export default LandingLayout;
