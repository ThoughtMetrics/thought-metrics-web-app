import React from 'react';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../scroll-to-top';
import InteractionHeader from '../interaction-header';

const InteractionLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <InteractionHeader />
      <ScrollToTop />
      <main className="flex-1 relative">
        <Outlet />
      </main>
    </div>
  );
};

export default InteractionLayout;
