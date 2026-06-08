import React, { useState } from 'react';

const CapabilitiesCustomerResearchPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggle = (i: number) => setOpenFaq(openFaq === i ? null : i);

  const faqs = [
    { q: 'How do we find out why customers are churning?', a: 'Exit interviews, churn-trigger surveys, and longitudinal cohort analysis reveal the moments, messaging, product gaps, or service failures that drive customers away. We combine quantitative measurement with qualitative depth to give you both the "how many" and the "why".' },
    { q: 'How do we build accurate customer personas?', a: 'Personas built on real behavioral data and primary research are far more useful than desk-research assumptions. We use segmentation surveys, qualitative depth interviews, and cluster analysis to build personas grounded in how real customers actually think, feel, and behave.' },
    { q: 'How do we understand the full customer journey?', a: 'Customer journey research maps every touchpoint from first awareness through advocacy — identifying moments of friction, delight, and decision. We use diary research, ethnographic methods, and journey mapping workshops to create a complete picture.' },
    { q: 'How do we know if our pricing is optimal?', a: 'Pricing research (Van Westendorp, Gabor-Granger, conjoint analysis) reveals willingness-to-pay across segments, the psychological price thresholds in your market, and the price elasticity of your specific value proposition — giving you confidence to price for value, not just cost.' },
    { q: 'How do we identify what truly drives customer loyalty?', a: 'Loyalty driver analysis uses regression and MaxDiff techniques to identify which product attributes, service elements, and brand qualities most strongly predict repeat purchase and advocacy — so you can invest in the right things to build a genuinely loyal customer base.' },
  ];

  return (
    <>
      <section className="tm-section relative">
        <div className="tm-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <nav className="flex items-center gap-2 mb-6 text-xs text-on-surface-variant" aria-label="Breadcrumb">
              <a href="/" className="hover:text-on-surface transition-colors">Home</a>
              <span className="opacity-40">/</span>
              <a href="/capabilities" className="opacity-60 hover:text-on-surface transition-colors">Capabilities</a>
              <span className="opacity-40">/</span>
              <span className="text-primary font-medium">Customer Research</span>
            </nav>
            <span className="chip mb-6 inline-flex">CUSTOMER RESEARCH &amp; SEGMENTATION</span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.08]">
              Know Your Customer.<br /><span className="text-primary italic">Deeply.</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
              Understand who your customers are, how they decide, and what keeps them loyal. Journey mapping, persona research, and pricing studies that build real customer clarity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <a href="/start-your-research" className="btn-primary">Request a Bid</a>
              <a href="#services" className="btn-ghost">Explore Services</a>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-[3rem] bg-surface-container-low border border-outline-variant/10 shadow-2xl p-8 flex flex-col gap-4 min-h-[360px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Customer Journey Map</span>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div><span className="text-xs text-on-surface-variant">Mapping</span></div>
              </div>
              <div className="flex flex-col gap-2">
                {[{stage:'Awareness',icon:'visibility',color:'primary',score:92},{stage:'Consideration',icon:'search',color:'secondary',score:74},{stage:'Purchase',icon:'shopping_cart',color:'tertiary',score:61},{stage:'Retention',icon:'loyalty',color:'primary',score:48},{stage:'Advocacy',icon:'recommend',color:'secondary',score:35}].map(({stage,icon,color,score})=>(
                  <div key={stage} className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-${color} text-lg w-6`}>{icon}</span>
                    <span className="text-xs font-semibold text-on-surface w-24">{stage}</span>
                    <div className="flex-1 h-2 bg-outline-variant/20 rounded-full"><div className={`h-full bg-${color} rounded-full transition-all`} style={{width:`${score}%`}}></div></div>
                    <span className={`text-xs font-bold text-${color} w-8 text-right`}>{score}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
              <div className="text-primary text-2xl font-bold mb-0.5">Journey</div>
              <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Mapping Research</div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
              <div className="text-secondary text-2xl font-bold mb-0.5">Loyalty</div>
              <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Driver Analysis</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{zIndex:-1}} aria-hidden="true">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/8 blur-[140px] rounded-full" />
        </div>
      </section>

      <section className="bg-surface-container-lowest py-14 border-y border-outline-variant/5">
        <div className="tm-container flex flex-wrap justify-between gap-10 items-center">
          {[{icon:'route',color:'primary',label:'Journey Mapping',sub:'Full Lifecycle Customer Research'},{icon:'loyalty',color:'secondary',label:'Loyalty Research',sub:'Retention & Advocacy Drivers'},{icon:'person_search',color:'tertiary',label:'Persona Research',sub:'Behavioral Segmentation'},{icon:'price_check',color:'primary-container',label:'Pricing Research',sub:'WTP & Price Elasticity'}].map(({icon,color,label,sub})=>(
            <div key={label} className="flex items-center gap-4">
              <span className={`material-symbols-outlined text-4xl text-${color}`}>{icon}</span>
              <div><div className="text-2xl font-bold text-on-surface">{label}</div><div className="text-on-surface-variant text-sm">{sub}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section className="tm-section bg-surface" id="services">
        <div className="tm-container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <div className="max-w-2xl">
              <p className="section-eyebrow">Our Services</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-5">Research That Gets to the <span className="text-secondary">Heart of the Customer</span></h2>
              <p className="text-lg text-on-surface-variant">The most successful businesses understand their customers better than their competitors do. We help you build that understanding systematically.</p>
            </div>
            <a href="/start-your-research" className="btn-ghost flex-shrink-0">Get a Quote</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {icon:'route',color:'primary',t:'Customer Journey Research',c:['JOURNEY MAPPING','TOUCHPOINT AUDIT'],d:'Map the complete customer experience from first awareness to advocacy. Identify moments of friction, delight, and decision — across channels, over time, and for different customer segments.'},
              {icon:'loyalty',color:'secondary',t:'Loyalty & Churn Research',c:['CHURN DRIVERS','NPS DEEP DIVE'],d:'Understand what keeps customers — and what loses them. Loyalty driver analysis, churn triggers, and NPS deep dives reveal the actionable levers that increase lifetime value.'},
              {icon:'price_check',color:'tertiary',t:'Pricing & Value Perception Research',c:['VAN WESTENDORP','CONJOINT'],d:'Set prices with confidence. Willingness-to-pay studies, value perception mapping, and conjoint analysis reveal the pricing sweet spot — and how your value proposition compares to alternatives.'},
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

      <section className="tm-section bg-surface-container-lowest">
        <div className="tm-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="section-eyebrow">Customer Research Questions</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">The Questions That Build <span className="text-primary">Customer Clarity</span></h2>
              <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">Understanding your customer isn't a one-time project — it's an ongoing capability. These are the research questions that compound into real customer intelligence over time.</p>
              <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-4"><span className="material-symbols-outlined text-secondary text-xl">person_search</span><span className="font-semibold text-on-surface">Research Services</span></div>
                <ul className="space-y-2">
                  {['Customer journey & experience mapping','Loyalty driver & churn analysis','Persona development & segmentation','Pricing research & value perception'].map(item=>(
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

      <section className="tm-section bg-surface" id="cta">
        <div className="tm-container">
          <div className="cta-card">
            <div className="cta-content">
              <p className="cta-eyebrow">Get Started Today</p>
              <h2 className="cta-heading">Build a Business Around Customers You Actually Understand.</h2>
              <p className="cta-body">From journey mapping to loyalty driver analysis, our customer research gives you the evidence to make decisions that retain, grow, and delight your most valuable customers.</p>
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

export default CapabilitiesCustomerResearchPage;
