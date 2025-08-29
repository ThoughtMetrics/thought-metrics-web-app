import PolicyHeroSection from '@/shared/ui/templates/policy-hero-section';
import type React from 'react';
import { aiPolicyContent } from './constant';

const AIPolicy: React.FC = () => {
  return <PolicyHeroSection content={aiPolicyContent.content} head={aiPolicyContent.head} />;
};

export default AIPolicy;
