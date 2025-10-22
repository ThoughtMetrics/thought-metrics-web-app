import HeroSection from '@/shared/ui/templates/hero-section';
import { researchMethods } from '@/core/constants/page-constants/research-methods-constant';
import { MarketOpportunitySection } from '@/shared/ui/templates/service-section';
import { ResearchMethodCaseStudySection } from '@/shared/ui/templates/casestudy-section';
import OurPanelSection from '@/shared/components/our-panel-section';
import { ResearchMethodQuestionarySection } from '@/shared/ui/templates/questionary-section';
import BlogOrganism from '@/shared/ui/organisms/blog-organism';
import { ResearchMethodActionSection } from '@/shared/ui/templates/action-section';
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

interface QualitativeResearchPageProps {
  blogData?: BlogData | null;
}

const ResearchMethodQualitativeResearch: React.FC<QualitativeResearchPageProps> = ({ blogData }) => {
  const pageContent = researchMethods.qualitative_research;

  return (
    <>
      <HeroSection heroSection={pageContent.heroSection} />
      <MarketOpportunitySection serviceSection={pageContent.serviceSection} />
      <ResearchMethodCaseStudySection
        caseStudySection={pageContent.caseStudiesSection}
      />
      <OurPanelSection />
      <ResearchMethodQuestionarySection
        questionarySection={pageContent.questionarySection}
        titleClassName="w-[12.5rem] xl:w-[18.5rem] xxl:w-[18rem]"
        illustrationClassName="-right-[4.5rem] xl:-right-[2.5rem] xxl:-right-[6.5rem]"
      />
      {blogData ? (
        <BlogOrganism data={blogData} bgColor="bg-white" />
      ) : (
        <BlogSkeleton />
      )}
      <ResearchMethodActionSection actionSection={pageContent.actionSection} />
    </>
  );
};

export default ResearchMethodQualitativeResearch;
