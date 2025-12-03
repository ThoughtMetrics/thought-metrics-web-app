import { SurveyCampaignVector, SurveyCampaignVector1 } from '@/assets';
import { ROUTES } from '@/routes/routeConfig';
import medium_shot_smiley_business_woman_with_laptop from 'images/medium_shot_smiley_business_woman_with_laptop.png';

export const survey_campaign_constant = {
  commonIllustration: {
    industryIllustration: SurveyCampaignVector,
    industryIllustrationOverlayClass: '',
    illustration2: SurveyCampaignVector1,
  },
  heroSection: {
    title1: '3 Simple',
    title2: 'Steps',
    list: [
      { label1: 'Register', label2: 'for Free' },
      { label1: 'Participate', label2: 'in surveys' },
      { label1: 'Earn', label2: 'rewards' },
    ],
    actionButton: {
      label: 'Register Now',
      path: ROUTES.SIGN_UP,
    },
    activeActionButton: {
      label: 'Take Survey',
      path: ROUTES.SIGN_UP,
    },
    illustration: {
      img: medium_shot_smiley_business_woman_with_laptop.src,
      size: 'default',
      aspectRatio: 'portrait',
      shadowOpacity: 'full',
      objectFit: 'contain',
      loading: 'lazy',
      backgroundColor: 'transparent',
    },
  },
};
