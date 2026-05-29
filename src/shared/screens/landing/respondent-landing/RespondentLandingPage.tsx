import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider } from '@/shared/providers/auth-provider';
import { ROUTES } from '@/routes/routeConfig';

interface BlogData {
  title: string;
  items: {
    id: number;
    type: string;
    category: string;
    label: string;
    description: string;
    link: string;
    src: string;
  }[];
}

interface RespondentLandingPageProps {
  blogData?: BlogData | null;
}

const faqs = [
  { q: "What's a focus group?", a: "A focus group is a round-table discussion on products and services that you use. The discussions are led by market research professionals and usually last between 1–2 hours. While focus groups are a common type of research study, we also conduct taste tests, product trials, in-home interviews, shop-along interviews, phone interviews, and online research. When you're done, you will receive an incentive for your contribution!" },
  { q: "Where are Thought Metrics' focus group facilities located?", a: "Thought Metrics has focus group facilities across India. When you register, you can choose the one nearest to you. If you do not live close to any facility, you can register for our national database, and you will be eligible for phone or online interviews." },
  { q: "What do you expect from participants?", a: "To make research meaningful and accurate, we ask all participants to: Be truthful when answering questions about yourself and your habits. Arrive for your appointment on time and ready to participate. Notify Thought Metrics if you must cancel, with as much advance notice as possible." },
  { q: "How do I register?", a: "Registering will add you to Thought Metrics' participant community, giving you access to various study opportunities. During sign-up, we will ask for contact information, demographic details, and household information. This helps us identify if you qualify for a particular project." },
  { q: "What incentives do you provide?", a: "We offer incentives in multiple forms depending on the project, but most commonly through online prepaid solutions, gift vouchers, or direct transfers. Incentives are typically sent within 2 weeks of participation." },
  { q: "Is my information safe?", a: "Yes! Thought Metrics adheres to the Insights Association Code of Standards and Ethics for Market Research and Data Analytics. Your information is kept completely confidential. We do not sell or share your information with any third party." },
  { q: "I signed up but haven't heard from you. Why?", a: "Phone and email communication depend on the information provided in your Dashboard Profile. If your profile is complete but you are not receiving communication from Thought Metrics: double-check your email preferences and contact information, and add our email contactus@thoughtmetrics.com to your contacts so our emails don't go to spam." },
  { q: "How do I unsubscribe?", a: "If you would like to unsubscribe from our database and no longer receive calls or emails about upcoming focus groups, please click unsubscribe from your account settings." },
];

const whoCanJoin = [
  { icon: 'groups', color: 'primary', title: 'Consumers', desc: 'We welcome people from all walks of life — kids, teens, parents, grandparents, and everyone in between. Our studies cover a huge variety of topics, from gaming and food to alcohol and even diapers.' },
  { icon: 'business_center', color: 'secondary', title: 'Business Professionals', desc: 'Many of our focus groups involve insights from industry pros, including IT decision-makers, business owners, executives, HR specialists, contractors, and educators.' },
  { icon: 'personal_injury', color: 'tertiary', title: 'Patients', desc: 'Whether you use medications, treatments, or medical devices like injectables and wearables, your experience matters. We explore topics such as rare diseases, weight management, diabetes, and cancer.' },
  { icon: 'health_and_safety', color: 'primary', title: 'Healthcare Professionals', desc: 'We also have research opportunities for those working in healthcare, including patient care managers, physicians, nurses, pharmacists, dentists, surgeons, hospital administrators, and technicians.' },
];

const steps = [
  { num: '1', color: 'primary', bg: 'bg-primary/10', border: 'border-primary/20', title: 'Sign Up', desc: 'Fill out a quick form so we can get to know you and match you to the right studies.' },
  { num: '2', color: 'secondary', bg: 'bg-secondary/10', border: 'border-secondary/20', title: 'Share', desc: 'Share your thoughts in a group, survey, or one-on-one session — online or in-person.' },
  { num: '3', color: 'tertiary', bg: 'bg-tertiary/10', border: 'border-tertiary/20', title: 'Get Rewarded', desc: 'Yes, your time and insights matter — and we make sure to thank you with monetary benefits.' },
  { num: '4', color: 'primary', bg: 'bg-primary/10', border: 'border-primary/20', title: 'See the Impact', desc: 'Your feedback helps shape decisions that affect products, services, and even policies.' },
];

const RespondentLandingContent: React.FC<RespondentLandingPageProps> = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* ── Hero ── */}
      <section className="tm-section relative text-center">
        <div className="tm-container max-w-3xl mx-auto">
          <span className="chip mb-6 inline-flex">PARTICIPATE IN MARKET RESEARCH STUDIES</span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05] text-on-surface">
            Speak Up.<br />
            <span className="text-primary italic">Make an Impact.</span>
          </h1>
          <p className="text-xl text-on-surface-variant mb-10 leading-relaxed">
            Join in. Be heard. See the difference you make. Get paid for sharing your honest opinions in focus groups, surveys, and research studies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <a href={ROUTES.SIGN_UP} className="btn-primary text-base px-8 py-4">Sign Up for Paid Surveys</a>
            <a href="#respondent-faq" className="btn-ghost text-base">Read the FAQs</a>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }} aria-hidden="true">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
            style={{ width: 700, height: 400, background: 'var(--primary)', opacity: 0.08, filter: 'blur(160px)' }}
          />
        </div>
      </section>

      {/* ── Why We Want to Hear From You ── */}
      <section className="tm-section" style={{ background: 'var(--surface-container-lowest)' }}>
        <div className="tm-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-eyebrow">Why We Want to Hear From You</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-on-surface">
                Real Voices.<br /><span className="text-primary">Real Stories.</span>
              </h2>
              <p className="text-lg text-on-surface-variant mb-6 leading-relaxed">
                We're all about real voices and real stories. When you share your perspective, you're not just answering questions — you're helping brands, organizations, and communities do better.
              </p>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                Whether you've got a quick opinion or a full story to tell, we want to hear it.
              </p>
            </div>
            <div>
              <p className="section-eyebrow mb-6">Who Can Join?</p>
              <div className="space-y-4">
                {whoCanJoin.map(({ icon, color, title, desc }) => (
                  <div key={title} className="ds-card flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center flex-shrink-0`}>
                      <span className={`material-symbols-outlined text-${color} text-2xl`}>{icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-on-surface mb-1">{title}</h3>
                      <p className="text-sm text-on-surface-variant">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="tm-section" style={{ background: 'var(--surface)' }}>
        <div className="tm-container">
          <div className="text-center mb-14">
            <p className="section-eyebrow">Basically, It Works Like This</p>
            <h2 className="text-4xl md:text-5xl font-bold text-on-surface">
              Simple. <span className="text-secondary">Rewarding.</span>
            </h2>
          </div>
          <div className="process-grid">
            {steps.map(({ num, color, bg, border, title, desc }) => (
              <div key={num} className="process-step">
                <div className={`w-14 h-14 rounded-2xl ${bg} border ${border} flex items-center justify-center mb-5`}>
                  <span className={`text-${color} text-2xl font-bold`}>{num}</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2">{title}</h3>
                <p className="text-on-surface-variant text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="tm-section" id="respondent-faq" style={{ background: 'var(--surface-container-lowest)' }}>
        <div className="tm-container max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-eyebrow">Frequently Asked Questions</p>
            <h2 className="text-4xl font-bold text-on-surface">Everything You Need to Know</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-card${openFaq === i ? ' open' : ''}`}>
                <div
                  className="faq-header cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <p className="faq-question">{faq.q}</p>
                  <span className="faq-chevron">&#9660;</span>
                </div>
                <div className="faq-body">
                  <p className="text-sm text-on-surface-variant">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="tm-section" style={{ background: 'var(--surface)' }}>
        <div className="tm-container">
          <div className="cta-card">
            <div className="cta-content">
              <p className="cta-eyebrow">Your Voice Matters</p>
              <h2 className="cta-heading">Why Keep it to Yourself?</h2>
              <p className="cta-body">
                Join our community today and help shape the world, one opinion at a time. We're always running studies and focus groups across India — get involved, share your thoughts, and earn rewards in the process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={ROUTES.SIGN_UP} className="btn-surface">Sign Me Up</a>
                <a href="/advocate-landing" className="btn-cta-frosted">Are You a Content Creator?</a>
              </div>
            </div>
            <div className="cta-orb cta-orb--tl" />
            <div className="cta-orb cta-orb--br" />
          </div>
        </div>
      </section>
    </>
  );
};

const RespondentLandingPage: React.FC<RespondentLandingPageProps> = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RespondentLandingContent {...props} />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default RespondentLandingPage;
