import React, { useState } from 'react';

interface BlogItem { id: number; type: string; category: string; label: string; description: string; link: string; src: string; }
interface Props { blogData?: { title: string; items: BlogItem[] } | null; }

const ResearchMethodQualitativeResearch: React.FC<Props> = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggle = (i: number) => setOpenFaq(openFaq === i ? null : i);

  const faqs = [
    { q: 'How many participants do I need?', a: 'It depends on objectives and the number of segments. For IDIs: 8–12 per segment is typically sufficient. For FGDs: 2–3 groups per segment. Qualitative reaches saturation when no new themes emerge — usually within these ranges for most consumer studies.' },
    { q: 'Where do you conduct in-person research?', a: 'We conduct fieldwork across major Indian cities including Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata, Pune, and Ahmedabad. We can also conduct in-home visits and shop-alongs in tier 2/3 cities through our fieldwork network.' },
    { q: 'Do you provide moderation or just recruitment?', a: 'Both. We offer full-service qualitative — from recruitment and screener design to moderation, observation, transcription, and insight analysis. We can also provide recruitment-only services for researchers who bring their own moderators.' },
    { q: 'How do you handle B2B or specialist recruitment?', a: 'We have a dedicated B2B recruitment capability with access to professionals across industries — from C-suite executives to SME owners, IT decision-makers, and industry specialists. Timelines are typically 7–14 days for specialist recruitment.' },
    { q: 'Can I observe sessions remotely?', a: 'Yes. All online sessions are viewable live by clients with a private observer link. For in-person sessions, backroom viewing is standard. We also provide session recordings and professional transcripts for all qualitative studies.' },
  ];

  const services = [
    { icon: 'record_voice_over', color: 'primary', title: 'In-Depth Interviews (IDIs)', chips: ['IN-PERSON', 'ONLINE VIDEO'], desc: 'One-on-one conversations that reveal individual motivations, decision journeys, and unarticulated needs. In-person, telephonic, or video — with expert moderators who know how to probe without leading.' },
    { icon: 'groups', color: 'secondary', title: 'Focus Group Discussions', chips: ['MINI GROUPS', 'ONLINE FGD'], desc: 'Moderated group discussions that surface social consensus, collective attitudes, and the language consumers use. Mini groups, triads, and full FGDs — in our facilities or client venues.' },
    { icon: 'home_pin', color: 'tertiary', title: 'Ethnography & In-Home Visits', chips: ['IN-HOME', 'SHOP-ALONG'], desc: 'Observe real behavior in its natural context. In-home visits, shop-alongs, and contextual inquiry reveal how people actually behave — not just how they think they behave.' },
    { icon: 'phone_android', color: 'primary', title: 'Mobile & Diary Research', chips: ['MOBILE DIARY', 'LONGITUDINAL'], desc: 'Capture consumer experiences as they happen with mobile diaries, photo journals, and longitudinal in-the-moment studies. Ideal for tracking usage occasions, purchase triggers, and habit formation.' },
    { icon: 'forum', color: 'secondary', title: 'Online Communities & Bulletin Boards', chips: ['MROC', 'BULLETIN BOARD'], desc: 'Engage participants over multiple days in an asynchronous online environment. Ideal for exploration, co-creation, and gathering richer reflective responses than a single session allows.' },
    { icon: 'manage_search', color: 'tertiary', title: 'Expert & Stakeholder Interviews', chips: ['B2B QUAL', 'KOL INTERVIEWS'], desc: 'Access industry experts, C-suite stakeholders, category specialists, and key opinion leaders. Structured or semi-structured interviews that capture expert perspective and market intelligence.' },
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
              <span className="text-primary font-medium">Qualitative Research</span>
            </nav>
            <span className="chip mb-6 inline-flex">QUALITATIVE RESEARCH</span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.08]">
              Go Beyond the Numbers.<br />
              <span className="text-primary italic">Understand the Why.</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
              Uncover deep insights on your target audiences with qualitative services you can trust. Expert recruitment, skilled moderation, and insightful analysis that reveals the emotions and motivations behind consumer behavior.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <a href="/start-your-research" className="btn-primary">Request a Bid</a>
              <a href="#services" className="btn-ghost">Explore Services</a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[3rem] bg-surface-container-low border border-outline-variant/10 shadow-2xl p-8 flex flex-col gap-4 min-h-[360px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Insights Depth Map</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                  <span className="text-xs text-on-surface-variant">Active</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary text-xl">visibility</span>
                    <div className="text-sm font-bold text-on-surface">Surface Layer — What</div>
                  </div>
                  <p className="text-xs text-on-surface-variant">Observable behavior, stated preferences, reported actions</p>
                </div>
                <div className="bg-secondary/10 rounded-xl p-4 border border-secondary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-secondary text-xl">psychology</span>
                    <div className="text-sm font-bold text-on-surface">Behavioral Layer — How</div>
                  </div>
                  <p className="text-xs text-on-surface-variant">Decision processes, usage patterns, contextual influences</p>
                </div>
                <div className="bg-tertiary/10 rounded-xl p-4 border border-tertiary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-tertiary text-xl">favorite</span>
                    <div className="text-sm font-bold text-on-surface">Motivational Layer — Why</div>
                  </div>
                  <p className="text-xs text-on-surface-variant">Emotions, values, latent needs, subconscious drivers</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
              <div className="text-primary text-2xl font-bold mb-0.5">IDIs</div>
              <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">In-Depth Interviews</div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
              <div className="text-secondary text-2xl font-bold mb-0.5">Rich</div>
              <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Ethnographic Data</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }} aria-hidden="true">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/8 blur-[140px] rounded-full" />
        </div>
      </section>

      {/* ── Stats Ribbon ── */}
      <section className="bg-surface-container-lowest py-14 border-y border-outline-variant/5">
        <div className="tm-container flex flex-wrap justify-between gap-10 items-center">
          {[
            { icon: 'record_voice_over', color: 'primary', label: 'In-Depth Interviews', sub: 'One-on-One Depth & Nuance' },
            { icon: 'groups', color: 'secondary', label: 'Focus Groups', sub: 'Group Dynamics & Consensus' },
            { icon: 'home_pin', color: 'tertiary', label: 'Ethnography', sub: 'In-Context Observation' },
            { icon: 'videocam', color: 'primary-container', label: 'Online Qual', sub: 'Digital & Remote Methods' },
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
              <h2 className="text-4xl md:text-5xl font-bold mb-5">Qualitative Research That Gets to <span className="text-secondary">the Real Story</span></h2>
              <p className="text-lg text-on-surface-variant">Numbers tell you what is happening. Qualitative research tells you why — and why that matters for your decisions.</p>
            </div>
            <a href="/start-your-research" className="btn-ghost flex-shrink-0">Get a Quote</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon, color, title, chips, desc }) => (
              <div key={title} className="ds-card group relative overflow-hidden">
                <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center mb-6`}>
                  <span className={`material-symbols-outlined text-${color} text-3xl`}>{icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-on-surface">{title}</h3>
                <p className="text-on-surface-variant text-base mb-6">{desc}</p>
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
              <p className="section-eyebrow">When to Use Qualitative</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Insight That No Survey Can <span className="text-primary">Capture</span></h2>
              <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">Qualitative research is the right choice when you need to explore, understand, or generate hypotheses — especially when you don't yet know the right questions to ask at scale.</p>
              <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-secondary text-xl">lightbulb</span>
                  <span className="font-semibold text-on-surface">Best For</span>
                </div>
                <ul className="space-y-2">
                  {['Exploring a new category or audience', 'Diagnosing a problem before quantifying it', 'Understanding emotional and latent motivations', 'Co-creating or refining concepts pre-survey'].map(item => (
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
              <h2 className="cta-heading">Understand What's Really Driving Your Customers.</h2>
              <p className="cta-body">From IDIs and focus groups to ethnography and online communities, our qualitative research reveals the deep human truths that surveys can't capture — and turns them into strategic insight.</p>
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

export default ResearchMethodQualitativeResearch;
