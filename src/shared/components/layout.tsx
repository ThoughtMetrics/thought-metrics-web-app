import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import { Breadcrumbs } from './breadcrumbs';
import ScrollToTop from './scroll-to-top';

const Layout: React.FC = () => {
  const location = useLocation();
  const showBreadcrumbs = location.pathname !== '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ScrollToTop />
      <main className="flex-1 relative">
        {showBreadcrumbs && (
          <div className="absolute w-full flex justify-center z-50">
            <Breadcrumbs className="w-[var(--breakpoint-2xl)] p-6 md:p-10 xxl:py-0 xxl:px-0" />
          </div>
        )}
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
