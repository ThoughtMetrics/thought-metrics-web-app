import React, { useState } from 'react';

const CapabilitiesProductResearchPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggle = (i: number) => setOpenFaq(openFaq === i ? null : i);

  const faqs = [
    { q: 'How do we know if our product concept will succeed?', a: 'Concept testing measures purchase intent, relevance, uniqueness, and believability among your target audience before development begins. We benchmark against category norms and competitive concepts to give you a realistic success probability.' },
    { q: 'What is the right price for our new product?', a: 'Pricing research (Van Westendorp, Gabor-Granger, or conjoint analysis) reveals the psychological price thresholds in your category, willingness-to-pay across segments, and how pricing affects perceived quality — so you can price for maximum value extraction.' },
    { q: 'How do we test packaging and product design?', a: 'Pack testing measures shelf standout, communication clarity, and purchase intent in simulated shelf environments. We test single packs and side-by-side competitive sets to understand how your packaging performs in the real purchase context.' },
    { q: 'How do we prioritize our product roadmap?', a: 'Feature prioritization research (MaxDiff, conjoint, KANO) reveals which features are truly must-haves vs. nice-to-haves for different user segments. We help you build a product roadmap based on user value rather than stakeholder opinion.' },
    { q: 'How do we validate product-market fit before full launch?', a: 'Product-market fit research combines concept testing, simulated trial, and early adopter interviews to assess whether your product genuinely solves a felt need — and whether the solution is distinctively better than existing alternatives in your target market.' },
  ];

  const steps = [
    {n:'01',icon:'lightbulb',t:'Idea Generation',d:'Consumer need-state exploration'},
    {n:'02',icon:'science',t:'Concept Testing',d:'Early-stage concept screening'},
    {n:'03',icon:'engineering',t:'Prototype Testing',d:'Usability & experience research'},
    {n:'04',icon:'price_check',t:'Pricing Research',d:'WTP & value perception studies'},
    {n:'05',icon:'inventory_2',t:'Pack & Brand Testing',d:'Shelf standout & communication'},
    {n:'06',icon:'query_stats',t:'Market Simulation',d:'Pre-launch volume forecasting'},
    {n:'07',icon:'rocket_launch',t:'Pre-Launch Validation',d:'Final concept & positioning check'},
    {n:'08',icon:'monitoring',t:'Post-Launch Tracking',d:'Usage, satisfaction & NPS tracking'},
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
              <span className="text-primary font-medium">Product Research</span>
            </nav>
            <span className="chip mb-6 inline-flex">PRODUCT RESEARCH</span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.08]">
              Test Before You Build.<br /><span className="text-primary italic">Launch With Confidence.</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
              From concept validation to post-launch tracking — test ideas before you commit, optimize pricing, and ensure your product solves the problem it was designed for.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <a href="/start-your-research" className="btn-primary">Request a Bid</a>
              <a href="#services" className="btn-ghost">Explore Services</a>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-[3rem] bg-surface-container-low border border-outline-variant/10 shadow-2xl p-8 flex flex-col gap-4 min-h-[360px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Product Testing Pipeline</span>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div><span className="text-xs text-on-surface-variant">Active</span></div>
              </div>
              <div className="space-y-2">
                {[{label:'Concept Score',pct:78,color:'primary',status:'VALIDATED'},{label:'Pricing WTP',pct:65,color:'secondary',status:'OPTIMAL'},{label:'Pack Standout',pct:82,color:'tertiary',status:'HIGH'},{label:'Purchase Intent',pct:71,color:'primary',status:'STRONG'}].map(({label,pct,color,status})=>(
                  <div key={label} className="bg-surface-container rounded-xl p-3 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1.5"><span className="text-xs font-semibold text-on-surface">{label}</span><span className={`text-[10px] font-bold text-${color} bg-${color}/10 px-2 py-0.5 rounded-full`}>{status}</span></div>
                      <div className="h-1.5 bg-outline-variant/20 rounded-full"><div className={`h-full bg-${color} rounded-full`} style={{width:`${pct}%`}}></div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
              <div className="text-primary text-2xl font-bold mb-0.5">Concept</div>
              <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Validation Research</div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
              <div className="text-tertiary text-2xl font-bold mb-0.5">PMF</div>
              <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Product-Market Fit</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{zIndex:-1}} aria-hidden="true">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-tertiary/8 blur-[140px] rounded-full" />
        </div>
      </section>

      <section className="bg-surface-container-lowest py-14 border-y border-outline-variant/5">
        <div className="tm-container flex flex-wrap justify-between gap-10 items-center">
          {[{icon:'science',color:'primary',label:'Concept Testing',sub:'Pre-Launch Validation'},{icon:'price_check',color:'secondary',label:'Pricing Research',sub:'WTP & Value Studies'},{icon:'touch_app',color:'tertiary',label:'UX Research',sub:'Usability & Experience'},{icon:'inventory_2',color:'primary-container',label:'Pack & Brand Testing',sub:'Shelf Standout & Communication'}].map(({icon,color,label,sub})=>(
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
              <p className="section-eyebrow">The 8-Step Product Testing Journey</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-5">Research at Every Stage of <span className="text-secondary">Product Development</span></h2>
              <p className="text-lg text-on-surface-variant">Great products don't happen by accident. They're built with evidence at every stage — from the first idea to the first year of sales.</p>
            </div>
            <a href="/start-your-research" className="btn-ghost flex-shrink-0">Get a Quote</a>
          </div>
          <div className="border border-outline-variant/20 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
              {steps.map(({n,icon,t,d},idx)=>(
                <div key={n} className={`p-6 border-b border-outline-variant/20 ${idx<4?'lg:border-b':'lg:border-b-0'} ${idx%4!==3?'md:border-r border-outline-variant/20':''}`}>
                  <div className="text-4xl font-extrabold text-primary opacity-20 mb-3">{n}</div>
                  <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-on-primary-container text-lg">{icon}</span>
                  </div>
                  <div className="font-bold text-on-surface mb-1">{t}</div>
                  <div className="text-xs text-on-surface-variant">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="tm-section bg-surface-container-lowest">
        <div className="tm-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="section-eyebrow">Product Research Questions</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Research That Reduces <span className="text-primary">Launch Risk</span></h2>
              <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">Product failures are expensive — and most of them are preventable with the right research at the right stage. These are the questions that give you launch confidence.</p>
              <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-4"><span className="material-symbols-outlined text-secondary text-xl">science</span><span className="font-semibold text-on-surface">Advanced Research Methods</span></div>
                <ul className="space-y-2">
                  {['Conjoint analysis for feature trade-off prioritization','MaxDiff for attribute importance ranking','KANO model for must-have vs. delight features','Van Westendorp & Gabor-Granger pricing models'].map(item=>(
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
              <h2 className="cta-heading">Build Products That Succeed — Starting From the First Brief.</h2>
              <p className="cta-body">From early concept testing to post-launch NPS tracking, our product research gives your team the evidence to make better product decisions at every stage of development.</p>
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

export default CapabilitiesProductResearchPage;
