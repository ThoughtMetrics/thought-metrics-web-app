import React from 'react';
import Header from './header';
import Footer from './footer';
import ScrollToTop from './scroll-to-top';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default Layout;
