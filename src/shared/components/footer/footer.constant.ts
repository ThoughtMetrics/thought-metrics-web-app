import { ROUTES } from '@/routes/routeConfig';

export interface FooterLinkData {
  label: string;
  signedInLabel?: string;
  signedInPath?: string;
  path: string;
  isBold?: string;
}

export interface FooterSectionData {
  title: string;
  links: FooterLinkData[];
}

export const footerData = {
  logo: '/icons/logo_white.svg',
  socialLinks: [
    {
      name: 'LinkedIn',
      icon: '/icons/linkedin.svg',
      path: 'https://www.linkedin.com/company/the-thought-metrics-company',
    },
    {
      name: 'Twitter',
      icon: '/icons/space-x.svg',
      path: 'https://x.com/thoughtmetrics',
    },
    {
      name: 'Vimeo',
      icon: '/icons/vimeo.svg',
      path: 'https://vimeo.com/thoughtmetrics',
    },
  ],
  sections: [
    {
      title: 'Research Methods',
      links: [
        {
          label: 'Qualitative Research',
          path: ROUTES.RESEARCH_METHODS_QUANTITATIVE_RESEARCH,
        },
        {
          label: 'Quantitative Research',
          path: ROUTES.RESEARCH_METHODS_QUALITATIVE_RESEARCH,
        },
        {
          label: 'Recruitment and Fieldwork',
          path: ROUTES.RESEARCH_METHODS_FIELDWORK,
        },
        { label: 'Surveys', path: ROUTES.RESEARCH_METHODS_SURVEYS },
        {
          label: 'Focus Group Discussions',
          path: ROUTES.RESEARCH_METHODS_FOCUS_GROUP,
        },
        {
          label: 'Quality Checks and Data Security',
          path: ROUTES.RESEARCH_METHODS_QUALITY,
        },
      ],
    },
    {
      title: 'Capabilities',
      links: [
        {
          label: 'Branding and Advertising Communication',
          path: ROUTES.CAPABILITY_BRANDING_ADVERTISING,
        },
        {
          label: 'Market Opportunity Research',
          path: ROUTES.CAPABILITY_MARKET_OPPORTUNITY,
        },
        { label: 'Product Research', path: ROUTES.CAPABILITY_PRODUCT_RESEARCH },
        {
          label: 'Customer Research and Segmentation',
          path: ROUTES.CAPABILITY_CUSTOMER_RESEARCH,
        },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', path: ROUTES.PRIVACY_POLICY },
        { label: 'AI Policy', path: ROUTES.AI_POLICY },
        {
          label: 'Business Conduct and Ethics',
          path: ROUTES.BUSINESS_CONDUCT_ETHICS,
        },
        { label: 'Site Disclaimer', path: ROUTES.SITE_DISCLAIMER },
      ],
    },
    {
      title: 'Connect',
      links: [
        {
          label: 'Join Our Panel',
          path: ROUTES.SIGN_UP,
          signedInLabel: 'Take a Survey',
          signedInPath: ROUTES.SURVEY_PAGE,
        },
        { label: 'Request a Bid', path: ROUTES.START_YOUR_RESEARCH },
        { label: 'Careers', path: ROUTES.CAREERS },
        { label: 'Contact Us', path: ROUTES.CONTACT_US },
        { label: 'Our Panel', path: ROUTES.OUR_PANEL, isBold: true },
      ],
    },
  ] as FooterSectionData[],
  copyright: '© Copyright 2025. All Rights Reserved.',
  backToTopIcon: '/icons/up-arrow.svg',
};
