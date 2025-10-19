import HeroSection from '@/shared/ui/templates/hero-section';
import { capabilities } from '../capabilities.constant';
import { CapabilityActionSection } from '@/shared/ui/templates/action-section';
import { ProductResearchSection } from '@/shared/ui/templates/service-section';
import { QuestionarySection } from '@/shared/ui/templates/questionary-section';
import ProductResearchB2BServices from './components/product-research-b2b-services';
import ProductResearchFeatureSection from './components/product-research-feature-section';

const CapabilitiesProductResearchPage: React.FC = () => {
  const pageContent = capabilities.product_research;
  return (
    <>
      <HeroSection heroSection={pageContent.heroSection} />
      <ProductResearchSection serviceSection={pageContent.serviceSection} />
      <QuestionarySection
        questionarySection={pageContent.questionarySection}
        className="relative md:pb-0 pt-8 md:pt-10"
        imgClassName="md:rounded-b-none h-[30.5rem] w-full"
        qandaClassName="md:pl-10"
      />
      <ProductResearchFeatureSection featureSection={pageContent.featureSection} />
      <ProductResearchB2BServices b2bServiceSection={pageContent.b2bServiceSection} />
      <CapabilityActionSection actionSection={pageContent.actionSection} />
    </>
  );
};

export default CapabilitiesProductResearchPage;
