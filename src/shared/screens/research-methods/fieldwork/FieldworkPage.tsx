import React, { useState } from 'react';

const ResearchMethodFieldwork: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggle = (i: number) => setOpenFaq(openFaq === i ? null : i);

  const checkSvg = (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="2,6 5,9 10,3" />
    </svg>
  );

  const faqs = [
    {
      q: 'Can you find the exact audience I need?',
      items: ['Yes — we specialize in both general and hard-to-reach audiences', 'Our intelligent recruitment process ensures high-quality participants', 'We source globally or hyper-locally, depending on your need'],
    },
    {
      q: 'How do you ensure the data is trustworthy?',
      items: ['Multiple layers of quality control at every project stage', 'Fraud detection, attention checks, and response validation', 'Experienced moderators and certified survey designers'],
    },
    {
      q: 'Can you handle fast turnarounds?',
      items: ['Yes — we\'re built for speed without sacrificing accuracy', 'Agile teams and flexible processes scale to your deadline', 'Transparent communication every step of the way'],
    },
    {
      q: 'What if I need mixed-method — online and offline?',
      items: ['We offer fully integrated qual + quant solutions', 'Phone, in-person, digital, and hybrid approaches available', 'One point of contact for streamlined coordination'],
    },
  ];

  const coverageDots = [
    ['primary', 80], ['secondary', 60], ['primary', 40], ['primary', 70], ['secondary', 30], ['primary', 50], ['tertiary', 40], ['primary', 90],
    ['secondary', 50], ['primary', 90], ['primary', 60], ['secondary', 80], ['primary', 50], ['primary', 70], ['tertiary', 60], ['secondary', 40],
    ['primary', 70], ['tertiary', 50], ['primary', 90], ['secondary', 30], ['primary', 60], ['primary', 80], ['secondary', 70], ['primary', 40],
    ['secondary', 60], ['primary', 50], ['tertiary', 40], ['primary', 80], ['primary', 30], ['secondary', 90], ['primary', 55], ['primary', 70],
  ] as [string, number][];

  return (
    <>
      {/* ── Hero ── */}
      <section className="tm-section relative">
        <div className="tm-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <nav className="flex items-center gap-2 mb-6 text-xs text-on-surface-variant" aria-label="Breadcrumb">
              <a href="/" className="hover:text-on-surface transition-colors">Home</a>
              <span className="opacity-40">/</span>
              <a href="/research-methods" className="opacity-60 hover:text-on-surface transition-colors">Research Methods</a>
              <span className="opacity-40">/</span>
              <span className="text-primary font-medium">Recruitment &amp; Fieldwork</span>
            </nav>
            <span className="chip mb-6 inline-flex">RECRUITMENT &amp; FIELDWORK</span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.08]">
              Pick A Location.<br />
              <span className="text-primary italic">Our Experts</span><br />
              Will Get You There.
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
              Leave the logistics to us. We source precise audiences, manage data collection end-to-end, and ensure research quality — anywhere across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <a href="/start-your-research" className="btn-primary">Request a Bid</a>
              <a href="#services" className="btn-ghost">See What We Do</a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[3rem] overflow-hidden bg-surface-container-low border border-outline-variant/10 shadow-2xl p-10 flex flex-col gap-6 min-h-[380px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Coverage</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-xs text-on-surface-variant">Live</span>
                </div>
              </div>
              <div className="grid grid-cols-8 gap-2">
                {coverageDots.map(([color, opacity], idx) => (
                  <div key={idx} className={`w-full aspect-square rounded-sm bg-${color}`} style={{ opacity: opacity / 100 }}></div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                <span className="text-sm text-on-surface font-semibold">All-India Coverage — 700+ Cities</span>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
              <div className="text-primary text-2xl font-bold mb-0.5">3–5 Days</div>
              <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Avg Turnaround</div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
              <div className="text-secondary text-2xl font-bold mb-0.5">5,00,000+</div>
              <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Verified Respondents</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }} aria-hidden="true">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[140px] rounded-full" />
      </div>
      </section>

      {/* ── Stats Ribbon ── */}
      <section className="bg-surface-container-lowest py-14 border-y border-outline-variant/5">
        <div className="tm-container flex flex-wrap justify-between gap-10 items-center">
          {[
            { icon: 'map', color: 'secondary', label: '700+ Cities', sub: 'All-India Reach' },
            { icon: 'target', color: 'primary', label: 'Any Audience', sub: 'Niche or National Scale' },
            { icon: 'speed', color: 'secondary-container', label: '3–5 Days', sub: 'Average Turnaround' },
            { icon: 'checklist', color: 'primary-container', label: 'End-to-End', sub: 'Full Fieldwork Management' },
          ].map(({ icon, color, label, sub }) => (
            <div key={label} className="flex items-center gap-4">
              <span className={`material-symbols-outlined text-4xl text-${color}`}>{icon}</span>
              <div>
                <div className="text-2xl font-bold text-on-surface">{label}</div>
                <div className="text-on-surface-variant text-sm">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section className="tm-section bg-surface" id="services">
        <div className="tm-container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <div className="max-w-2xl">
              <p className="section-eyebrow">What We Deliver</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-5">Comprehensive Fieldwork <span className="text-secondary">Solutions</span></h2>
              <p className="text-lg text-on-surface-variant">From sourcing the right respondents to delivering clean, analysis-ready data — we handle every stage of the research lifecycle.</p>
            </div>
            <a href="/start-your-research" className="btn-ghost flex-shrink-0">Request a Bid</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="ds-card ds-card--wide group relative md:col-span-2 overflow-hidden">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">group_search</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-on-surface">Sample Management</h3>
                  <p className="text-on-surface-variant text-base mb-6 max-w-md">We source the right respondents — no matter how specific the target. From national samples to niche segments, we manage quotas, screeners, and panels to ensure your data is built on solid ground.</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="chip">QUOTA MANAGEMENT</span>
                  <span className="chip">SCREENERS</span>
                  <span className="chip">PANEL SOURCING</span>
                </div>
              </div>
              <div className="absolute top-0 right-0 h-full w-1/4 opacity-10 group-hover:opacity-25 transition-opacity pointer-events-none flex items-center justify-end pr-8">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '8rem' }}>manage_search</span>
              </div>
            </div>

            <div className="ds-card">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-secondary text-3xl">task_alt</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-on-surface">Fieldwork Management</h3>
              <p className="text-on-surface-variant mb-5">We handle the logistics so you can focus on insights — from scheduling interviews to monitoring live surveys.</p>
              <ul className="space-y-2">
                {['Real-time progress updates', 'Interview scheduling', 'Live survey monitoring'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-secondary text-base">check_circle</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="ds-card">
              <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-tertiary text-3xl">dataset</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-on-surface">Data Processing</h3>
              <p className="text-on-surface-variant mb-5">From raw to ready — we clean, code, and structure your data for immediate use.</p>
              <ul className="space-y-2">
                {['Open-end coding', 'Data validation', 'Multiple output formats'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-tertiary text-base">check_circle</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="ds-card ds-card--elevated group relative md:col-span-2 overflow-hidden">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">science</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-on-surface">Research Design, Moderation &amp; Reporting</h3>
                  <p className="text-on-surface-variant text-base mb-6 max-w-lg">We help translate business objectives into strong research frameworks. Whether it's qual, quant, or mixed methods, we ensure the right tools, questions, and structure are in place to meet your goals.</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="chip">QUALITATIVE</span><span className="chip">QUANTITATIVE</span>
                  <span className="chip">MIXED METHODS</span><span className="chip">WHITE-LABELING</span>
                </div>
              </div>
            </div>
          </div>

          <div className="ds-card flex flex-col md:flex-row gap-8 items-center">
            <div className="w-16 h-16 flex-shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-4xl">verified_user</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-on-surface">Compliance and Ethics</h3>
              <p className="text-on-surface-variant text-base">We follow strict protocols to ensure every study meets data privacy laws, ethical guidelines, and respondent protections. Trust and transparency are at the core of our fieldwork.</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
              <span className="chip">GDPR COMPLIANT</span><span className="chip">RESPONDENT CONSENT</span><span className="chip">DATA SECURITY</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="tm-section bg-surface-container-lowest">
        <div className="tm-container">
          <div className="mb-12">
            <p className="section-eyebrow">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-bold">Seamless. <span className="text-primary">End-to-End.</span></h2>
          </div>
          <div className="border border-outline-variant/20 rounded-2xl overflow-hidden">
            <div className="process-grid">
              {[
                { n: '01', icon: 'edit_note', t: 'Define', d: 'You brief us on your research objectives, target audience, methodology, and timelines.' },
                { n: '02', icon: 'person_search', t: 'Recruit', d: 'We source, screen, and validate the precise respondents your study requires — nationally or locally.' },
                { n: '03', icon: 'play_circle', t: 'Execute', d: 'We manage every field activity — interviews, surveys, moderation — with real-time progress reporting.' },
                { n: '04', icon: 'database', t: 'Deliver', d: 'You receive clean, structured, analysis-ready data on time — every time.' },
              ].map(({ n, icon, t, d }) => (
                <div key={n} className="process-step">
                  <div className="process-number">{n}</div>
                  <div className="process-icon">
                    <span className="material-symbols-outlined text-xl">{icon}</span>
                  </div>
                  <div className="process-title">{t}</div>
                  <div className="process-desc">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="tm-section bg-surface" id="faq">
        <div className="tm-container">
          <div className="mb-12">
            <p className="section-eyebrow">Your Questions, Answered</p>
            <h2 className="text-4xl md:text-5xl font-bold">Fieldwork That <span className="text-secondary">Delivers</span></h2>
            <p className="text-on-surface-variant text-lg mt-4 max-w-xl">On time. On target. On budget.</p>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-card ${openFaq === i ? 'open' : ''}`}
                onClick={() => toggle(i)}
              >
                <div className="faq-header">
                  <p className="faq-question">{faq.q}</p>
                  <span className="faq-chevron">&#9660;</span>
                </div>
                <div className="faq-body">
                  <ul>
                    {faq.items.map((item, j) => (
                      <li key={j}>
                        <span className="check-circle flex-shrink-0">{checkSvg}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fieldwork Anywhere ── */}
      <section className="tm-section bg-surface-container-lowest">
        <div className="tm-container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-eyebrow">Coverage</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">We Are Wherever<br /><span className="text-primary">You Need Us</span></h2>
            <p className="text-on-surface-variant text-lg mb-6 leading-relaxed">
              Small town? We can be there too. Our capabilities don't end with our market research venues — we bring the fieldwork experience to the market you need to reach. Inside. Outside. Any group. Any time.
            </p>
            <p className="text-on-surface font-semibold mb-5">Through fieldwork anywhere, you have access to:</p>
            <ul className="space-y-4 mb-8">
              {[
                'Cutting-edge technology and digital-first tools',
                'Location experts with deep ground-level knowledge',
                'Specialized recruitment solutions for any segment',
                'Fieldwork facility-level support outside our facilities',
              ].map(item => (
                <li key={item} className="bullet-item">
                  <span className="check-circle flex-shrink-0">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="2,6 5,9 10,3" /></svg>
                  </span>
                  <span className="text-on-surface">{item}</span>
                </li>
              ))}
            </ul>
            <a href="/start-your-research" className="btn-primary">Start Your Project</a>
          </div>

          <div className="coverage-card">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-2xl">public</span>
              <span className="text-on-surface font-bold text-lg">Fieldwork Anywhere</span>
            </div>
            {[
              { icon: 'apartment', t: 'Tier 1 Cities', d: 'Mumbai, Delhi, Bengaluru, Chennai + more' },
              { icon: 'location_city', t: 'Tier 2 & 3 Markets', d: 'Jaipur, Coimbatore, Nashik, Visakhapatnam + 600+' },
              { icon: 'forest', t: 'Rural & Semi-Urban', d: 'Ground agents in Tier 4+ markets and village clusters' },
              { icon: 'language', t: 'Multi-lingual Execution', d: '15+ languages across all major Indian states' },
            ].map(({ icon, t, d }) => (
              <div key={t} className="coverage-stat">
                <div className="coverage-stat-icon">
                  <span className="material-symbols-outlined text-xl">{icon}</span>
                </div>
                <div>
                  <div className="text-on-surface font-semibold text-sm">{t}</div>
                  <div className="text-on-surface-variant text-xs">{d}</div>
                </div>
              </div>
            ))}
            <div className="mt-2 pt-5 border-t border-outline-variant/20 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-primary text-xl font-bold">700+</div>
                <div className="text-on-surface-variant text-xs">Cities</div>
              </div>
              <div>
                <div className="text-secondary text-xl font-bold">15+</div>
                <div className="text-on-surface-variant text-xs">Languages</div>
              </div>
              <div>
                <div className="text-primary text-xl font-bold">5L+</div>
                <div className="text-on-surface-variant text-xs">Respondents</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="tm-section bg-surface" id="cta">
        <div className="tm-container">
          <div className="cta-card">
            <div className="cta-content">
              <p className="cta-eyebrow">Get Started Today</p>
              <h2 className="cta-heading">Fieldwork That Reaches Every Corner of India.</h2>
              <p className="cta-body">From niche urban audiences to rural respondents, our end-to-end fieldwork management ensures you get the right data — on time, every time.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/start-your-research" className="btn-surface">Request a Bid</a>
                <a href="/contact-us" className="btn-cta-frosted">Talk to Our Team</a>
              </div>
            </div>
            <div className="cta-orb cta-orb--tl"></div>
            <div className="cta-orb cta-orb--br"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResearchMethodFieldwork;
