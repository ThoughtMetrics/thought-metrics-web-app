import type React from 'react';
import LandingHeroSection from '../components/landing-hero-section';
import { landing } from '../landing.constant';
import LandingCaseStudySection from '../components/landing-casestudy-section';
import LandingWorkingFlowSection from '../components/landing-working-flow-section';
import BlogOrganism from '@/shared/ui/organisms/blog-organism';
import LandingAboutUsSection from '../components/landing-about-us';
import LandingJoinUsSection from '../components/join-us-section';
import LandingQuestionarySection from '../components/landing-questionary-section';
import LandingSignUpSection from '../components/landing-sign-section';

const RespondentLandingPage: React.FC = () => {
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
      <BlogOrganism
        data={landing.respondent.blogSection}
        titleClassName="w-[60%] md:w-[30%]"
      />
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

export default RespondentLandingPage;
