import React, { useEffect, useState } from 'react';

import { footerLinks } from './constant';

const InteractionFooter: React.FC = () => {
  const [isTrackingLinkMode, setIsTrackingLinkMode] = useState(false);

  useEffect(() => {
    try {
      setIsTrackingLinkMode(!!localStorage.getItem('tm_survey_lock'));
    } catch {}
  }, []);

  return (
    <div className="relative h-fit shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <footer className="common-component bg-white flex flex-col">
        <div className="w-full h-1 md:h-1.5 bg-linear-to-r from-secondary to-primary"></div>
        {!isTrackingLinkMode && (
          <div className="bg-white w-full flex justify-center">
            <div className="common-container max-w-(--breakpoint-2xl)! space-x-8 px-6 py-3 md:px-24 flex items-center">
              {footerLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.link}
                  className="text-sm md:text-base text-black font-medium hover:font-regular underline"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </footer>
    </div>
  );
};

export default InteractionFooter;
