import HeroSection from '@/shared/ui/templates/hero-section';
import { researchMethods } from '../../research-methods.constant';
import OurPanelSection from '@/shared/components/our-panel-section';
import { ResearchMethodActionSection } from '@/shared/ui/templates/action-section';

const ResearchMethodSurveys: React.FC = () => {
  const pageContent = researchMethods.surveys;
  return (
    <>
      <HeroSection
        heroSection={pageContent.heroSection}
        contentClassName="xl:w-[42%] xxl:w-[37%] wide:w-[48%]"
        titleClassName="w-full"
      />

      <OurPanelSection />
      <ResearchMethodActionSection actionSection={pageContent.actionSection} />
    </>
  );
};

export default ResearchMethodSurveys;
