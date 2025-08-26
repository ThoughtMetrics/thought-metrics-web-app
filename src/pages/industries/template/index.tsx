import { IndustryActionSection } from '@/shared/ui/templates/action-section';
import { CaseStudySection } from '@/shared/ui/templates/casestudy-section';
import FeatureSection from '@/shared/ui/templates/feature-section';
import HeroSection from '@/shared/ui/templates/hero-section';
import { QuestionarySection } from '@/shared/ui/templates/questionary-section';
import { IndustryServiceSection } from '@/shared/ui/templates/service-section';

const IndustryTemplatePage: React.FC<any> = ({
  industry,
  featureCardClassName,
}: any) => {
  industry.heroSection.illustration.className = 'pt-4';
  return (
    <>
      <HeroSection heroSection={industry.heroSection} />
      <IndustryServiceSection serviceSection={industry.serviceSection} />
      <QuestionarySection questionarySection={industry.questionarySection} />
      <FeatureSection
        featureSection={industry.featureSection}
        featureCardClassName={featureCardClassName}
      />
      <CaseStudySection caseStudySection={industry.caseStudiesSection} />
      <IndustryActionSection actionSection={industry.actionSection} />
    </>
  );
};

export default IndustryTemplatePage;
