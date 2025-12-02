import type React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider } from '@/shared/providers/auth-provider';
import LandingHeroSection from '@/shared/screens/landing/components/landing-hero-section';
import { landing } from '@/core/constants/page-constants/landing-constant';
import LandingCaseStudySection from '@/shared/screens/landing/components/landing-casestudy-section';
import LandingWorkingFlowSection from '@/shared/screens/landing/components/landing-working-flow-section';
import BlogOrganism from '@/shared/ui/organisms/blog-organism';
import LandingAboutUsSection from '@/shared/screens/landing/components/landing-about-us';
import LandingJoinUsSection from '@/shared/screens/landing/components/join-us-section';
import LandingQuestionarySection from '@/shared/screens/landing/components/landing-questionary-section';
import LandingSignUpSection from '@/shared/screens/landing/components/landing-sign-section';
import BlogSkeleton from '@/shared/components/blog-skeleton';

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

const RespondentLandingPageContent: React.FC<RespondentLandingPageProps> = ({
  blogData,
}) => {
  return (
    <>
      <LandingHeroSection
        heroSection={landing.respondent.heroSection}
        faqId={landing.respondent.questionarySection.id}
      />
      <LandingCaseStudySection
        questionarySection={landing.respondent.caseStudySection}
      />
      <LandingWorkingFlowSection
        workingFlowSection={landing.respondent.workingFlowSection}
      />
      {blogData ? (
        <BlogOrganism data={blogData} titleClassName="w-[60%] md:w-[30%]" />
      ) : (
        <BlogSkeleton />
      )}
      <LandingAboutUsSection
        aboutUsSection={landing.respondent.aboutUsSection}
      />
      <LandingJoinUsSection joinUsSection={landing.respondent.joinUsSection} />
      <LandingQuestionarySection
        faqId={landing.respondent.questionarySection.id}
        aria-labelledby={landing.respondent.questionarySection.id}
        questionarySection={landing.respondent.questionarySection}
      />
      <LandingSignUpSection signUpSection={landing.respondent.signUpSection} />
    </>
  );
};

/**
 * RespondentLandingPage - Separate Astro Island with its own providers
 *
 * IMPORTANT: Has its own AuthProvider because it's rendered as client:load
 * in respondent-landing.astro, making it a separate island. All child components
 * (LandingHeroSection, LandingSignUpSection, etc.) share this provider.
 */
const RespondentLandingPage: React.FC<RespondentLandingPageProps> = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RespondentLandingPageContent {...props} />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default RespondentLandingPage;
