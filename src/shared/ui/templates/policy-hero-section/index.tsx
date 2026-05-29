import React from 'react';
import '../../../../styles/markdown.css';
import MarkDownOrganism from '../../organisms/markdown-organism';

const PolicyHeroSection: React.FC<{ content: string; head: string }> = ({ content, head }) => {
  return (
    <div style={{ background: 'var(--surface)' }}>

      {/* Hero banner */}
      <div
        className="relative overflow-hidden flex items-center"
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, var(--secondary)) 100%)',
          minHeight: 220,
          padding: '56px 0',
        }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">
          <div
            className="absolute -top-24 -right-24 rounded-full"
            style={{ width: 480, height: 480, background: 'rgba(255,255,255,0.07)', filter: 'blur(80px)' }}
          />
        </div>
        <div className="tm-container relative" style={{ zIndex: 1 }}>
          <h1
            className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.08]"
            style={{ color: 'var(--on-primary)' }}
          >
            {head}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="tm-container py-12 md:py-16">
        <MarkDownOrganism content={content} showTOC={false} />
      </div>

    </div>
  );
};

export default PolicyHeroSection;
