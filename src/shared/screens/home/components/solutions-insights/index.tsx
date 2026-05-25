import React from 'react';
import { ROUTES } from '@/routes/routeConfig';

const CTASection: React.FC = () => {
  return (
    <section className="tm-section bg-surface" id="cta">
      <div className="tm-container">
        <div className="cta-card">
          <div className="cta-content">
            <p className="cta-eyebrow">Get Started Today</p>
            <h2 className="cta-heading">
              Ready to see the <br />True Indian Consumer?
            </h2>
            <p className="cta-body">
              Join 200+ global brands who rely on ThoughtMetrics for their
              mission-critical market research and strategic decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={ROUTES.CONTACT_US} className="btn-surface">
                Schedule a Demo
              </a>
              <a href={ROUTES.START_YOUR_RESEARCH} className="btn-cta-frosted">
                Contact Sales
              </a>
            </div>
          </div>
          <div className="cta-orb cta-orb--tl" />
          <div className="cta-orb cta-orb--br" />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
