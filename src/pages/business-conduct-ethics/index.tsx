import PolicyHeroSection from '@/shared/ui/templates/policy-hero-section';
import { businessConductEthicsContent } from './constant';

const BusinessConductEthics: React.FC = () => {
  return (
    <PolicyHeroSection
      content={businessConductEthicsContent.content}
      head={businessConductEthicsContent.head}
    />
  );
};
export default BusinessConductEthics;
