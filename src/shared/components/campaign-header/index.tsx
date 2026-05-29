import React from 'react';
import { Logo } from '@/assets';

const CampaignHeader: React.FC = () => {
  return (
    <header
      className="w-full shrink-0"
      style={{
        background: 'var(--surface-container-low)',
        borderBottom: '1px solid var(--glass-border-color)',
      }}
    >
      <div className="tm-container">
        <div className="px-0 py-3 flex items-center">
          <a href="/" aria-label="Thought Metrics Home" className="block w-40">
            <Logo className="w-full h-full" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default CampaignHeader;
