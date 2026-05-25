import React, { useState, useEffect } from 'react';
import { carouselData } from '@/core/constants/page-constants/home-hero-carousel-constant';
import { ROUTES } from '@/routes/routeConfig';

const HeroCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % carouselData.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="tm-section relative">
      <div className="tm-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left: Content */}
        <div className="z-10">
          <span className="chip mb-6 inline-flex">MARKET INTELLIGENCE</span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-on-surface">
            Market Research Powered by{' '}
            <span className="text-primary italic">Real People</span>{' '}
            Across India
          </h1>
          <p className="text-xl text-on-surface-variant max-w-xl mb-10 leading-relaxed">
            Access deep insights from over 5,00,000+ verified respondents. We
            bridge the gap between enterprise strategy and ground-level reality
            with precision and speed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <a href={`${ROUTES.LOGIN_IN}?userType=client`} className="btn-primary">
              Start Your Research
            </a>
            <div className="flex items-center gap-3 px-4 py-2 bg-surface-container-low rounded-xl">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full border-2 border-surface-container shadow-lg bg-primary-container" />
                <div className="w-8 h-8 rounded-full border-2 border-surface-container shadow-lg bg-secondary-container" />
                <div className="w-8 h-8 rounded-full border-2 border-surface-container shadow-lg bg-tertiary-container" />
              </div>
              <span className="text-sm font-medium text-on-surface">
                5,00,000+ Respondents
              </span>
            </div>
          </div>
        </div>

        {/* Right: Image carousel */}
        <div className="relative">
          <div
            className="aspect-square rounded-[3rem] overflow-hidden bg-surface-container-low shadow-2xl isolate"
            style={{ border: '1px solid rgba(65,71,84,0.10)' }}
          >
            <div className="relative w-full h-full">
              {carouselData.map((slide, i) => (
                <img
                  key={i}
                  src={slide.src}
                  alt={slide.alt}
                  className="absolute inset-0 w-full h-full object-cover hero-slide"
                  style={{
                    opacity: i === current ? 1 : 0,
                    transition: 'opacity 0.7s ease',
                    pointerEvents: i === current ? 'auto' : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Floating stat card */}
          <div
            className="absolute -bottom-6 -left-6 p-6 rounded-2xl shadow-2xl"
            style={{
              background: 'rgba(42,42,42,0.80)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(65,71,84,0.20)',
            }}
          >
            <div className="text-primary text-3xl font-bold mb-1">3 Days</div>
            <div
              className="text-sm uppercase tracking-wider font-bold"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              Turnaround Time
            </div>
          </div>
        </div>
      </div>

      {/* Ambient orb — own clipping wrapper so it doesn't bleed into sections below */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: -1 }}
        aria-hidden="true"
      >
        <div
          className="absolute top-0 right-0 rounded-full"
          style={{
            width: '600px',
            height: '600px',
            background: 'rgba(173,199,255,0.10)',
            filter: 'blur(120px)',
          }}
        />
      </div>
    </section>
  );
};

export default HeroCarousel;
