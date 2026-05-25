import React from 'react';

const MethodsBentoGrid: React.FC = () => {
  return (
    <section className="tm-section bg-surface">
      <div className="tm-container">

        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <p className="section-eyebrow">Research Methods</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-on-surface">
              Methodologies Built for{' '}
              <span className="text-secondary">Precision</span>
            </h2>
            <p className="text-lg" style={{ color: 'var(--on-surface-variant)' }}>
              We utilize a hybrid approach combining traditional rigor with digital
              velocity to ensure your data is as robust as it is actionable.
            </p>
          </div>
          <a href="/research-methods" className="btn-ghost flex-shrink-0">
            View Methodology Guide
          </a>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Ground Surveys — spans 2 cols */}
          <div className="ds-card ds-card--wide group md:col-span-2">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'rgba(173,199,255,0.10)' }}
                >
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '1.875rem' }}>
                    location_on
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-on-surface">Ground Surveys</h3>
                <p className="text-lg mb-8 max-w-md" style={{ color: 'var(--on-surface-variant)' }}>
                  Our field agents penetrate Tier 2 &amp; Tier 3 markets across India,
                  delivering authentic rural and semi-urban insights through
                  Face-to-Face interviews.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="chip">PAPI/CAPI</span>
                <span className="chip">GEO-TAGGING</span>
                <span className="chip">AUDITS</span>
              </div>
            </div>
            <div
              className="absolute top-0 right-0 h-full w-1/3 rounded-r-3xl overflow-hidden opacity-20 group-hover:opacity-40 transition-opacity"
              style={{ pointerEvents: 'none' }}
            >
              <img
                alt="Aerial view of a bustling Indian market square"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvdyZVr6Vzu5CbVbEuefgZPvgV5ZUaw-wUyy8uGaRjJGAFH5J5SWPKTYXxWYUMR4WQ_miTjiTIzvn6_pYHFZU-YIDAMbXZq3I5StkdCIq2dmYSN2e1medSQ64dLLRSf5XudluTNMHA5I5X6_9OS_XbkSkG-SK2pbVdY7qdaA6-ID1rHxVkjCWQXuFsMWri3_f4MY5UiYBUouqN1vuwMMx4MhxHudN-tVmztxXfiNk0D3vFPZ9ZsLtbm0dSE3r90sJjQtQTNYuGNd8J"
              />
            </div>
          </div>

          {/* Online Surveys */}
          <div className="ds-card">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
              style={{ background: 'rgba(143,216,255,0.10)' }}
            >
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: '1.875rem' }}>
                devices
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-on-surface">Online Surveys</h3>
            <p className="mb-6" style={{ color: 'var(--on-surface-variant)' }}>
              Hyper-targeted digital reach across diverse demographics with advanced
              bot detection and response validation.
            </p>
            <ul className="space-y-3">
              {['Instant Data Stream', 'Panel Profiling', 'Multi-Language'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-on-surface">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: '1rem' }}>
                    check_circle
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Focus Groups */}
          <div className="ds-card">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
              style={{ background: 'rgba(185,199,228,0.10)' }}
            >
              <span className="material-symbols-outlined text-tertiary" style={{ fontSize: '1.875rem' }}>
                forum
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-on-surface">Focus Groups</h3>
            <p style={{ color: 'var(--on-surface-variant)' }}>
              Online and offline qualitative moderated sessions to uncover the
              "Why" behind consumer behavior.
            </p>
          </div>

          {/* Process Steps — spans 2 cols */}
          <div className="ds-card ds-card--elevated md:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { num: '01', title: 'Design', desc: 'Questionnaire engineering for quality responses.' },
                { num: '02', title: 'Deploy', desc: 'Rapid All-India rollout via digital & ground networks.' },
                { num: '03', title: 'Verify', desc: 'Three-layer QA process to scrub outliers.' },
                { num: '04', title: 'Analyze', desc: 'Deep insights delivered via custom dashboard.' },
              ].map(step => (
                <div key={step.num} className="space-y-4">
                  <div className="text-4xl font-bold" style={{ color: 'rgba(173,199,255,0.20)' }}>
                    {step.num}
                  </div>
                  <h4 className="font-bold text-on-surface">{step.title}</h4>
                  <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodsBentoGrid;
