import HeroSection from '@/shared/ui/templates/hero-section';
import { capabilities } from '../../capabilities.constant';
import { CapabilityActionSection } from '@/shared/ui/templates/action-section';
import { ResearchServiceSection } from '@/shared/ui/templates/service-section';
import { QuestionarySection } from '@/shared/ui/templates/questionary-section';
import BrandAdFeatureSection from './components/brand-ad-feature-section';
import BrandAdB2BServices from './components/brand-ad-b2b-services';

const CapabilitiesBrandingAdvertisingPage: React.FC = () => {
  const pageContent = capabilities.brand_advertising;
  return (
    <>
      <HeroSection heroSection={pageContent.heroSection} />
      <ResearchServiceSection serviceSection={pageContent.serviceSection} />
      <QuestionarySection
        questionarySection={pageContent.questionarySection}
        className="relative md:pb-0 pt-8 md:pt-10"
        imgClassName="md:rounded-b-none h-[25rem] w-full"
        qandaClassName="md:pl-10"
      />
      <BrandAdFeatureSection featureSection={pageContent.featureSection}/>
      <BrandAdB2BServices b2bServiceSection={pageContent.b2bServiceSection} />
      <CapabilityActionSection actionSection={pageContent.actionSection} />
    </>
  );
};

export default CapabilitiesBrandingAdvertisingPage;
