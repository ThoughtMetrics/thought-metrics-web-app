// routes/routeConfig.ts - FIXED VERSION

import type { BreadcrumbItem } from '@/core/types/breadcrumb-item.type';

export const ROUTES = {
  HOME: '/',
  OUR_PANEL: '/our-panel',
  /* Industry Routes */
  INDUSTRY: '/industries',
  INDUSTRY_ADVERTISING: '/industries/advertising',
  INDUSTRY_INTERNET: '/industries/internet',
  INDUSTRY_RETAIL: '/industries/retail',
  INDUSTRY_HEALTHCARE: '/industries/healthcare',
  INDUSTRY_HR: '/industries/hr',
  INDUSTRY_FINANCE: '/industries/finance',
  INDUSTRY_AUTOMOTIVE: '/industries/automotive',
  INDUSTRY_EDUCATION: '/industries/education',
  INDUSTRY_FMCG: '/industries/fmcg',
  INDUSTRY_INVESTOR: '/industries/investor',
  INDUSTRY_TECHNOLOGY: '/industries/technology',
  /* Capabilities Routes */
  CAPABILITY: '/capabilities',
  CAPABILITY_BRANDING_ADVERTISING: '/capabilities/branding-advertising',
  CAPABILITY_MARKET_OPPORTUNITY: '/capabilities/market-opportunity',
  CAPABILITY_PRODUCT_RESEARCH: '/capabilities/product-research',
  CAPABILITY_CUSTOMER_RESEARCH: '/capabilities/customer-research',
  /* Research Methods */
  RESEARCH_METHODS: '/research-methods',
  RESEARCH_METHODS_QUANTITATIVE_RESEARCH:
    '/research-methods/quantitative-research',
  RESEARCH_METHODS_QUALITATIVE_RESEARCH:
    '/research-methods/qualitative-research',
  RESEARCH_METHODS_FIELDWORK: '/research-methods/fieldwork',
  RESEARCH_METHODS_FOCUS_GROUP: '/research-methods/focus-group',
  RESEARCH_METHODS_SURVEYS: '/research-methods/surveys',
  RESEARCH_METHODS_QUALITY: '/research-methods/quality',
  /* Landing */
  RESPONDENT_LANDING: '/respondent-landing',
  ADVOCATE_LANDING: '/advocate-landing',
  /* Resource Route (Blog, Article, Insights, Report, etc) */
  RESOURCES: '/resources',
  /* Other Routes */
  CAREERS: '/careers',
  CONTACT_US: '/contact-us',
  SITE_DISCLAIMER: '/site-disclaimer',
  PRIVACY_POLICY: '/privacy-policy',
  BUSINESS_CONDUCT_ETHICS: '/business-conduct-ethics',
  AI_POLICY: '/ai-policy',
  TERMS_AND_CONDITIONS: '/terms-and-conditions',
  START_YOUR_RESEARCH: '/start-your-research',
  REPORT_DOWNLOAD: '/report-download',
  LOGIN_IN: '/login',
  SIGN_UP: '/sign-up',
  UNSUBSCRIBE: '/unsubscribe',
  EDIT_PROFILE: '/edit-profile',
  SURVEY_BOARDS: '/survey-boards',
  NOT_FOUND: '*',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

export const generateBreadcrumbsFromPath = (
  pathname: string
): BreadcrumbItem[] => {
  const pathSegments = pathname.split('/').filter((segment) => segment !== '');
  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];

  let currentPath = '';

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;

    // Capitalize and format segment names
    let label = segment.charAt(0).toUpperCase() + segment.slice(1);

    // Custom labels for known segments
    const segmentLabels: Record<string, string> = {
      'our-panel': 'Our Panel',
      industries: 'Industries',
      advertising: 'Advertising and Marketing',
      internet: 'Internet and Media',
      retail: 'Retail and Merchandising',
      healthcare: 'Healthcare and Life Sciences',
      hr: 'Human Resources',
      finance: 'Finance Services & Insurance',
      automotive: 'Automotive',
      education: 'Education',
      fmcg: 'FMCG',
      investor: 'Investor',
      technology: 'Technology',
      capabilities: 'Capabilities',
      'branding-advertising': 'Branding and Advertising Communication',
      'market-opportunity': 'Market Opportunity Research',
      'product-research': 'Product Research',
      'customer-research': 'Customer Research and Segmentation',
      'research-methods': 'Research Methods',
      'quantitative-research': 'Quantitative Research',
      'qualitative-research': 'Qualitative Research',
      fieldwork: 'Recruitment and Fieldwork',
      'focus-group': 'Focus Group Discussions',
      surveys: 'Surveys',
      quality: 'Participant Quality',
      'respondent-landing': 'Respondent Landing',
      'advocate-landing': 'Advocate Landing',
      resources: 'Resources',
      articles: 'Articles',
      'contact-us': 'Contact Us',
      careers: 'Careers',
      'site-disclaimer': 'Site Disclaimer',
      'privacy-policy': 'Privacy Policy',
      'business-conduct-ethics': 'Business Conduct and Ethics Policy',
      'ai-policy': 'AI Policy',
      'terms-and-conditions': 'Terms and Conditions',
      'report-download': 'Report Download',
      'start-your-research': 'Start Your Research',
      auth: 'Login',
      'sign-up': 'Sign Up',
      unsubscribe: 'Unsubscribe',
      'edit-profile': 'Edit Profile',
      'survey-boards': 'Survey Boards',
    };

    if (segmentLabels[segment]) {
      label = segmentLabels[segment];
    }

    breadcrumbs.push({
      label,
      path: currentPath,
      isCurrentPage: isLast,
    });
  });

  return breadcrumbs;
};
