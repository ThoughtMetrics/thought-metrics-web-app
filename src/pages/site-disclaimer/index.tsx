import { siteDisclaimerContent } from './constant';
import React from 'react';
import PolicyHeroSection from '@/shared/ui/templates/policy-hero-section';

const SiteDisclaimer: React.FC = () => {
  return (
    <PolicyHeroSection
      content={siteDisclaimerContent.content}
      head={siteDisclaimerContent.head}
    />
  );
};
export default SiteDisclaimer;
