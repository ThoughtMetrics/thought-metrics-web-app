import HeroSection from '@/shared/ui/templates/hero-section';
import { capabilities } from '@/core/constants/page-constants/capabilities-constant';
import { CapabilityActionSection } from '@/shared/ui/templates/action-section';
import CustomerResearchFeatureSection from './components/customer-research-feature-section';
import CustomerResearchB2BServices from './components/customer-research-b2b-services';
import { QuestionarySection } from '@/shared/ui/templates/questionary-section';
import { CustomerResearchSection } from '@/shared/ui/templates/service-section';

const CapabilitiesCustomerResearchPage: React.FC = () => {
  const pageContent = capabilities.customer_research;
  return (
    <>
      <HeroSection heroSection={pageContent.heroSection} />
      <CustomerResearchSection serviceSection={pageContent.serviceSection} />
      <QuestionarySection
        questionarySection={pageContent.questionarySection}
        className="relative md:pb-0 pt-8 md:pt-10"
        imgClassName="md:rounded-b-none h-[30.5rem] w-full"
        qandaClassName="md:pl-10"
      />
      <CustomerResearchFeatureSection featureSection={pageContent.featureSection} />
      <CustomerResearchB2BServices b2bServiceSection={pageContent.b2bServiceSection} />
      <CapabilityActionSection actionSection={pageContent.actionSection} />
    </>
  );
};

export default CapabilitiesCustomerResearchPage;
