import { ROUTES } from '@/routes/routeConfig';

export interface FooterLinkData {
  label: string;
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
      href: 'https://linkedin.com/company/thoughtmetrics',
    },
    {
      name: 'Twitter',
      icon: '/icons/space-x.svg',
      href: 'https://twitter.com/thoughtmetrics',
    },
    {
      name: 'Vimeo',
      icon: '/icons/vimeo.svg',
      href: 'https://vimeo.com/thoughtmetrics',
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
        { label: 'Privacy', href: '#' },
        { label: 'AI Policy', href: '#' },
        { label: 'Business Conduct and Ethics', href: '#' },
        { label: 'Site Disclaimer', href: '#' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'Join Our Panel', href: '#' },
        { label: 'Request a Bid', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact Us', href: '#' },
        { label: 'Our Panel', href: '#', isBold: true },
      ],
    },
  ] as FooterSectionData[],
  copyright: '© Copyright 2025. All Rights Reserved.',
  backToTopIcon: '/icons/up-arrow.svg',
};
