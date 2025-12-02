import type React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider } from '@/shared/providers/auth-provider';
import { landing } from '@/core/constants/page-constants/landing-constant';
import LandingHeroSection from '@/shared/screens/landing/components/landing-hero-section';
import LandingCaseStudySection from '@/shared/screens/landing/components/landing-casestudy-section';
import LandingWorkingFlowSection from '@/shared/screens/landing/components/landing-working-flow-section';
import PartnershipForm from './components/partnership-form';

const AdvocateLandingPageContent: React.FC = () => {
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

/**
 * AdvocateLandingPage - Separate Astro Island with its own providers
 *
 * IMPORTANT: Has its own AuthProvider because it's rendered as client:only="react"
 * in advocate-landing.astro, making it a separate island.
 */
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
