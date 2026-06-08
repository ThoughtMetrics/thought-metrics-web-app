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
      <footer style={{ background: 'var(--surface-container-lowest)', borderTop: '1px solid var(--glass-border-color)' }}>
        <div className="w-full h-1 md:h-1.5 bg-linear-to-r from-secondary to-primary" />
        {!isTrackingLinkMode && (
          <div className="tm-container">
            <div className="flex items-center gap-6 py-3 flex-wrap">
              {footerLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.link}
                  className="text-sm font-medium transition-colors hover:underline underline-offset-4"
                  style={{ color: 'var(--on-surface-variant)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--on-surface)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--on-surface-variant)'; }}
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
