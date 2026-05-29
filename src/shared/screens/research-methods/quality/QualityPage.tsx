import React from 'react';

const ResearchMethodQuality: React.FC = () => (
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
            <span className="text-primary font-medium">Participant Quality</span>
          </nav>
          <span className="chip mb-6 inline-flex">PARTICIPANT QUALITY &amp; DATA SECURITY</span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.08]">
            Every Response Earned.<br />
            <span className="text-primary italic">Every Data Point Trusted.</span>
          </h1>
          <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
            We don't just identify potential participants — we rigorously verify they're the right fit for your project. Multi-layered fraud detection, compliance protocols, and continuous quality monitoring ensure your data is reliable from the first response to the last.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <a href="/start-your-research" className="btn-primary">Request a Bid</a>
            <a href="#quality-layers" className="btn-ghost">Our Quality Process</a>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[3rem] bg-surface-container-low border border-outline-variant/10 shadow-2xl p-8 flex flex-col gap-3 min-h-[360px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Quality Shield</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                <span className="text-xs text-on-surface-variant">Always Active</span>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { icon: 'verified_user', color: 'primary', border: 'border-primary', t: 'Layer 1: Identity Verification', d: 'Phone, email, and profile validation at registration' },
                { icon: 'gpp_maybe', color: 'secondary', border: 'border-secondary', t: 'Layer 2: Fraud Detection', d: 'Duplicate IP, device fingerprinting, speeders removal' },
                { icon: 'psychology', color: 'tertiary', border: 'border-tertiary', t: 'Layer 3: Attention Checks', d: 'Embedded trap questions and consistency checks' },
                { icon: 'rule', color: 'primary', border: 'border-primary', t: 'Layer 4: Data Validation', d: 'Logic checks, outlier removal, open-end review' },
                { icon: 'gpp_good', color: 'secondary', border: 'border-secondary', t: 'Layer 5: Compliance Review', d: 'DPDP Act, GDPR standards, consent management' },
              ].map(({ icon, color, border, t, d }) => (
                <div key={t} className={`bg-surface-container rounded-xl p-3 flex items-center gap-3 border-l-2 ${border}`}>
                  <span className={`material-symbols-outlined text-${color} text-xl`}>{icon}</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-on-surface">{t}</div>
                    <div className="text-[10px] text-on-surface-variant">{d}</div>
                  </div>
                  <span className={`material-symbols-outlined text-${color} text-base`}>check_circle</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -top-4 -right-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
            <div className="text-primary text-2xl font-bold mb-0.5">5 Layers</div>
            <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Quality Control</div>
          </div>
          <div className="absolute -bottom-4 -left-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
            <div className="text-secondary text-2xl font-bold mb-0.5">GDPR</div>
            <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Compliant Framework</div>
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
          { icon: 'verified_user', color: 'primary', label: 'Identity Verified', sub: 'Every Panelist, Every Study' },
          { icon: 'shield', color: 'secondary', label: 'Fraud Detection', sub: 'AI-Powered & Human Review' },
          { icon: 'gpp_good', color: 'tertiary', label: 'Compliance Ready', sub: 'DPDP, GDPR, ISO Standards' },
          { icon: 'fact_check', color: 'primary-container', label: '100% Reviewed', sub: 'Clean Data Delivered' },
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

    {/* ── Quality Framework ── */}
    <section className="tm-section bg-surface" id="quality-layers">
      <div className="tm-container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
          <div className="max-w-2xl">
            <p className="section-eyebrow">Our Quality Framework</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-5">Rigorous Standards That <span className="text-secondary">Protect Your Research</span></h2>
            <p className="text-lg text-on-surface-variant">Good research decisions start with clean data. Our quality protocols operate at every stage — from panel enrollment to final data delivery.</p>
          </div>
          <a href="/start-your-research" className="btn-ghost flex-shrink-0">Get a Quote</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: 'how_to_reg', color: 'primary', t: 'Panel Enrollment & Verification', chips: ['OTP VERIFIED', 'PROFILE AUDIT'], d: 'Every panelist is verified at the point of registration — phone number, email address, and profile completeness. Our profiling system continuously validates demographic claims against behavioral patterns.' },
            { icon: 'fingerprint', color: 'secondary', t: 'Fraud & Duplicate Detection', chips: ['IP DEDUPLICATION', 'DEVICE CHECK'], d: 'Real-time checks during survey completion detect duplicate IPs, device fingerprinting, VPN use, bot activity, and abnormal response patterns — automatically flagging or excluding suspicious entries.' },
            { icon: 'timer', color: 'tertiary', t: 'Speeder & Straightliner Removal', chips: ['COMPLETION TIME', 'VARIANCE CHECK'], d: 'Respondents who complete surveys too quickly or select the same answer repeatedly are automatically flagged and removed before data delivery — protecting the integrity of every wave.' },
            { icon: 'quiz', color: 'primary', t: 'Attention & Red Herring Questions', chips: ['TRAP QUESTIONS', 'CONSISTENCY'], d: 'Embedded attention checks, instructional manipulation checks, and consistency questions are woven into surveys to identify inattentive respondents without disrupting the study flow.' },
            { icon: 'spellcheck', color: 'secondary', t: 'Open-End Response Review', chips: ['VERBATIM REVIEW', 'QUALITY FLAG'], d: 'Verbatim open-end responses are reviewed by our quality team for gibberish, copy-paste repetition, and off-topic answers. Clean, meaningful verbatims are retained for analysis.' },
            { icon: 'policy', color: 'tertiary', t: 'Data Privacy & Compliance', chips: ['DPDP 2023', 'GDPR ALIGNED'], d: "All data collection follows India's DPDP Act 2023, GDPR principles for international clients, and MRS/ESOMAR codes. Consent management, data minimization, and secure storage are standard on every project." },
          ].map(({ icon, color, t, chips, d }) => (
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

    {/* ── CTA ── */}
    <section className="tm-section bg-surface-container-lowest" id="cta">
      <div className="tm-container">
        <div className="cta-card">
          <div className="cta-content">
            <p className="cta-eyebrow">Get Started Today</p>
            <h2 className="cta-heading">Research You Can Trust Starts With Data You Can Trust.</h2>
            <p className="cta-body">Every ThoughtMetrics project comes with our full quality framework built in — no add-on fees, no shortcuts. Because insights are only valuable when you can act on them with confidence.</p>
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

export default ResearchMethodQuality;
