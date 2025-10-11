import PolicyHeroSection from '@/shared/ui/templates/policy-hero-section';
import type React from 'react';
import { termsAndConditionsContent } from './constant';

const TermsAndConditions: React.FC = () => {
  return (
    <PolicyHeroSection
      content={termsAndConditionsContent.content}
      head={termsAndConditionsContent.head}
    />
  );
};

export default TermsAndConditions;
