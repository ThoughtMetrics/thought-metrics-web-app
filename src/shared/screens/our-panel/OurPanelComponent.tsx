import React from 'react';
import { ROUTES } from '@/routes/routeConfig';

const panelQualities = [
  { icon: 'sentiment_very_satisfied', color: 'primary', t: 'Genuine & Engaged Participants', d: 'Our panel is made up of real people who are eager to share their honest opinions. They understand the value of research and take their role seriously.' },
  { icon: 'public', color: 'secondary', t: 'Nationwide Reach', d: 'From major cities to rural towns, our panel covers every corner of India — ensuring diversity in perspectives and accessibility to hard-to-reach groups.' },
  { icon: 'trending_up', color: 'tertiary', t: 'Continuously Growing', d: 'We prioritize secure handling of participant data and maintain rigorous protocols to ensure ethical, accurate, and high-integrity research as the panel scales.' },
  { icon: 'verified_user', color: 'primary', t: 'Thoroughly Verified', d: 'Before anyone joins, they\'re checked for duplicates, inconsistencies, and suspicious patterns. Our multi-step verification process keeps quality high and fraud out.' },
  { icon: 'schedule', color: 'secondary', t: 'Responsive & Reliable', d: 'Our panel doesn\'t ghost. With structured confirmation touchpoints and personal contact, we maintain one of the highest attendance and engagement rates in the industry.' },
  { icon: 'groups', color: 'tertiary', t: 'Demographically Balanced', d: 'We maintain quotas to ensure representation across age, gender, ethnicity, and location — giving you more well-rounded, credible insights every time.' },
];

const industries = [
  { icon: 'shopping_basket', t: 'FMCG', d: 'Everyday shoppers to loyal brand users — rapid, real-world feedback on products, packaging, and consumer behavior.' },
  { icon: 'storefront', t: 'Retail & Merchandising', d: 'In-store and online shoppers, plus retail professionals offering insights on buying decisions and customer journeys.' },
  { icon: 'local_hospital', t: 'Healthcare & Life Sciences', d: 'Patients, caregivers, HCPs, and wellness-focused individuals offering diverse perspectives on treatments and innovations.' },
  { icon: 'campaign', t: 'Advertising & Marketing', d: 'Consumers reacting to campaigns and marketing professionals evaluating strategy across formats.' },
  { icon: 'account_balance', t: 'Financial Services', d: 'Banking users, insurance policyholders, and financial advisors representing the full spectrum of financial decision-makers.' },
  { icon: 'show_chart', t: 'Investors', d: 'Data-driven quality assurance and advanced analytics ensuring high-quality insights that drive real investment impact.' },
  { icon: 'directions_car', t: 'Automotive', d: 'Everyday drivers, EV adopters, and fleet managers — people who live on the road and influence the automotive market.' },
  { icon: 'school', t: 'Education', d: 'Students, parents, teachers, and administrators uncovering insights around learning, policy, and the future of education.' },
  { icon: 'business_center', t: 'Human Resources', d: 'Hiring managers to L&D specialists and employees offering grounded perspectives on workplace culture and talent management.' },
  { icon: 'play_circle', t: 'Media & Internet', d: 'Content creators and media consumers — for testing ideas, formats, and platforms with those shaping today\'s media.' },
  { icon: 'devices', t: 'Technology', d: 'Early adopters, IT professionals, and digital natives — perfect for product testing, UX feedback, and trend tracking.' },
];

const benefits = [
  { icon: 'monetization_on', t: 'Get Paid for Your Opinions', d: 'Earn incentives through gift vouchers, online prepaid solutions, or direct transfers for every project you complete.' },
  { icon: 'schedule', t: 'Flexible Schedule', d: 'Participate in studies that fit your lifestyle — online, in-person, phone, or surveys on your own time.' },
  { icon: 'shield', t: 'Privacy Protected', d: 'Your information is kept completely confidential. We never sell or share your data with any third party.' },
  { icon: 'hub', t: 'Make a Real Impact', d: 'Your feedback directly influences the products, services, and experiences of tomorrow. Your voice shapes real decisions.' },
];

const OurPanel: React.FC = () => (
  <>
    {/* Hero */}
    <section className="tm-section relative">
      <div className="tm-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="z-10">
          <nav className="flex items-center gap-2 mb-6 text-xs text-on-surface-variant" aria-label="Breadcrumb">
            <a href="/" className="hover:text-on-surface transition-colors">Home</a>
            <span className="opacity-40">/</span>
            <span className="text-primary font-medium">Our Panel</span>
          </nav>
          <span className="chip mb-6 inline-flex">PARTICIPANT PANEL</span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.08]">
            We Don't Have to <span className="text-primary italic">Search Far.</span>
          </h1>
          <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
            Great participants find their way to us. With unmatched capabilities, seamless processes, and a commitment to quality, we're the ideal research partner to bring your study to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <a href="/start-your-research" className="btn-primary">Start Your Research</a>
            <a href={ROUTES.SIGN_UP} className="btn-ghost">Join Our Panel</a>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-[3rem] bg-surface-container-low border border-outline-variant/10 shadow-2xl p-8 flex flex-col gap-5 min-h-[360px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Panel Quality Metrics</span>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div><span className="text-xs text-on-surface-variant">Live</span></div>
            </div>
            <div className="space-y-3">
              {[{label:'Engagement Rate',pct:94,color:'primary'},{label:'Verification Pass Rate',pct:99.2,color:'secondary'},{label:'Geographic Coverage',pct:100,color:'tertiary'},{label:'Industries Covered',pct:100,color:'primary'}].map(({label,pct,color})=>(
                <div key={label} className="bg-surface-container rounded-xl p-3">
                  <div className="flex justify-between mb-2"><span className="text-xs font-semibold text-on-surface">{label}</span><span className={`text-xs font-bold text-${color}`}>{pct === 94 ? '94%' : pct === 99.2 ? '99.2%' : pct === 100 && label === 'Geographic Coverage' ? 'All India' : '11 Sectors'}</span></div>
                  <div className="h-2 bg-outline-variant/20 rounded-full"><div className={`h-full bg-${color} rounded-full`} style={{width:`${Math.min(pct,100)}%`}}></div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -top-4 -right-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
            <div className="text-primary text-2xl font-bold mb-0.5">11 Sectors</div>
            <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Industry Coverage</div>
          </div>
          <div className="absolute -bottom-4 -left-4 bg-surface-container-high/90 backdrop-blur-xl p-5 rounded-2xl border border-outline-variant/20 shadow-2xl">
            <div className="text-secondary text-2xl font-bold mb-0.5">Pan-India</div>
            <div className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Geographic Reach</div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{zIndex:-1}} aria-hidden="true">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/8 blur-[140px] rounded-full" />
      </div>
    </section>

    {/* Panel Qualities */}
    <section className="tm-section bg-surface-container-lowest">
      <div className="tm-container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="section-eyebrow">What Makes Our Panel Different</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-5">Built for Quality, <span className="text-primary">Designed for Research</span></h2>
          <p className="text-lg text-on-surface-variant">Every aspect of our panel is engineered to deliver the accuracy, diversity, and engagement your research demands.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {panelQualities.map(({icon,color,t,d})=>(
            <div key={t} className="ds-card">
              <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center mb-6`}><span className={`material-symbols-outlined text-${color} text-3xl`}>{icon}</span></div>
              <h3 className="text-lg font-bold mb-3 text-on-surface">{t}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Industry Coverage */}
    <section className="tm-section bg-surface">
      <div className="tm-container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
          <div className="max-w-2xl">
            <p className="section-eyebrow">Industry Coverage</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-5">Our <span className="text-secondary">Coverage</span></h2>
            <p className="text-lg text-on-surface-variant">We bring extensive experience in sourcing high-quality research participants across a wide range of sectors — from FMCG to Healthcare to Technology.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {industries.map(({icon,t,d})=>(
            <div key={t} className="ds-card flex flex-col gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
              <h3 className="font-bold text-on-surface">{t}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Join Panel CTA */}
    <section className="tm-section bg-surface-container-lowest">
      <div className="tm-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-eyebrow">Join Our Panel</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Be Part of Something That <span className="text-primary">Shapes the Future.</span></h2>
            <p className="text-lg text-on-surface-variant mb-6 leading-relaxed">Whether it's sharing your opinion on a new product, testing a service before it launches, or giving feedback that helps brands improve — your voice matters. By joining our panel, you'll get the opportunity to take part in paid research projects that fit your interests and schedule.</p>
            <p className="text-lg text-on-surface-variant mb-10 leading-relaxed">It's flexible, and rewarding. We welcome people from all walks of life — because the best insights come from real, diverse experiences.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={ROUTES.SIGN_UP} className="btn-primary">Sign Up Today</a>
              <a href="/respondent-landing" className="btn-ghost">Read the FAQs</a>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {benefits.map(({icon,t,d})=>(
              <div key={t} className="ds-card">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"><span className="material-symbols-outlined text-primary text-3xl">{icon}</span></div>
                <h3 className="font-bold text-on-surface mb-2">{t}</h3>
                <p className="text-sm text-on-surface-variant">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </>
);

export default OurPanel;
