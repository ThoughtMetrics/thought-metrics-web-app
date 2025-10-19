import HeroSection from '@/shared/ui/templates/hero-section';
import { capabilities } from '../capabilities.constant';
import { CapabilityActionSection } from '@/shared/ui/templates/action-section';
import { MarketOpportunitySection } from '@/shared/ui/templates/service-section';
import { QuestionarySection } from '@/shared/ui/templates/questionary-section';
import MarketOptFeatureSection from './components/market-opt-feature-section';
import MarketOptB2BServices from './components/market-opt-b2b-services';
const CapabilitiesMarketOpportunityPage: React.FC = () => {
  const pageContent = capabilities.market_opportunity;
  return (
    <>
      <HeroSection heroSection={pageContent.heroSection} />
      <MarketOpportunitySection serviceSection={pageContent.serviceSection} />
      <QuestionarySection
        questionarySection={pageContent.questionarySection}
        className="relative md:pb-0 pt-8 md:pt-10"
        imgClassName="md:rounded-b-none h-[30.5rem] w-full"
        qandaClassName="md:pl-10"
      />
      <MarketOptFeatureSection featureSection={pageContent.featureSection} />
      <MarketOptB2BServices b2bServiceSection={pageContent.b2bServiceSection} />
      <CapabilityActionSection actionSection={pageContent.actionSection} />
    </>
  );
};

export default CapabilitiesMarketOpportunityPage;
