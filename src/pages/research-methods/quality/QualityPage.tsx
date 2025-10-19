import { ResearchMethodActionSection } from '@/shared/ui/templates/action-section';
import { researchMethods } from '../research-methods.constant';
import { ProductResearchSection } from '@/shared/ui/templates/service-section';
import QualityCaseStudySection from './components/quality-case-study';
import QualityHeroSection from './components/quality-hero-section';

const ResearchMethodQuality: React.FC = () => {
  const pageContent = researchMethods.quality;
  return (
    <>
      <QualityHeroSection heroSection={pageContent.heroSection} />
      <QualityCaseStudySection caseStudySection={pageContent.caseStudySection} contentClassName="md:w-[50%]" />
      <ProductResearchSection serviceSection={pageContent.serviceSection} contentClassName="md:w-[50%]" />
      <ResearchMethodActionSection actionSection={pageContent.actionSection} />
    </>
  );
};

export default ResearchMethodQuality;
