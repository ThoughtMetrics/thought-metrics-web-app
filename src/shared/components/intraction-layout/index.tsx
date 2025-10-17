import React from 'react';
import { Outlet } from '';
import ScrollToTop from '../scroll-to-top';
import InteractionHeader from '../interaction-header';
import InteractionFooter from '../interaction-footer';

const InteractionLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-full h-full w-full">
      <InteractionHeader />
      <ScrollToTop />
      <Outlet />
      <InteractionFooter />
    </div>
  );
};

export default InteractionLayout;
