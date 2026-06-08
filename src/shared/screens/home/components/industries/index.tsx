import React, { useState } from 'react';

interface IndustryPanel {
  id: string;
  tab: string;
  label: string;
  heading: string;
  desc: string;
  bullets: string[];
  href: string;
  ctaText: string;
}

const industries: IndustryPanel[] = [
  {
    id: 'fmcg', tab: 'FMCG',
    label: 'FMCG', heading: 'Consumer goods insights at scale',
    desc: "Understand purchase drivers, shelf behaviour, packaging preferences, and brand perception across India's diverse consumer landscape — from metro to tier-3 towns.",
    bullets: ['Brand awareness & recall studies', 'Product concept testing', 'Pack & price sensitivity research', 'Retail audit & in-store observation'],
    href: '/industries/fmcg', ctaText: 'Explore FMCG Research',
  },
  {
    id: 'retail', tab: 'Retail and Merchandising',
    label: 'Retail & Merchandising', heading: 'Shopper intelligence that drives sales',
    desc: "Map the shopper journey from awareness to purchase. Our retail research connects you with real shoppers across modern trade, traditional trade, and e-commerce.",
    bullets: ['Shopper journey mapping', 'In-store experience audits', 'Planogram & display effectiveness', 'Mystery shopping programmes'],
    href: '/industries/retail', ctaText: 'Explore Retail Research',
  },
  {
    id: 'financial', tab: 'Financial Services',
    label: 'Financial Services', heading: 'Insights for a trust-driven sector',
    desc: "Understand financial product adoption, digital banking behaviour, and the barriers to financial inclusion across India's complex, multi-tier market.",
    bullets: ['Banking & fintech adoption studies', 'Credit & lending behaviour', 'Customer satisfaction & NPS', 'Financial literacy assessment'],
    href: '/industries/finance', ctaText: 'Explore Financial Research',
  },
  {
    id: 'insurance', tab: 'Insurance',
    label: 'Insurance', heading: "Understanding India's insurance mindset",
    desc: "Decode awareness, penetration, and product preference patterns across life, health, and general insurance categories in a rapidly evolving market.",
    bullets: ['Insurance awareness & penetration', 'Claims experience research', 'Product concept testing', 'Agent & channel effectiveness'],
    href: '/industries/finance', ctaText: 'Explore Insurance Research',
  },
  {
    id: 'technology', tab: 'Technology',
    label: 'Technology', heading: 'User research at the speed of product',
    desc: "From UX studies and feature prioritisation to demand sensing for new categories — our panel delivers rapid, rigorous feedback for tech companies building for India.",
    bullets: ['UX & usability testing', 'Feature & concept validation', 'Technology adoption studies', 'Pricing & willingness-to-pay research'],
    href: '/industries/technology', ctaText: 'Explore Technology Research',
  },
  {
    id: 'automotive', tab: 'Automotive',
    label: 'Automotive', heading: 'Drive decisions with deep consumer data',
    desc: "Understand vehicle purchase journeys, EV adoption attitudes, and dealer experience across India's vast and segmented automotive market.",
    bullets: ['Vehicle purchase journey research', 'EV adoption & barriers study', 'Dealer & after-sales CX audits', 'Brand & feature preference mapping'],
    href: '/industries/automotive', ctaText: 'Explore Automotive Research',
  },
  {
    id: 'advertising', tab: 'Advertising & Marketing',
    label: 'Advertising & Marketing', heading: 'Measure what your messaging really does',
    desc: "Pre-test campaigns, track brand lift, and evaluate creative effectiveness with real consumers before you spend on media.",
    bullets: ['Ad & creative pre-testing', 'Campaign recall & brand lift', 'Message resonance testing', 'Influencer & media effectiveness'],
    href: '/industries/advertising', ctaText: 'Explore Advertising Research',
  },
  {
    id: 'hr', tab: 'Human Resources',
    label: 'Human Resources', heading: 'Employee & workforce intelligence',
    desc: "Go beyond annual surveys to understand what drives engagement, retention, and productivity across diverse workforce segments in India.",
    bullets: ['Employee engagement surveys', 'Exit interview analysis', 'Culture & DEI benchmarking', 'Benefits & compensation research'],
    href: '/industries/hr', ctaText: 'Explore HR Research',
  },
  {
    id: 'healthcare', tab: 'Healthcare & Life Sciences',
    label: 'Healthcare & Life Sciences', heading: 'Patient, caregiver, and HCP insights',
    desc: "Navigate India's complex healthcare landscape with research that spans patients, caregivers, doctors, and pharmacists across public and private healthcare settings.",
    bullets: ['Patient journey & experience', 'HCP & prescriber studies', 'Health awareness & behaviour surveys', 'Treatment adherence research'],
    href: '/industries/healthcare', ctaText: 'Explore Healthcare Research',
  },
];

const Industries: React.FC = () => {
  const [activeId, setActiveId] = useState(industries[0].id);
  const active = industries.find(i => i.id === activeId)!;

  return (
    <section className="industries-section" id="industries">
      <div className="tm-container">

        <div className="industries-header">
          <p className="section-eyebrow">Industries</p>
          <h2 className="industries-title">We Know Your Industry</h2>
        </div>

        <div className="industries-layout">

          {/* Tab rail */}
          <div className="industries-tabs" role="tablist" aria-label="Industries">
            {industries.map(ind => (
              <button
                key={ind.id}
                role="tab"
                aria-selected={activeId === ind.id}
                tabIndex={activeId === ind.id ? 0 : -1}
                className={`industry-tab${activeId === ind.id ? ' active' : ''}`}
                onClick={() => setActiveId(ind.id)}
                onKeyDown={e => {
                  const idx = industries.findIndex(i => i.id === activeId);
                  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    setActiveId(industries[(idx + 1) % industries.length].id);
                  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    setActiveId(industries[(idx - 1 + industries.length) % industries.length].id);
                  }
                }}
              >
                {ind.tab}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div
            key={active.id}
            className="industry-panel active"
            role="tabpanel"
          >
            <p className="panel-label">{active.label}</p>
            <h3>{active.heading}</h3>
            <p className="panel-desc">{active.desc}</p>

            <div className="panel-bullets">
              {active.bullets.map(bullet => (
                <div key={bullet} className="bullet-item">
                  <span className="check-circle">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="2,6 5,9 10,3" />
                    </svg>
                  </span>
                  {bullet}
                </div>
              ))}
            </div>

            <a href={active.href} className="btn-outline-blue">
              {active.ctaText} →
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Industries;
