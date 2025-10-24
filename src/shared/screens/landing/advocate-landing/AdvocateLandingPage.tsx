import type React from 'react';
import { landing } from '@/core/constants/page-constants/landing-constant';
import LandingHeroSection from '@/shared/screens/landing/components/landing-hero-section';
import LandingCaseStudySection from '@/shared/screens/landing/components/landing-casestudy-section';
import LandingWorkingFlowSection from '@/shared/screens/landing/components/landing-working-flow-section';
import PartnershipForm from './components/partnership-form';

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
      <PartnershipForm />
    </>
  );
};

export default AdvocateLandingPage;
