import type React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider } from '@/shared/providers/auth-provider';
import PartnershipForm from './components/partnership-form';

const advocateSteps = [
  { num: '1', color: 'primary', bg: 'bg-primary/10', border: 'border-primary/20', title: 'Sign Up', desc: 'Fill out a quick form so we can get to know you and your audience.' },
  { num: '2', color: 'secondary', bg: 'bg-secondary/10', border: 'border-secondary/20', title: 'Share', desc: 'Share a unique link to our respondent sign-up page with your audience.' },
  { num: '3', color: 'tertiary', bg: 'bg-tertiary/10', border: 'border-tertiary/20', title: 'Promote', desc: 'Promote respondents to sign up and tell them about the benefits of joining.' },
  { num: '4', color: 'primary', bg: 'bg-primary/10', border: 'border-primary/20', title: 'Get Paid', desc: 'Get paid based on the number of respondents who sign up via your link.' },
];

const AdvocateLandingPageContent: React.FC = () => {
  return (
    <>
      {/* ── Hero ── */}
      <section className="tm-section relative overflow-hidden text-center">
        <div className="tm-container max-w-3xl mx-auto">
          <span className="chip mb-6 inline-flex">LET'S TEAM UP</span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05] text-on-surface">
            Become a<br />
            <span className="text-primary italic">ThoughtMetrics Advocate.</span>
          </h1>
          <p className="text-xl text-on-surface-variant mb-10 leading-relaxed">
            Bring voice to our platform. Get paid. We're looking for content creators and community builders to help us reach the right people.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <a href="#advocate-forms" className="btn-primary text-base px-8 py-4">Sign Me Up</a>
            <a href="/respondent-landing" className="btn-ghost text-base">Join as a Respondent Instead</a>
          </div>
        </div>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none rounded-full"
          style={{ zIndex: -1, width: 700, height: 400, background: 'var(--secondary)', opacity: 0.08, filter: 'blur(160px)' }}
          aria-hidden="true"
        />
      </section>

      {/* ── What is ThoughtMetrics ── */}
      <section className="tm-section" style={{ background: 'var(--surface-container-lowest)' }}>
        <div className="tm-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="section-eyebrow">What is ThoughtMetrics?</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-on-surface">
                Simply Put, We <span className="text-primary">Reward People</span> for Sharing Their Opinions.
              </h2>
              <p className="text-lg text-on-surface-variant mb-6 leading-relaxed">
                Thought Metrics is a market research support service that connects clients with their consumers to discuss the products and services they use in their daily lives, offering compensation for their time and insights.
              </p>
              <p className="text-lg text-on-surface-variant mb-10 leading-relaxed">
                As an advocate, you become the bridge — bringing us the consumers, patients, and professionals we need to do meaningful research.
              </p>
              <div className="rounded-2xl p-6 border border-outline-variant/10" style={{ background: 'var(--surface-container)' }}>
                <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">As an advocate, you would bring us:</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Consumers', 'Business professionals', 'Patients', 'Healthcare professionals'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-on-surface">
                      <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p className="section-eyebrow mb-6">How Do You Fit In?</p>
              <div className="process-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {advocateSteps.map(({ num, color, bg, border, title, desc }) => (
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
          </div>
        </div>
      </section>

      {/* ── Partnership Form ── */}
      <section className="tm-section" id="advocate-forms" style={{ background: 'var(--surface)' }}>
        <div className="tm-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Partnership info */}
            <div>
              <p className="section-eyebrow">Partner With Us</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-on-surface">
                Want to Partner with <span className="text-secondary">Thought Metrics?</span>
              </h2>
              <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">
                To manage the high volume of applications, we are responding only to those applicants whose profiles best match our requirements and expectations.
              </p>
              <div className="rounded-2xl p-6 border border-outline-variant/10 space-y-4" style={{ background: 'var(--surface-container-low)' }}>
                {[
                  { icon: 'verified', color: 'primary', title: 'Verified Partnership', sub: 'We review each application personally to ensure a quality match.' },
                  { icon: 'payments', color: 'secondary', title: 'Performance-Based Earnings', sub: 'Your earnings are tied to the number of successful sign-ups from your audience.' },
                  { icon: 'shield', color: 'tertiary', title: 'Privacy Respected', sub: 'All data you share with us is kept strictly confidential per our Privacy Policy.' },
                ].map(({ icon, color, title, sub }) => (
                  <div key={title} className="flex items-start gap-3">
                    <span className={`material-symbols-outlined text-${color} text-xl mt-0.5`}>{icon}</span>
                    <div>
                      <div className="font-bold text-on-surface text-sm mb-0.5">{title}</div>
                      <div className="text-xs text-on-surface-variant">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: Partnership form */}
            <PartnershipForm />
          </div>
        </div>
      </section>
    </>
  );
};

const AdvocateLandingPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdvocateLandingPageContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default AdvocateLandingPage;
