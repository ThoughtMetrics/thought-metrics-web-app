import HeroSection from '@/shared/ui/templates/hero-section';
import { researchMethods } from '../../research-methods.constant';
import { MarketOpportunitySection } from '@/shared/ui/templates/service-section';
import { ResearchMethodCaseStudySection } from '@/shared/ui/templates/casestudy-section';
import OurPanelSection from '@/shared/components/our-panel-section';
import { ResearchMethodQuestionarySection } from '@/shared/ui/templates/questionary-section';
import BlogOrganism from '@/shared/ui/organisms/blog-organism';
import { ResearchMethodActionSection } from '@/shared/ui/templates/action-section';
import { useBlogData } from '@/core/hooks/use-blog-data';
import { ContentCategory } from '@/core/types/content.type';
import { Suspense } from 'react';
import BlogSkeleton from '@/shared/components/blog-skeleton';

const ResearchMethodQualitativeResearch: React.FC = () => {
  const pageContent = researchMethods.qualitative_research;

  const { blogData } = useBlogData({
    title: pageContent.blogData.title,
    type: [],
    category: [ContentCategory.QUALITATIVE_RESEARCH],
    limit: 4,
  });

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
      <Suspense fallback={<BlogSkeleton />}>
        <BlogOrganism data={blogData} bgColor="bg-white" />
      </Suspense>
      <ResearchMethodActionSection actionSection={pageContent.actionSection} />
    </>
  );
};

export default ResearchMethodQualitativeResearch;
