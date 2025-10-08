// routes/routeConfig.ts - FIXED VERSION

import type { BreadcrumbItem } from '@/core/types/breadcrumb-item.type';

export const ROUTES = {
  HOME: '/',
  OUR_PANEL: '/our_panel',
  /* Industry Routes */
  INDUSTRY: '/industries',
  INDUSTRY_ADVERTISING: '/industries/advertising_marketing',
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
  CAPABILITY_BRANDING_ADVERTISING: '/capabilities/branding_advertising',
  CAPABILITY_MARKET_OPPORTUNITY: '/capabilities/market_opportunity',
  CAPABILITY_PRODUCT_RESEARCH: '/capabilities/product_research',
  CAPABILITY_CUSTOMER_RESEARCH: '/capabilities/customer_research',
  /* Research Methods */
  RESEARCH_METHODS: '/research_methods',
  RESEARCH_METHODS_QUANTITATIVE_RESEARCH:
    '/research_methods/quantitative_research',
  RESEARCH_METHODS_QUALITATIVE_RESEARCH:
    '/research_methods/qualitative_research',
  RESEARCH_METHODS_FIELDWORK: '/research_methods/fieldwork',
  RESEARCH_METHODS_FOCUS_GROUP: '/research_methods/focus_group',
  RESEARCH_METHODS_SURVEYS: '/research_methods/surveys',
  RESEARCH_METHODS_QUALITY: '/research_methods/quality',
  /* Landing */
  RESPONDENT_LANDING: '/respondent_landing',
  ADVOCATE_LANDING: '/advocate_landing',
  /* Resource Route (Blog, Article, Insights, Report, etc) */
  RESOURCES: '/resources',
  ARTICLES: '/resources/articles',
  /* Other Routes */
  CAREERS: '/careers',
  CONTACT_US: '/contact_us',
  SITE_DISCLAIMER: '/site_disclaimer',
  PRIVACY_POLICY: '/privacy_policy',
  BUSINESS_CONDUCT_ETHICS: '/business_conduct_ethics',
  AI_POLICY: '/ai_policy',
  START_YOUR_RESEARCH: '/start_your_research',
  REPORT_DOWNLOAD: '/report_download',
  AUTH: '/auth',
  SIGN_UP: '/sign_up',
  UNSUBSCRIBE: '/unsubscribe',
  EDIT_PROFILE: '/edit_profile',
  SURVEY_PAGE: '/survey_page',
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
      our_panel: 'Our Panel',
      /* Industries */
      industries: 'Industries',
      advertising_marketing: 'Advertising and Marketing',
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
      /* Capabilities */
      capabilities: 'Capabilities',
      branding_advertising: 'Branding and Advertising Communication',
      market_opportunity: 'Market Opportunity Research',
      product_research: 'Product Research',
      customer_research: 'Customer Research and Segmentation',
      /* Research Methods */
      research_methods: 'Research Methods',
      quantitative_research: 'Quantitative Research',
      qualitative_research: 'Qualitative Research',
      fieldwork: 'Recruitment and Fieldwork',
      focus_group: 'Focus Group Discussions',
      surveys: 'Surveys',
      quality: 'Participant Quality',
      /* Landing */
      respondent_landing: 'Respondent Landing',
      advocate_landing: 'Advocate Landing',
      /* Resource Route (Blog, Article, Insights, Report, etc) */
      resources: 'Resources',
      articles: 'Articles',
      /* Other */
      contact_us: 'Contact Us',
      careers: 'Careers',
      site_disclaimer: 'Site Disclaimer',
      privacy_policy: 'Privacy Policy',
      business_conduct_ethics: 'Business Conduct and Ethics Policy',
      ai_policy: 'AI Policy',
      report_download: 'Report Download',
      start_your_research: 'Start Your Research',
      auth: 'Login',
      sign_up: 'Sign Up',
      unsubscribe: 'Unsubscribe',
      edit_profile: 'Edit Profile',
      survey_page: 'Survey Page',
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
