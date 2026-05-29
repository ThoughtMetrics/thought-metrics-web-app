import React, { useState } from 'react';

const CapabilitiesBrandingAdvertisingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggle = (i: number) => setOpenFaq(openFaq === i ? null : i);

  const faqs = [
    { q: 'What makes advertising truly memorable?', a: 'Emotional relevance, clear brand linkage, and message distinctiveness are the top three predictors of ad recall. We measure all three pre-launch and track them post-campaign to understand what\'s working — and what isn\'t.' },
    { q: 'How do we know if our brand health is improving?', a: 'Brand health is tracked across awareness, consideration, preference, and loyalty metrics over time. We establish a baseline and run consistent wave studies so you can measure real movement — not noise.' },
    { q: 'Which creative route should we invest in?', a: 'Pre-testing creative routes with your target audience before production spend is the most reliable way to choose. We use diagnostic metrics — communication clarity, relevance, persuasion, and brand fit — to rank routes objectively.' },
    { q: 'How do we measure the ROI of brand advertising?', a: 'We combine brand lift studies (pre/post awareness, consideration, purchase intent shifts) with media attribution data to estimate the contribution of brand advertising to business outcomes over time.' },
    { q: 'What does our audience actually think about our brand?', a: 'Brand perception research surfaces both stated and revealed attitudes — what consumers say and the associations they form. We use laddering, projective techniques, and quantitative brand tracking to give you the complete picture.' },
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
              <span className="text-primary font-medium">Branding &amp; Advertising</span>
            </nav>
            <span className="chip mb-6 inline-flex">BRANDING &amp; ADVERTISING</span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.08]">
              Know What Works.<br /><span className="text-primary italic">And Why.</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
              Brand and advertising research that reveals the story behind the stats. Measure what moves your audience — before and after every campaign.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <a href="/start-your-research" className="btn-primary">Request a Bid</a>
              <a href="#services" className="btn-ghost">See What We Offer</a>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-[3rem] bg-surface-container-low border border-outline-variant/10 shadow-2xl p-8 flex flex-col gap-4 min-h-[360px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Brand Health Monitor</span>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div><span className="text-xs text-on-surface-variant">Tracking</span></div>
              </div>
              <div className="space-y-3">
                {[{label:'Brand Awareness', pct:74, color:'primary'},{label:'Ad Recall',pct:61,color:'secondary'},{label:'Purchase Intent',pct:48,color:'tertiary'},{label:'Brand Loyalty',pct:55,color:'primary'}].map(({label,pct,color})=>(
                  <div key={label} className="bg-surface-container rounded-xl p-3">
                    <div className="flex justify-between mb-2"><span className="text-xs font-semibold text-on-surface">{label}</span><span className={`text-xs font-bold text-${color}`}>{pct}%</span></div>
                    <div className="h-2 bg-outline-variant/20 rounded-full"><div className={`h-full bg-${color} rounded-full`} style={{width:`${pct}%`}}></div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
              <div className="text-primary text-2xl font-bold mb-0.5">Pre &amp; Post</div>
              <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Campaign Testing</div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
              <div className="text-secondary text-2xl font-bold mb-0.5">Wave</div>
              <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Brand Tracking</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{zIndex:-1}} aria-hidden="true">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/8 blur-[140px] rounded-full" />
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="bg-surface-container-lowest py-14 border-y border-outline-variant/5">
        <div className="tm-container flex flex-wrap justify-between gap-10 items-center">
          {[{icon:'rate_review',color:'primary',label:'Ad Testing',sub:'Pre-Launch Creative Validation'},{icon:'show_chart',color:'secondary',label:'Brand Tracking',sub:'Equity & Awareness Waves'},{icon:'record_voice_over',color:'tertiary',label:'Message Testing',sub:'Communication & Tone Research'},{icon:'visibility',color:'primary-container',label:'Perception Studies',sub:'Brand Image & Association'}].map(({icon,color,label,sub})=>(
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
              <p className="section-eyebrow">How We Help</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-5">Research That Makes Your Brand <span className="text-secondary">Work Harder</span></h2>
              <p className="text-lg text-on-surface-variant">From brand strategy to campaign execution, every major brand investment deserves evidence — before and after it runs.</p>
            </div>
            <a href="/start-your-research" className="btn-ghost flex-shrink-0">Get a Quote</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {icon:'campaign',color:'primary',t:'Brand Awareness & Tracking',c:['AWARENESS SURVEYS','WAVE STUDIES'],d:'Measure unaided and aided brand awareness over time. Track how your brand compares to competitors on key metrics — and understand what\'s driving the shifts you see in market.'},
              {icon:'rate_review',color:'secondary',t:'Creative Testing & Ad Diagnostics',c:['PRE-TESTING','AD RECALL'],d:'Test creative routes before production. Diagnose what works — and what doesn\'t — in your advertising. Measure recall, relevance, persuasion, and brand linkage with your target audience.'},
              {icon:'insights',color:'tertiary',t:'Brand Perception & Positioning',c:['PERCEPTION MAPPING','BRAND EQUITY'],d:'Understand how your brand is perceived vs. how you want it to be perceived. Map brand associations, uncover positioning gaps, and identify the attributes that drive preference.'},
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

      {/* Benefits */}
      <section className="tm-section bg-surface-container-lowest">
        <div className="tm-container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="section-eyebrow">Why Brand Research Matters</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-5">The Evidence Case for <span className="text-primary">Investing in Brand</span></h2>
            <p className="text-lg text-on-surface-variant">Brands that invest in research make better creative decisions, waste less media budget, and build equity that compounds over time.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {icon:'lightbulb',color:'primary',t:'Data-Driven Decision Making',d:'Replace gut feel with evidence. Know which creative works, which message resonates, and which media channels earn the most brand attention — before you spend.'},
              {icon:'trending_up',color:'secondary',t:'Enhanced Campaign ROI',d:'Stop wasting budget on advertising that doesn\'t land. Pre-testing eliminates weak creative routes before production spend and post-campaign measurement improves the next wave.'},
              {icon:'favorite',color:'tertiary',t:'Customer-Centric Approach',d:'Build brands around what your customers actually value — not what you assume they value. Customer-centric brands consistently outperform product-centric ones over time.'},
              {icon:'shield',color:'primary',t:'Competitive Edge',d:'Know your competitive position — and how it\'s shifting. Brand tracking gives you early warning of competitive threats and helps you identify white spaces before competitors do.'},
              {icon:'loyalty',color:'secondary',t:'Enhanced Brand Loyalty',d:'Understand the drivers of loyalty in your category. Build communication strategies that reinforce the attributes most strongly associated with repeat purchase and advocacy.'},
              {icon:'grid_view',color:'tertiary',t:'Holistic Campaign Management',d:'See the full picture — awareness to loyalty. Measure how each campaign element contributes to brand equity at every stage of the funnel and optimize in real time.'},
            ].map(({icon,color,t,d})=>(
              <div key={t} className="ds-card">
                <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center mb-6`}><span className={`material-symbols-outlined text-${color} text-3xl`}>{icon}</span></div>
                <h3 className="text-lg font-bold mb-3 text-on-surface">{t}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="tm-section bg-surface">
        <div className="tm-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="section-eyebrow">How We Measure Advertising Effectiveness</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Research That Answers the <span className="text-primary">Hardest Brand Questions</span></h2>
              <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">Brand investments often have long payback periods and diffuse effects — which makes rigorous measurement both harder and more important. These are the questions we're built to answer.</p>
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
      <section className="tm-section bg-surface-container-lowest" id="cta">
        <div className="tm-container">
          <div className="cta-card">
            <div className="cta-content">
              <p className="cta-eyebrow">Get Started Today</p>
              <h2 className="cta-heading">Know What Your Brand Stands For — Before Your Competitors Define It.</h2>
              <p className="cta-body">From brand tracking to ad pre-testing, our branding and advertising research gives you the clarity to build campaigns that connect and brands that endure.</p>
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

export default CapabilitiesBrandingAdvertisingPage;
