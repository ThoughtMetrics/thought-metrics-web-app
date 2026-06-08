import React, { useState } from 'react';

const CapabilitiesMarketOpportunityPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggle = (i: number) => setOpenFaq(openFaq === i ? null : i);

  const faqs = [
    { q: 'How do we size a market we\'re entering for the first time?', a: 'We combine primary consumer research (intent surveys, willingness-to-pay studies) with behavioral segmentation to produce a bottom-up TAM estimate grounded in real consumer data — not just secondary desk research extrapolations.' },
    { q: 'How do we identify genuine white spaces vs. crowded categories?', a: 'Competitive mapping, unmet needs analysis, and share-of-preference research reveal where demand exists but supply is inadequate. We identify white spaces through consumer frustration and unmet desire — not competitor gap analysis alone.' },
    { q: 'What does a strong go-to-market strategy need in terms of research?', a: 'GTM research typically covers: audience segmentation and prioritization, value proposition testing, pricing strategy, channel preference, and message resonance. We design custom GTM research programmes built around your specific market entry context.' },
    { q: 'How do we know if a new market is ready for our product?', a: 'Market readiness research measures awareness of the problem category, current solution usage, willingness to switch, and adoption intent. We also track leading indicators like search behavior proxies and early adopter profiling.' },
    { q: 'How do we track competitive position over time?', a: 'We build competitive intelligence trackers that monitor brand awareness and consideration vs. named competitors, share of preference shifts, and perception of key differentiators across waves — giving you a real-time competitive dashboard.' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="tm-section relative">
        <div className="tm-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <nav className="flex items-center gap-2 mb-6 text-xs text-on-surface-variant" aria-label="Breadcrumb">
              <a href="/" className="hover:text-on-surface transition-colors">Home</a>
              <span className="opacity-40">/</span>
              <a href="/capabilities" className="opacity-60 hover:text-on-surface transition-colors">Capabilities</a>
              <span className="opacity-40">/</span>
              <span className="text-primary font-medium">Market Opportunity</span>
            </nav>
            <span className="chip mb-6 inline-flex">MARKET OPPORTUNITY RESEARCH</span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.08]">
              Find Your White Space.<br /><span className="text-primary italic">Move First.</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
              Identify genuine market opportunities, size real addressable markets, and map the competitive landscape with primary consumer intelligence — before you commit resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <a href="/start-your-research" className="btn-primary">Request a Bid</a>
              <a href="#services" className="btn-ghost">Explore Services</a>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-[3rem] bg-surface-container-low border border-outline-variant/10 shadow-2xl p-8 flex flex-col gap-4 min-h-[360px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Market Landscape</span>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div><span className="text-xs text-on-surface-variant">Live</span></div>
              </div>
              <div className="space-y-3">
                {[{label:'Market Awareness',pct:42,color:'primary',note:'Category penetration'},{label:'Intent to Switch',pct:28,color:'secondary',note:'From competitors'},{label:'White Space Score',pct:71,color:'tertiary',note:'Unmet need index'},{label:'WTP at Price Point',pct:65,color:'primary',note:'Willingness to pay'}].map(({label,pct,color,note})=>(
                  <div key={label} className="bg-surface-container rounded-xl p-3">
                    <div className="flex justify-between mb-1"><span className="text-xs font-semibold text-on-surface">{label}</span><span className={`text-xs font-bold text-${color}`}>{pct}%</span></div>
                    <div className="h-1.5 bg-outline-variant/20 rounded-full mb-1"><div className={`h-full bg-${color} rounded-full`} style={{width:`${pct}%`}}></div></div>
                    <span className="text-[10px] text-on-surface-variant">{note}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
              <div className="text-primary text-2xl font-bold mb-0.5">TAM</div>
              <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Sizing Research</div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
              <div className="text-secondary text-2xl font-bold mb-0.5">GTM</div>
              <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Strategy Validation</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{zIndex:-1}} aria-hidden="true">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary/8 blur-[140px] rounded-full" />
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="bg-surface-container-lowest py-14 border-y border-outline-variant/5">
        <div className="tm-container flex flex-wrap justify-between gap-10 items-center">
          {[{icon:'radar',color:'primary',label:'Competitive Intel',sub:'Category Dynamics & White Space'},{icon:'rocket_launch',color:'secondary',label:'GTM Strategy',sub:'Entry Timing & Channel Research'},{icon:'flag',color:'tertiary',label:'Market Entry',sub:'Opportunity Sizing & Validation'},{icon:'space_dashboard',color:'primary-container',label:'Gap Analysis',sub:'Unmet Needs Identification'}].map(({icon,color,label,sub})=>(
            <div key={label} className="flex items-center gap-4">
              <span className={`material-symbols-outlined text-4xl text-${color}`}>{icon}</span>
              <div><div className="text-2xl font-bold text-on-surface">{label}</div><div className="text-on-surface-variant text-sm">{sub}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="tm-section bg-surface" id="services">
        <div className="tm-container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <div className="max-w-2xl">
              <p className="section-eyebrow">Our Services</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-5">Intelligence That Reduces <span className="text-secondary">Strategic Risk</span></h2>
              <p className="text-lg text-on-surface-variant">Before committing resources to a new market, category, or growth strategy, test the assumptions — with primary consumer and competitive research.</p>
            </div>
            <a href="/start-your-research" className="btn-ghost flex-shrink-0">Get a Quote</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {icon:'radar',color:'primary',t:'Competitive Intelligence',c:['SWOT RESEARCH','POSITIONING MAP'],d:'Map your competitive landscape with primary consumer data — not just secondary reports. Understand how competitors are perceived, where they\'re gaining, and where they\'re vulnerable.'},
              {icon:'map',color:'secondary',t:'Market Sizing & TAM Analysis',c:['TAM ESTIMATION','WTP STUDIES'],d:'Build credible bottom-up market size estimates using real consumer intent data, adoption curves, and segmented willingness-to-pay research. Quantify the opportunity before you enter.'},
              {icon:'flag',color:'tertiary',t:'GTM Strategy & Entry Research',c:['CHANNEL TESTING','SEGMENT PRIORITY'],d:'Validate your go-to-market assumptions before launch. Test value propositions, prioritize segments, and identify the channel mix that most efficiently reaches your beachhead market.'},
            ].map(({icon,color,t,c,d})=>(
              <div key={t} className="ds-card">
                <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center mb-6`}><span className={`material-symbols-outlined text-${color} text-3xl`}>{icon}</span></div>
                <h3 className="text-xl font-bold mb-3 text-on-surface">{t}</h3>
                <p className="text-on-surface-variant mb-5">{d}</p>
                <div className="flex items-center gap-3 flex-wrap">{c.map(chip=><span key={chip} className="chip">{chip}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="tm-section bg-surface-container-lowest">
        <div className="tm-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="section-eyebrow">Common Research Questions</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Answer the Questions That <span className="text-primary">Shape Your Strategy</span></h2>
              <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">Market opportunity research answers the strategic questions that determine whether a new initiative succeeds or fails — before capital is committed.</p>
              <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-4"><span className="material-symbols-outlined text-secondary text-xl">lightbulb</span><span className="font-semibold text-on-surface">Research Types We Run</span></div>
                <ul className="space-y-2">
                  {['SWOT & competitive landscape analysis','Go-to-market strategy validation','Market entry timing & readiness research','Scenario planning & opportunity sizing'].map(item=>(
                    <li key={item} className="flex items-center gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-primary text-base">arrow_right</span>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              {faqs.map((faq,i)=>(
                <div key={i} className={`faq-card ${openFaq===i?'open':''}`}>
                  <button className="w-full flex items-center justify-between gap-3 px-6 py-5 text-left cursor-pointer bg-transparent border-0" style={{font:'inherit'}} aria-expanded={openFaq===i} onClick={()=>toggle(i)}>
                    <span className="text-sm font-semibold text-on-surface">{faq.q}</span>
                    <span className="material-symbols-outlined flex-shrink-0 text-on-surface-variant text-xl">{openFaq===i?'remove':'add'}</span>
                  </button>
                  <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq===i?'max-h-60 pb-5':'max-h-0'}`}>
                    <p className="text-sm text-on-surface-variant pt-3 border-t border-outline-variant/20">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="tm-section bg-surface" id="cta">
        <div className="tm-container">
          <div className="cta-card">
            <div className="cta-content">
              <p className="cta-eyebrow">Get Started Today</p>
              <h2 className="cta-heading">Enter New Markets With Evidence, Not Assumptions.</h2>
              <p className="cta-body">From competitive mapping to GTM validation, our market opportunity research ensures your strategic bets are grounded in real consumer and competitive intelligence.</p>
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

export default CapabilitiesMarketOpportunityPage;
