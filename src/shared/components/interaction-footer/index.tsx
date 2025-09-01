import React from 'react';
import { Link } from 'react-router-dom';
import { footerLinks } from './constant';

const InteractionFooter: React.FC = () => {
  return (
    <div className="relative">
      <footer className="common-component bg-white flex flex-col">
        <div className="w-full h-2.5 bg-gradient-to-r from-secondary to-primary"></div>
        {/* Footer Links */}
        <div className="bg-white w-full flex justify-center">
          <div className="common-container !max-w-[var(--breakpoint-2xl)] space-x-8 px-6 py-4 md:px-24 flex items-center">
            {footerLinks.map((item) => (
              <Link
                key={item.label}
                to={item.link}
                className="text-sm md:text-lg text-black font-medium hover:font-regular underline"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InteractionFooter;
