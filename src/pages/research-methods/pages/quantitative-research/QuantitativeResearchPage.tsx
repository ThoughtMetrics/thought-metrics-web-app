import HeroSection from '@/shared/ui/templates/hero-section';
import { researchMethods } from '../../research-methods.constant';
import { ResearchServiceSection } from '@/shared/ui/templates/service-section';
import { ResearchMethodCaseStudySection } from '@/shared/ui/templates/casestudy-section';
import OurPanelSection from '@/shared/components/our-panel-section';
import { ResearchMethodQuestionarySection } from '@/shared/ui/templates/questionary-section';
import BlogOrganism from '@/shared/ui/organisms/blog-organism';
import { ResearchMethodActionSection } from '@/shared/ui/templates/action-section';
import { useBlogData } from '@/core/hooks/use-blog-data';
import { Suspense } from 'react';
import BlogSkeleton from '@/shared/components/blog-skeleton';
import { ContentCategory } from '@/core/types/content.type';

const ResearchMethodQuantitativeResearch: React.FC = () => {
  const pageContent = researchMethods.quantitative_research;

  const { blogData } = useBlogData({
    title: pageContent.blogData.title,
    type: [],
    category: [ContentCategory.QUANTITATIVE_RESEARCH],
    limit: 4,
  });

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
      <Suspense fallback={<BlogSkeleton />}>
        <BlogOrganism data={blogData} bgColor="bg-white" />
      </Suspense>
      <ResearchMethodActionSection actionSection={pageContent.actionSection} />
    </>
  );
};

export default ResearchMethodQuantitativeResearch;
