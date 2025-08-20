import type React from 'react';
import { landing } from '../landing.constant';
import LandingHeroSection from '../components/landing-hero-section';
import LandingCaseStudySection from '../components/landing-casestudy-section';
import LandingWorkingFlowSection from '../components/landing-working-flow-section';

const AdvocateLandingPage: React.FC = () => {
  return (
    <>
      <LandingHeroSection heroSection={landing.advocate.heroSection} />
      <LandingCaseStudySection
        questionarySection={landing.advocate.caseStudySection}
      />
      <LandingWorkingFlowSection
        workingFlowSection={landing.advocate.workingFlowSection}
      />
    </>
  );
};

export default AdvocateLandingPage;
