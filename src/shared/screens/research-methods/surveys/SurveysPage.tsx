import React, { useState } from 'react';

const ResearchMethodSurveys: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggle = (i: number) => setOpenFaq(openFaq === i ? null : i);

  const faqs = [
    { q: 'How do you design surveys that get accurate responses?', a: 'Our methodologists translate business objectives into clear, unambiguous questions using cognitive testing and logic branching. Every survey is pre-tested to ensure questions are well-understood and free of bias — before fieldwork begins.' },
    { q: 'How quickly can you launch an online survey?', a: 'For standard consumer surveys targeting the general population, we typically close fieldwork in 48–72 hours. Niche or B2B studies may take 5–10 days depending on incidence rate and sample size.' },
    { q: 'Do you offer phone (CATI) surveys?', a: 'Yes. We operate CATI call centers with automated dialing, live agents, and real-time dashboards. Phone surveys are ideal for reaching non-internet audiences and for studies requiring a human touch for credibility.' },
    { q: 'What deliverables will I receive?', a: 'Standard deliverables include: cleaned data file (SPSS/Excel), detailed crosstab tables, and a PowerPoint insight deck. We can also provide Tableau/Power BI dashboards, open-end summaries, and custom analysis on request.' },
    { q: 'Can you handle multi-modal studies?', a: 'Yes. We specialize in mixed-mode studies that combine online and phone collection — ideal for rural audiences or projects requiring broader demographic reach. One team manages both modes for consistent quality.' },
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
              <span className="text-primary font-medium">Surveys</span>
            </nav>
            <span className="chip mb-6 inline-flex">SURVEYS</span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.08]">
              Survey Smarter.<br />
              <span className="text-primary italic">Decide Better.</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
              From survey design to insights delivery, we manage the entire process — online, by phone, or in-person — so you can reach the right respondents, collect high-quality data, and make confident, data-backed decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <a href="/start-your-research" className="btn-primary">Request a Bid</a>
              <a href="#services" className="btn-ghost">Explore Methods</a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[3rem] overflow-hidden bg-surface-container-low border border-outline-variant/10 shadow-2xl p-10 flex flex-col gap-6 min-h-[380px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Survey Modes</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-xs text-on-surface-variant">Active</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container border border-outline-variant/10">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-xl">laptop</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-on-surface">Online Surveys</div>
                    <div className="text-xs text-on-surface-variant">Web &amp; mobile — anytime, anywhere</div>
                  </div>
                  <div className="text-primary text-xs font-bold">CAWI</div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container border border-outline-variant/10">
                  <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-secondary text-xl">call</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-on-surface">Phone Data Collection</div>
                    <div className="text-xs text-on-surface-variant">Automated + live agent calling</div>
                  </div>
                  <div className="text-secondary text-xs font-bold">CATI</div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container border border-outline-variant/10">
                  <div className="w-10 h-10 rounded-lg bg-tertiary/15 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-tertiary text-xl">shuffle</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-on-surface">Mixed Mode Interviewing</div>
                    <div className="text-xs text-on-surface-variant">Best of online + phone combined</div>
                  </div>
                  <div className="text-tertiary text-xs font-bold">MULTI</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
              <div className="text-primary text-2xl font-bold mb-0.5">48 hrs</div>
              <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Avg Launch Time</div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
              <div className="text-secondary text-2xl font-bold mb-0.5">99.2%</div>
              <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Data Quality Rate</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }} aria-hidden="true">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/8 blur-[140px] rounded-full" />
        </div>
      </section>

      {/* ── Stats Ribbon ── */}
      <section className="bg-surface-container-lowest py-14 border-y border-outline-variant/5">
        <div className="tm-container flex flex-wrap justify-between gap-10 items-center">
          {[
            { icon: 'laptop', color: 'primary', label: 'Online', sub: 'CAWI — Web & Mobile' },
            { icon: 'call', color: 'secondary', label: 'Phone', sub: 'CATI — Automated + Live' },
            { icon: 'location_on', color: 'tertiary', label: 'In-Person', sub: 'CLT, Hall Tests & Intercepts' },
            { icon: 'shuffle', color: 'primary-container', label: 'Mixed Mode', sub: 'Online + Phone Combined' },
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
              <p className="section-eyebrow">Survey Methodologies</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-5">Three Ways to Reach <span className="text-secondary">Your Audience</span></h2>
              <p className="text-lg text-on-surface-variant">From online and telephone surveys to mixed-mode interviewing and central location testing, our capabilities span a wide range of methodologies.</p>
            </div>
            <a href="/start-your-research" className="btn-ghost flex-shrink-0">Get a Quote</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="ds-card ds-card--wide group relative md:col-span-2 overflow-hidden">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">laptop</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-on-surface">Online Surveys</h3>
                  <p className="text-on-surface-variant text-base mb-6 max-w-md">Online surveys give participants the means to engage wherever they are. We add value with specialized programming, smart screening, and engaging respondent experiences that drive completion rates.</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="chip">COST EFFICIENT</span><span className="chip">FAST TURNAROUND</span>
                  <span className="chip">AUTOMATED</span><span className="chip">HIGH RESPONSE RATES</span>
                </div>
              </div>
              <div className="absolute top-0 right-0 h-full w-1/4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none flex items-center justify-end pr-8">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '8rem' }}>dns</span>
              </div>
            </div>

            <div className="ds-card">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-secondary text-3xl">call</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-on-surface">Phone Data Collection</h3>
              <p className="text-on-surface-variant mb-5">We blend technology and human connection through our CATI service — reaching audiences where digital falls short.</p>
              <ul className="space-y-2">
                {['Broader accessibility — no internet needed', 'Automated dialing and call recording', 'Real-time insights dashboard'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-secondary text-base">check_circle</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="ds-card ds-card--elevated">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-tertiary text-3xl">shuffle</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-on-surface">Mixed Mode Interviewing</h3>
                <p className="text-on-surface-variant text-base leading-relaxed">Sometimes the best results — especially with niche or rural audiences — come from combining online surveys with direct phone outreach. One study, two modes, richer data.</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { n: '1', t: 'Broader Reach', d: 'Combining online and phone ensures no audience is left behind — especially in rural or low-internet areas.' },
                  { n: '2', t: 'Increased Response Rates', d: 'Meeting respondents where they\'re most comfortable boosts engagement and completion rates.' },
                  { n: '3', t: 'Deeper Insights', d: 'Online captures structured data fast; phone calls allow for clarification and capturing nuances numbers alone can\'t provide.' },
                  { n: '4', t: 'Tailored Approach', d: 'Every audience is different. Mixed mode gives you the freedom to design outreach that fits your demographic.' },
                ].map(({ n, t, d }) => (
                  <div key={n} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-tertiary/15 flex items-center justify-center flex-shrink-0 text-tertiary text-sm font-bold">{n}</div>
                    <div>
                      <div className="font-semibold text-on-surface text-sm mb-1">{t}</div>
                      <div className="text-on-surface-variant text-sm">{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="tm-section bg-surface-container-lowest">
        <div className="tm-container">
          <div className="mb-14">
            <p className="section-eyebrow">End-to-End Capabilities</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-5">Survey Solutions That <span className="text-primary">Deliver Actionable Insights</span></h2>
            <p className="text-lg text-on-surface-variant max-w-2xl">From methodology design to final reporting — we manage every stage with precision, speed, and quality built in.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: 'manage_search', color: 'primary', t: 'Survey Research', d: 'Our survey methodologists develop and implement survey designs that best meet project requirements — including instrument design, pretesting, and refinement.' },
              { icon: 'design_services', color: 'secondary', t: 'Survey Design', d: 'Methodologists translate business objectives into information needs and a well-defined survey plan. Cognitive testing ensures questions are clear, unambiguous, and actionable.' },
              { icon: 'group_search', color: 'tertiary', t: 'Sampling', d: 'Survey statisticians provide expert recommendations on sampling strategies and sample frames — targeting the right audience and ensuring statistical validity.' },
              { icon: 'dataset', color: 'primary', t: 'Data Collection', d: 'Survey is fielded by our data collection team using the mode appropriate for the study — web/mobile platforms, CATI call centers, or email and SMS delivery.' },
              { icon: 'analytics', color: 'secondary', t: 'Data Analysis', d: 'We apply a broad range of statistical techniques — SPSS, R, Python — and data visualization tools like Tableau and Power BI, including open text mining.' },
              { icon: 'summarize', color: 'tertiary', t: 'Survey Reports', d: 'We aggregate findings and provide survey reporting tailored to your needs — presenting overall findings, breakouts, multivariate analysis, and methodology documentation.' },
            ].map(({ icon, color, t, d }) => (
              <div key={t} className="ds-card">
                <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center mb-6`}>
                  <span className={`material-symbols-outlined text-${color} text-3xl`}>{icon}</span>
                </div>
                <h3 className="text-lg font-bold mb-3 text-on-surface">{t}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="tm-section bg-surface">
        <div className="tm-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="section-eyebrow">Common Questions</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Survey Research <span className="text-primary">FAQ</span></h2>
              <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">Everything you need to know about planning and executing a survey study with Thought Metrics.</p>
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
      <section className="tm-section bg-surface-container-lowest" id="cta">
        <div className="tm-container">
          <div className="cta-card">
            <div className="cta-content">
              <p className="cta-eyebrow">Get Started Today</p>
              <h2 className="cta-heading">Discover Insights That Drive Smarter Decisions.</h2>
              <p className="cta-body">From quick online surveys to complex multi-modal studies, we design, field, and analyze research that gives you confidence to act.</p>
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

export default ResearchMethodSurveys;
