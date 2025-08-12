import HeroSection from '@/shared/ui/templates/hero-section';
import { researchMethods } from '../../research-methods.constant';
import { ResearchServiceSection } from '@/shared/ui/templates/service-section';
import { ResearchMethodCaseStudySection } from '@/shared/ui/templates/casestudy-section';
import OurPanelSection from '@/shared/components/our-panel-section';
import { ResearchMethodQuestionarySection } from '@/shared/ui/templates/questionary-section';
import BlogOrganism from '@/shared/ui/organisms/blog-organism';
import { ResearchMethodActionSection } from '@/shared/ui/templates/action-section';

const ResearchMethodQuantitativeResearch: React.FC = () => {
  const pageContent = researchMethods.quantitative_research;
  return (
    <>
      <HeroSection heroSection={pageContent.heroSection} />
      <ResearchServiceSection serviceSection={pageContent.serviceSection} />
      <ResearchMethodCaseStudySection
        caseStudySection={pageContent.caseStudiesSection}
      />
      <OurPanelSection />
      <ResearchMethodQuestionarySection
        questionarySection={pageContent.questionarySection}
      />
      <BlogOrganism data={pageContent.blogData} bgColor="bg-white" />
      <ResearchMethodActionSection actionSection={pageContent.actionSection} />
    </>
  );
};

export default ResearchMethodQuantitativeResearch;
