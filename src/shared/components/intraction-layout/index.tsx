import React from 'react';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../scroll-to-top';
import InteractionHeader from '../interaction-header';
import InteractionFooter from '../interaction-footer';

const InteractionLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <InteractionHeader />
      <ScrollToTop />
      <Outlet />
      <InteractionFooter />
    </div>
  );
};

export default InteractionLayout;
