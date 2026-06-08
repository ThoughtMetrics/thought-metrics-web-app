import React from 'react';

interface HeroSection {
  title: string;
  description: string;
}

const ContentHeroSection: React.FC<{ heroSection: HeroSection }> = ({ heroSection }) => {
  const words = heroSection.title.split(' ');
  const lastWord = words.pop();
  const restOfTitle = words.join(' ');

  return (
    <section className="tm-section relative overflow-hidden text-center" style={{ background: 'var(--surface)' }}>
      <div className="tm-container max-w-3xl mx-auto">
        <span className="chip mb-6 inline-flex">RESOURCES</span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.08] text-on-surface">
          {restOfTitle}{' '}
          <span className="text-primary italic">{lastWord}</span>
        </h1>
        <p className="text-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
          {heroSection.description}
        </p>
      </div>
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none rounded-full"
        style={{ zIndex: -1, width: 600, height: 350, background: 'var(--primary)', opacity: 0.06, filter: 'blur(140px)' }}
        aria-hidden="true"
      />
    </section>
  );
};

export default ContentHeroSection;
