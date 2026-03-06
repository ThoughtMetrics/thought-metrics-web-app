import React from 'react';
import { Logo } from '@/assets';

const CampaignHeader: React.FC = () => {
  return (
    <header className="w-full bg-white shrink-0">
      <div className="px-6 py-3 flex items-center">
        <a href="/" aria-label="Thought Metrics Home">
          <div className="w-40 pt-1">
            <Logo className="w-full h-full" />
          </div>
        </a>
      </div>
      <div className="w-full h-px bg-gray-100"></div>
    </header>
  );
};

export default CampaignHeader;
