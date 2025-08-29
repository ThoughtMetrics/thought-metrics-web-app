import PolicyHeroSection from "@/shared/ui/templates/policy-hero-section";
import { privacyPolicyContent } from "./constant";

const PrivacyPolicy: React.FC = () => {
  return <PolicyHeroSection
      content={privacyPolicyContent.content}
      head={privacyPolicyContent.head}
    />;
};
export default PrivacyPolicy;
