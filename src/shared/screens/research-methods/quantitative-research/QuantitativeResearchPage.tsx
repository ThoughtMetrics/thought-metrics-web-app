import React, { useState } from 'react';

interface BlogItem { id: number; type: string; category: string; label: string; description: string; link: string; src: string; }
interface Props { blogData?: { title: string; items: BlogItem[] } | null; }

const ResearchMethodQuantitativeResearch: React.FC<Props> = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggle = (i: number) => setOpenFaq(openFaq === i ? null : i);

  const faqs = [
    { q: 'How large a sample do I need?', a: 'It depends on your required margin of error, confidence level, and whether you need segment-level analysis. For most consumer studies, n=300–400 gives ±5% at 95% confidence. For subgroup analysis, each cell should be at least n=100. We recommend sample sizes based on your specific objectives.' },
    { q: 'How fast can you field an online survey?', a: 'For standard consumer surveys with general population targeting, we typically close fieldwork within 48–72 hours. For niche segments or B2B studies, this may extend to 5–10 days depending on incidence rate and sample size.' },
    { q: 'Do you offer offline / CAPI surveys?', a: 'Yes. We conduct in-home interviews, street intercepts, and Central Location Tests (CLTs) using tablet-based CAPI across tier 1, 2, and 3 cities in India. This is especially valuable for reaching non-online audiences or conducting product/concept tests.' },
    { q: 'What deliverables do I receive?', a: 'Standard deliverables include: cleaned data file (SPSS/Excel), detailed crosstab tables, and a PowerPoint insight deck with charts and recommendations. We can also provide interactive dashboards, open-end summaries, and custom analysis on request.' },
    { q: 'Can you handle multi-country studies?', a: 'Yes. Through our partner network, we can coordinate simultaneous quantitative fieldwork across multiple countries with consistent methodology, translations, and harmonized reporting. Contact us to discuss multi-market requirements.' },
  ];

  const services = [
    { icon: 'draw', color: 'primary', t: 'Smart Survey Design', chips: ['LOGIC BRANCHING', 'MOBILE FIRST'], d: 'We craft surveys that ask the right questions the right way — clear, engaging, and optimized for accurate responses across devices and demographics. Logic branching, question balancing, and bias prevention built in.' },
    { icon: 'group_add', color: 'secondary', t: 'Robust Sampling & Reach', chips: ['RANDOM SAMPLING', 'QUOTA CONTROL'], d: 'Whether targeting the general population or niche segments, we ensure statistically sound samples that deliver meaningful, representative insights — from urban metros to rural India.' },
    { icon: 'security', color: 'tertiary', t: 'Data Quality Assurance', chips: ['FRAUD DETECTION', 'VALIDATION'], d: 'Our multi-layered quality checks eliminate fraud, inattentive responses, and bias — so you can trust every number in your dataset. Attention checks, speeders detection, and open-end validation included.' },
    { icon: 'phone_callback', color: 'primary', t: 'CATI & Telephonic Surveys', chips: ['B2B RESEARCH', 'RURAL REACH'], d: 'Reach hard-to-access respondents with computer-assisted telephone interviewing. Ideal for B2B research, rural audiences, or projects requiring a human interviewer for credibility and response depth.' },
    { icon: 'repeat', color: 'secondary', t: 'Tracker & Longitudinal Studies', chips: ['BRAND TRACKER', 'WAVE STUDIES'], d: 'Monitor brand health, satisfaction, or category trends over time with recurring quantitative studies. Consistent methodology, comparable waves, and trend analysis built into every tracker.' },
    { icon: 'insights', color: 'tertiary', t: 'Advanced Analytics & Reporting', chips: ['CONJOINT', 'MAXDIFF'], d: 'From crosstabs and regression to MaxDiff and conjoint analysis, we turn raw survey data into decision-ready insight decks, dashboards, and executive summaries.' },
  ];

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
              <span className="text-primary font-medium">Quantitative Research</span>
            </nav>
            <span className="chip mb-6 inline-flex">QUANTITATIVE RESEARCH</span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.08]">
              Cutting Edge<br />
              <span className="text-primary italic">Quantitative Solutions.</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
              Powering understanding, confidence, and bolder decisions through technology-led quantitative services — from smart survey design to robust sampling and fast, reliable reporting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <a href="/start-your-research" className="btn-primary">Request a Bid</a>
              <a href="#services" className="btn-ghost">Explore Services</a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[3rem] bg-surface-container-low border border-outline-variant/10 shadow-2xl p-8 flex flex-col gap-5 min-h-[360px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Survey Performance Monitor</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                  <span className="text-xs text-on-surface-variant">Live</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Response Rate', pct: 87, color: 'primary' },
                  { label: 'Completion Rate', pct: 92, color: 'secondary' },
                  { label: 'Data Quality Score', pct: 96, color: 'tertiary' },
                ].map(({ label, pct, color }) => (
                  <div key={label} className="bg-surface-container rounded-xl p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-on-surface">{label}</span>
                      <span className={`text-xs font-bold text-${color}`}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-outline-variant/20 rounded-full">
                      <div className={`h-full bg-${color} rounded-full`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-auto">
                <div className="bg-surface-container rounded-xl p-3 text-center">
                  <div className="text-lg font-extrabold text-primary">1,200</div>
                  <div className="text-[10px] text-on-surface-variant">Responses</div>
                </div>
                <div className="bg-surface-container rounded-xl p-3 text-center">
                  <div className="text-lg font-extrabold text-secondary">48 hrs</div>
                  <div className="text-[10px] text-on-surface-variant">Fieldwork</div>
                </div>
                <div className="bg-surface-container rounded-xl p-3 text-center">
                  <div className="text-lg font-extrabold text-tertiary">±3%</div>
                  <div className="text-[10px] text-on-surface-variant">Margin</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
              <div className="text-primary text-2xl font-bold mb-0.5">48 hrs</div>
              <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Average Fieldwork</div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
              <div className="text-secondary text-2xl font-bold mb-0.5">AI-Powered</div>
              <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Survey Design</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }} aria-hidden="true">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/8 blur-[140px] rounded-full" />
        </div>
      </section>

      {/* ── Stats Ribbon ── */}
      <section className="bg-surface-container-lowest py-14 border-y border-outline-variant/5">
        <div className="tm-container flex flex-wrap justify-between gap-10 items-center">
          {[
            { icon: 'draw', color: 'primary', label: 'Smart Survey Design', sub: 'Right Questions, Right Way' },
            { icon: 'group_add', color: 'secondary', label: 'Robust Sampling', sub: 'Representative & Niche Audiences' },
            { icon: 'shield_check', color: 'tertiary', label: 'Data Quality', sub: 'Multi-Layer Verification' },
            { icon: 'analytics', color: 'primary-container', label: 'Fast Reporting', sub: 'Actionable Insights, Fast' },
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
              <p className="section-eyebrow">Our Services</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-5">Quantitative Research That <span className="text-secondary">Delivers Certainty</span></h2>
              <p className="text-lg text-on-surface-variant">We combine technology-led survey infrastructure with expert research design to deliver data you can confidently base decisions on.</p>
            </div>
            <a href="/start-your-research" className="btn-ghost flex-shrink-0">Get a Quote</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon, color, t, chips, d }) => (
              <div key={t} className="ds-card group relative overflow-hidden">
                <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center mb-6`}>
                  <span className={`material-symbols-outlined text-${color} text-3xl`}>{icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-on-surface">{t}</h3>
                <p className="text-on-surface-variant text-base mb-6">{d}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {chips.map(c => <span key={c} className="chip">{c}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="tm-section bg-surface-container-lowest">
        <div className="tm-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="section-eyebrow">When to Use Quantitative</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Measure What Matters With <span className="text-primary">Confidence</span></h2>
              <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">Quantitative research is the right choice when you need to measure, quantify, compare, or track — at scale, with statistical validity. It answers "how many," "how much," and "how often."</p>
              <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-secondary text-xl">check_circle</span>
                  <span className="font-semibold text-on-surface">Best For</span>
                </div>
                <ul className="space-y-2">
                  {['Brand awareness & satisfaction tracking', 'Concept testing with statistically valid scores', 'Segmentation & market sizing', 'Pricing research & choice modelling'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-base">arrow_right</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className={`faq-card ${openFaq === i ? 'open' : ''}`}>
                  <button
                    className="w-full flex items-center justify-between gap-3 px-6 py-5 text-left cursor-pointer bg-transparent border-0"
                    style={{ font: 'inherit' }}
                    aria-expanded={openFaq === i}
                    onClick={() => toggle(i)}
                  >
                    <span className="text-sm font-semibold text-on-surface">{faq.q}</span>
                    <span className="material-symbols-outlined flex-shrink-0 text-on-surface-variant text-xl">
                      {openFaq === i ? 'remove' : 'add'}
                    </span>
                  </button>
                  <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-60 pb-5' : 'max-h-0'}`}>
                    <p className="text-sm text-on-surface-variant pt-3 border-t border-outline-variant/20">{faq.a}</p>
                  </div>
                </div>
              ))}
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
              <h2 className="cta-heading">Make Decisions You Can Defend With Statistically Valid Data.</h2>
              <p className="cta-body">From rapid consumer polls to large-scale tracker studies, our quantitative research services deliver the numbers — and the insight behind them — quickly and reliably.</p>
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

export default ResearchMethodQuantitativeResearch;
