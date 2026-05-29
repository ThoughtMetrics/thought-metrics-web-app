import React from 'react';

const ResearchMethodFocusGroup: React.FC = () => (
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
            <span className="text-primary font-medium">Focus Group Discussions</span>
          </nav>
          <span className="chip mb-6 inline-flex">FOCUS GROUP DISCUSSIONS</span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.08]">
            Get Inside Your<br />
            <span className="text-primary italic">Customer's Mind.</span>
          </h1>
          <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
            From candid conversations to breakthrough insights — uncover what truly drives decisions with expertly designed and moderated focus groups.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <a href="/start-your-research" className="btn-primary">Request a Bid</a>
            <a href="#services" className="btn-ghost">See What We Offer</a>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[3rem] overflow-hidden bg-surface-container-low border border-outline-variant/10 shadow-2xl p-10 flex flex-col gap-6 min-h-[380px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Session Types</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                <span className="text-xs text-on-surface-variant">In Progress</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container border border-outline-variant/10">
                <div className="flex -space-x-2">
                  {[['A', 'primary'], ['B', 'secondary'], ['C', 'tertiary']].map(([letter, color]) => (
                    <div key={letter} className={`w-8 h-8 rounded-full bg-${color}/30 border-2 border-surface-container flex items-center justify-center text-xs font-bold text-${color}`}>{letter}</div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-surface-container flex items-center justify-center text-xs font-bold text-primary">+5</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-on-surface">Round-Table FGD</div>
                  <div className="text-xs text-on-surface-variant">8 participants · 90 min session</div>
                </div>
                <span className="material-symbols-outlined text-secondary text-base">fiber_manual_record</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container border border-outline-variant/10">
                <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-secondary text-xl">videocam</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-on-surface">Online Focus Group</div>
                  <div className="text-xs text-on-surface-variant">Video-assisted · Real-time streaming</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container border border-outline-variant/10">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">science</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-on-surface">Taste / Product Test</div>
                  <div className="text-xs text-on-surface-variant">Equipped kitchen · CLT facility</div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
            <div className="text-primary text-2xl font-bold mb-0.5">6–8</div>
            <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Avg Group Size</div>
          </div>
          <div className="absolute -bottom-4 -left-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
            <div className="text-secondary text-2xl font-bold mb-0.5">Expert</div>
            <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Moderation Team</div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }} aria-hidden="true">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary/8 blur-[140px] rounded-full" />
      </div>
    </section>

    {/* ── Stats Ribbon ── */}
    <section className="bg-surface-container-lowest py-14 border-y border-outline-variant/5">
      <div className="tm-container flex flex-wrap justify-between gap-10 items-center">
        {[
          { icon: 'groups', color: 'primary', label: 'FGDs & IDIs', sub: 'In-Person and Online' },
          { icon: 'location_on', color: 'secondary', label: 'Pan-India', sub: 'Facility & At-Home Sessions' },
          { icon: 'record_voice_over', color: 'tertiary', label: 'Expert Mods', sub: 'Trained Research Moderators' },
          { icon: 'mic', color: 'primary-container', label: 'AI Transcription', sub: 'Voice Recording & Translation' },
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
            <h2 className="text-4xl md:text-5xl font-bold mb-5">Know What Customers Are <span className="text-secondary">Really Thinking</span></h2>
            <p className="text-lg text-on-surface-variant">Focus groups give you the 'why' behind opinions. Go beyond surface-level feedback and get to the root of what drives consumer choices, behaviors, and brand perceptions.</p>
          </div>
          <a href="/start-your-research" className="btn-ghost flex-shrink-0">Request a Bid</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="ds-card ds-card--wide group relative overflow-hidden md:col-span-2">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-on-surface">Go Beyond Surface-Level Feedback</h3>
                <p className="text-on-surface-variant text-base mb-6 max-w-md">Focus groups allow you to hear the 'why' behind customer opinions. Move past basic surveys and get to the root of what drives consumer choices, behaviors, and brand perceptions — in real conversations.</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="chip">CONSUMER BEHAVIOR</span>
                <span className="chip">BRAND PERCEPTION</span>
                <span className="chip">EMOTIONAL INSIGHTS</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 h-full w-1/4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none flex items-center justify-end pr-8">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '8rem' }}>forum</span>
            </div>
          </div>

          <div className="ds-card">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-secondary text-3xl">tune</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-on-surface">Flexible Formats</h3>
            <p className="text-on-surface-variant mb-5">Whether you're running a round-table discussion, classroom-style setup, or immersive product experience — we design the environment that suits your objectives.</p>
            <ul className="space-y-2">
              {['Music, taste, and app tests', 'Dyads, triads, mini-groups', 'Online or in-facility'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-base">check_circle</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { icon: 'compare_arrows', color: 'tertiary', t: 'Understand Consumer & Competitor Habits', d: 'Gain powerful context by uncovering not just what your audience thinks, but how their perceptions compare with competitors in real-time discussions.' },
            { icon: 'bolt', color: 'primary', t: 'Capture Unfiltered Reactions', d: 'Real-time conversations allow participants to express thoughts naturally — leading to unexpected insights, emotional cues, and spontaneous feedback no survey can replicate.' },
            { icon: 'record_voice_over', color: 'secondary', t: 'Designed & Moderated by Experts', d: 'Our team handles every detail — from participant recruitment to discussion guides and professional moderation — ensuring sessions are strategic, smooth, and insight-rich.' },
          ].map(({ icon, color, t, d }) => (
            <div key={t} className="ds-card">
              <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center mb-6`}>
                <span className={`material-symbols-outlined text-${color} text-3xl`}>{icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-on-surface">{t}</h3>
              <p className="text-on-surface-variant">{d}</p>
            </div>
          ))}
        </div>

        <div className="ds-card flex flex-col md:flex-row gap-8 items-center">
          <div className="w-16 h-16 flex-shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-4xl">zoom_out_map</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2 text-on-surface">Scalable for Projects Big and Small</h3>
            <p className="text-on-surface-variant text-base">From quick feedback loops to in-depth multi-day studies across geographies, our approach scales to meet your timeline, scope, and budget without compromising on insight quality.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
            <span className="chip">SINGLE CITY</span>
            <span className="chip">MULTI-CITY</span>
            <span className="chip">NATIONAL</span>
          </div>
        </div>
      </div>
    </section>

    {/* ── Facilities ── */}
    <section className="tm-section bg-surface-container-lowest">
      <div className="tm-container grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <p className="section-eyebrow">Our Facilities</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What Sets Our<br /><span className="text-primary">Facilities Apart</span>
          </h2>
          <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">
            Making Focus Group Discussions easier — our state-of-the-art facilities are designed to make every session comfortable, insightful, and seamlessly executed.
          </p>
          <a href="/start-your-research" className="btn-primary">Book a Session</a>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {[
            { icon: 'public', t: 'Global Reach', d: 'National and international presence, directly or through trusted partners.' },
            { icon: 'meeting_room', t: 'Versatile Setups', d: 'Living-room style, dyads, triads, one-on-ones, or full conference setups.' },
            { icon: 'wifi', t: 'Participant-Friendly Amenities', d: 'High-speed WiFi, refreshments, and a welcoming atmosphere for comfort.' },
            { icon: 'smart_toy', t: 'Advanced Tech Support', d: 'AI-based voice recording, transcription, translation, and coding for faster analysis.' },
            { icon: 'videocam', t: 'Custom Recording Options', d: 'Fixed stationary cameras with optional operators for enhanced control and coverage.' },
            { icon: 'kitchen', t: 'Fully Equipped Kitchens', d: 'Ideal for product preparation, taste testing, and storage during consumer evaluations.' },
            { icon: 'support_agent', t: 'On-Site Support Staff', d: 'Our team guides respondents smoothly through every stage of the study.' },
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
        </div>
      </div>
    </section>

    {/* ── CTA ── */}
    <section className="tm-section bg-surface" id="cta">
      <div className="tm-container">
        <div className="cta-card">
          <div className="cta-content">
            <p className="cta-eyebrow">Get Started Today</p>
            <h2 className="cta-heading">Get Real Insights, Face-to-Face.</h2>
            <p className="cta-body">Run powerful focus groups with the right participants. Our expert team handles recruitment, moderation, recording, and reporting — all in one place.</p>
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

export default ResearchMethodFocusGroup;
